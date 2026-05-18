'use server'

import { headers } from 'next/headers'
import { Resend } from 'resend'

import {
  CUSTOM_TEA_BLEND_LIMITS,
  isCustomTeaBlendCategory,
  isCustomTeaBlendFlavour,
  isCustomTeaBlendPackFormat,
} from '@/lib/contact/custom-tea-blend'

export type ContactActionResult = {
  success: boolean
  error?: string
}

export type NewsletterSignupActionResult = ContactActionResult

type ContactSubmission = {
  name: string
  phone: string
  email: string
  message: string
  website: string
}

type CustomTeaBlendSubmission = {
  name: string
  phone: string
  email: string
  company: string
  blendCategory: string
  packFormat: string
  flavours: string[]
  brief: string
  website: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const VALIDATION_ERROR = 'Please fill in all required fields.'
const SEND_ERROR =
  'Unable to send your message right now. Please try again shortly.'
const NEWSLETTER_VALIDATION_ERROR = 'Please enter a valid email address.'
const NEWSLETTER_SEND_ERROR =
  'Unable to send your signup right now. Please try again shortly.'
const RATE_LIMIT_ERROR =
  'Too many submissions. Please wait a moment before trying again.'
const CONTACT_NAME_MAX_LENGTH = 100
const CONTACT_PHONE_MAX_LENGTH = 20
const CONTACT_EMAIL_MAX_LENGTH = 254
const CONTACT_MESSAGE_MAX_LENGTH = 2000
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_SUBMISSIONS = 5

const submissionRateLimits = new Map<
  string,
  { count: number; resetAt: number }
>()

function readStringField(formData: FormData, field: string) {
  const value = formData.get(field)
  return typeof value === 'string' ? value.trim() : ''
}

function readField(formData: FormData, field: keyof ContactSubmission) {
  return readStringField(formData, field)
}

function readStringList(formData: FormData, field: string) {
  return formData
    .getAll(field)
    .filter((value): value is string => typeof value === 'string')
    .map((value) => value.trim())
    .filter(Boolean)
}

async function getRateLimitKey(): Promise<string> {
  const requestHeaders = await headers()
  const forwardedFor = requestHeaders.get('x-forwarded-for')
  const ipAddress =
    forwardedFor?.split(',')[0]?.trim() ||
    requestHeaders.get('x-real-ip') ||
    'unknown'

  return `contact:${ipAddress}`
}

async function isRateLimited(): Promise<boolean> {
  const key = await getRateLimitKey()
  const now = Date.now()

  for (const [rateLimitKey, bucket] of submissionRateLimits) {
    if (bucket.resetAt <= now) {
      submissionRateLimits.delete(rateLimitKey)
    }
  }

  const bucket = submissionRateLimits.get(key)

  if (!bucket) {
    submissionRateLimits.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    })
    return false
  }

  if (bucket.count >= RATE_LIMIT_MAX_SUBMISSIONS) {
    return true
  }

  bucket.count += 1
  return false
}

function readSubmission(formData: FormData): ContactSubmission {
  return {
    name: readField(formData, 'name'),
    phone: readField(formData, 'phone'),
    email: readField(formData, 'email'),
    message: readField(formData, 'message'),
    website: readField(formData, 'website'),
  }
}

function readCustomTeaBlendSubmission(
  formData: FormData,
): CustomTeaBlendSubmission {
  return {
    name: readStringField(formData, 'name'),
    phone: readStringField(formData, 'phone'),
    email: readStringField(formData, 'email'),
    company: readStringField(formData, 'company'),
    blendCategory: readStringField(formData, 'blendCategory'),
    packFormat: readStringField(formData, 'packFormat'),
    flavours: readStringList(formData, 'flavours'),
    brief: readStringField(formData, 'brief'),
    website: readStringField(formData, 'website'),
  }
}

function isValidSubmission(submission: ContactSubmission) {
  if (!submission.name || submission.name.length > CONTACT_NAME_MAX_LENGTH) {
    return false
  }
  if (
    !submission.email ||
    submission.email.length > CONTACT_EMAIL_MAX_LENGTH ||
    !EMAIL_PATTERN.test(submission.email)
  ) {
    return false
  }
  if (
    !submission.message ||
    submission.message.length > CONTACT_MESSAGE_MAX_LENGTH
  ) {
    return false
  }
  if (submission.phone.length > CONTACT_PHONE_MAX_LENGTH) return false
  return submission.website.length === 0
}

function isValidCustomTeaBlendSubmission(submission: CustomTeaBlendSubmission) {
  if (submission.company.length > CUSTOM_TEA_BLEND_LIMITS.field) {
    return false
  }

  if (
    !submission.brief ||
    submission.brief.length > CUSTOM_TEA_BLEND_LIMITS.brief
  ) {
    return false
  }

  if (
    !isCustomTeaBlendCategory(submission.blendCategory) ||
    !isCustomTeaBlendPackFormat(submission.packFormat)
  ) {
    return false
  }

  if (
    submission.flavours.length > CUSTOM_TEA_BLEND_LIMITS.maxFlavours ||
    submission.flavours.some(
      (flavour) =>
        flavour.length > CUSTOM_TEA_BLEND_LIMITS.flavour ||
        !isCustomTeaBlendFlavour(flavour),
    )
  ) {
    return false
  }

  return true
}

function formatSubmission(submission: ContactSubmission) {
  return [
    'New Teavision contact enquiry',
    '',
    `Name: ${submission.name}`,
    `Phone: ${submission.phone || 'Not provided'}`,
    `Email: ${submission.email}`,
    '',
    'Message:',
    submission.message,
  ].join('\n')
}

function formatCustomTeaBlendSubmission(submission: CustomTeaBlendSubmission) {
  return [
    'Custom tea blend enquiry',
    '',
    `Company: ${submission.company || 'Not provided'}`,
    `Blend category: ${submission.blendCategory || 'Not provided'}`,
    `Preferred format: ${submission.packFormat || 'Not provided'}`,
    `Selected flavours: ${submission.flavours.join(', ') || 'Not provided'}`,
    '',
    'Project brief:',
    submission.brief,
  ].join('\n')
}

async function submitContactSubmission(
  submission: ContactSubmission,
): Promise<ContactActionResult> {
  if (submission.website) {
    return { success: true }
  }

  if (!isValidSubmission(submission)) {
    return { success: false, error: VALIDATION_ERROR }
  }

  if (await isRateLimited()) {
    return { success: false, error: RATE_LIMIT_ERROR }
  }

  if (!process.env.RESEND_API_KEY) {
    return { success: false, error: SEND_ERROR }
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: 'Teavision Contact <noreply@teavision.com.au>',
      to: 'info@teavision.com.au',
      subject: `New enquiry from ${submission.name}`,
      text: formatSubmission(submission),
      replyTo: submission.email,
    })

    if (error) {
      console.error('Resend contact form error', error)
      return { success: false, error: SEND_ERROR }
    }

    return { success: true }
  } catch (error: unknown) {
    console.error('Contact form submission failed', error)
    return { success: false, error: SEND_ERROR }
  }
}

export async function sendContactAction(
  formData: FormData,
): Promise<ContactActionResult> {
  const submission = readSubmission(formData)

  return submitContactSubmission(submission)
}

export async function sendCustomTeaBlendAction(
  formData: FormData,
): Promise<ContactActionResult> {
  const submission = readCustomTeaBlendSubmission(formData)

  if (submission.website) {
    return { success: true }
  }

  if (!isValidCustomTeaBlendSubmission(submission)) {
    return { success: false, error: VALIDATION_ERROR }
  }

  const message = formatCustomTeaBlendSubmission(submission)

  if (message.length > CONTACT_MESSAGE_MAX_LENGTH) {
    return { success: false, error: VALIDATION_ERROR }
  }

  return submitContactSubmission({
    name: submission.name,
    phone: submission.phone,
    email: submission.email,
    message,
    website: submission.website,
  })
}

export async function sendCustomTeaBlendFormAction(
  _previousState: ContactActionResult,
  formData: FormData,
): Promise<ContactActionResult> {
  return sendCustomTeaBlendAction(formData)
}

export async function submitContactFormAction(formData: FormData) {
  await sendContactAction(formData)
}

export async function sendNewsletterSignupAction(
  formData: FormData,
): Promise<NewsletterSignupActionResult> {
  const email = readField(formData, 'email')
  const website = readField(formData, 'website')

  if (website) {
    return { success: true }
  }

  if (
    !email ||
    email.length > CONTACT_EMAIL_MAX_LENGTH ||
    !EMAIL_PATTERN.test(email)
  ) {
    return { success: false, error: NEWSLETTER_VALIDATION_ERROR }
  }

  if (await isRateLimited()) {
    return { success: false, error: RATE_LIMIT_ERROR }
  }

  if (!process.env.RESEND_API_KEY) {
    return { success: false, error: NEWSLETTER_SEND_ERROR }
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: 'Teavision Newsletter <noreply@teavision.com.au>',
      to: 'info@teavision.com.au',
      subject: 'New Tea Journal newsletter signup',
      text: `Please add this email to the Tea Journal newsletter list:\n\n${email}`,
      replyTo: email,
    })

    if (error) {
      console.error('Resend newsletter signup error', error)
      return { success: false, error: NEWSLETTER_SEND_ERROR }
    }

    return { success: true }
  } catch (error: unknown) {
    console.error('Newsletter signup failed', error)
    return { success: false, error: NEWSLETTER_SEND_ERROR }
  }
}

export async function submitNewsletterSignupFormAction(formData: FormData) {
  await sendNewsletterSignupAction(formData)
}
