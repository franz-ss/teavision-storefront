export type ActionResult = {
  success: boolean
  error?: string
}

export type Action = (
  previousState: ActionResult,
  formData: FormData,
) => Promise<ActionResult>
