'use server'

import { Resend } from 'resend'

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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const VALIDATION_ERROR = 'Please fill in all required fields.'
const SEND_ERROR =
  'Unable to send your message right now. Please try again shortly.'
const NEWSLETTER_VALIDATION_ERROR = 'Please enter a valid email address.'
const NEWSLETTER_SEND_ERROR =
  'Unable to send your signup right now. Please try again shortly.'

function readField(formData: FormData, field: keyof ContactSubmission) {
  const value = formData.get(field)
  return typeof value === 'string' ? value.trim() : ''
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

function isValidSubmission(submission: ContactSubmission) {
  if (!submission.name || submission.name.length > 100) return false
  if (
    !submission.email ||
    submission.email.length > 254 ||
    !EMAIL_PATTERN.test(submission.email)
  ) {
    return false
  }
  if (!submission.message || submission.message.length > 2000) return false
  if (submission.phone.length > 20) return false
  return submission.website.length === 0
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

export async function sendContactAction(
  formData: FormData,
): Promise<ContactActionResult> {
  const submission = readSubmission(formData)

  if (submission.website) {
    return { success: true }
  }

  if (!isValidSubmission(submission)) {
    return { success: false, error: VALIDATION_ERROR }
  }

  if (!process.env.RESEND_API_KEY) {
    console.info('Contact form submission', {
      name: submission.name,
      phone: submission.phone || null,
      email: submission.email,
      message: submission.message,
    })
    return { success: true }
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

  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return { success: false, error: NEWSLETTER_VALIDATION_ERROR }
  }

  if (!process.env.RESEND_API_KEY) {
    console.info('Newsletter signup', { email })
    return { success: true }
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
