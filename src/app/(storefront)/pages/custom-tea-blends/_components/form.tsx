'use client'

import { useState } from 'react'

import { FormFields } from './form-fields'
import type { Action } from './form-types'

type FormProps = {
  action: Action
}

export function Form({ action }: FormProps) {
  const [formKey, setFormKey] = useState(0)

  return (
    <FormFields
      key={formKey}
      action={action}
      onReset={() => setFormKey((key) => key + 1)}
    />
  )
}
