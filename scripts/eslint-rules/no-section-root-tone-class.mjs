function isSectionRootName(name) {
  return (
    name.type === 'JSXMemberExpression' &&
    name.object.type === 'JSXIdentifier' &&
    name.object.name === 'Section' &&
    name.property.type === 'JSXIdentifier' &&
    name.property.name === 'Root'
  )
}

function hasToneClass(sourceText) {
  return /\bbg-[\w/:.-]+|\btext-on-brand\b/.test(sourceText)
}

export const noSectionRootToneClass = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require Section.Root tone variants instead of background or foreground classes.',
    },
    messages: {
      useToneVariant:
        'Use the Section.Root tone prop instead of background or on-brand foreground classes.',
    },
    schema: [],
  },
  create(context) {
    const sourceCode = context.sourceCode

    return {
      JSXOpeningElement(node) {
        if (!isSectionRootName(node.name)) return

        const classNameAttribute = node.attributes.find(
          (attribute) =>
            attribute.type === 'JSXAttribute' &&
            attribute.name.name === 'className',
        )
        if (!classNameAttribute?.value) return

        if (!hasToneClass(sourceCode.getText(classNameAttribute.value))) return

        context.report({
          node: classNameAttribute,
          messageId: 'useToneVariant',
        })
      },
    }
  },
}
