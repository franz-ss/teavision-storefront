const ALLOWED_NATIVE_BUTTON_FILES = [
  'components/ui/button/button.tsx',
  'components/ui/disclosure-button/disclosure-button.tsx',
  'components/ui/icon-button/icon-button.tsx',
  'components/ui/toggle-button/toggle-button.tsx',
]

function normalizePath(filePath) {
  return filePath.replaceAll('\\', '/')
}

function isAllowedNativeButtonFile(filePath) {
  const normalizedPath = normalizePath(filePath)

  return ALLOWED_NATIVE_BUTTON_FILES.some((allowedPath) =>
    normalizedPath.endsWith(allowedPath),
  )
}

function isReactCreateElementButton(node) {
  if (node.arguments[0]?.type !== 'Literal') return false
  if (node.arguments[0].value !== 'button') return false

  if (node.callee.type === 'Identifier') {
    return node.callee.name === 'createElement'
  }

  return (
    node.callee.type === 'MemberExpression' &&
    node.callee.object.type === 'Identifier' &&
    node.callee.object.name === 'React' &&
    node.callee.property.type === 'Identifier' &&
    node.callee.property.name === 'createElement'
  )
}

export const noRawButton = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require approved button primitives instead of custom native button elements.',
    },
    messages: {
      useButtonPrimitive:
        'Do not create custom <button> elements. Use Button, IconButton, DisclosureButton, or ToggleButton instead.',
    },
    schema: [],
  },
  create(context) {
    const filename = context.filename ?? context.getFilename()
    const isAllowedFile = isAllowedNativeButtonFile(filename)

    if (isAllowedFile) {
      return {}
    }

    return {
      JSXOpeningElement(node) {
        if (node.name.type !== 'JSXIdentifier') return
        if (node.name.name !== 'button') return

        context.report({
          node,
          messageId: 'useButtonPrimitive',
        })
      },
      CallExpression(node) {
        if (!isReactCreateElementButton(node)) return

        context.report({
          node,
          messageId: 'useButtonPrimitive',
        })
      },
    }
  },
}
