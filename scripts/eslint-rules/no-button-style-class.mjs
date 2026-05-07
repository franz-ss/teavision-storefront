function isButtonImportSource(value) {
  return [
    './button',
    './button/button',
    '../button',
    '../button/button',
    '@/components/ui',
    '@/components/ui/button',
    '@/components/ui/button/button',
  ].includes(value)
}

function isButtonName(name, buttonLocalNames, uiNamespaceNames) {
  if (name.type === 'JSXIdentifier') {
    return name.name === 'Button' || buttonLocalNames.has(name.name)
  }

  return (
    name.type === 'JSXMemberExpression' &&
    name.object.type === 'JSXIdentifier' &&
    name.property.type === 'JSXIdentifier' &&
    uiNamespaceNames.has(name.object.name) &&
    name.property.name === 'Button'
  )
}

function getClassNameAttribute(node) {
  return node.attributes.find(
    (attribute) =>
      attribute.type === 'JSXAttribute' && attribute.name.name === 'className',
  )
}

function getStringLiteralValue(node) {
  if (!node) return null
  if (node.type === 'Literal' && typeof node.value === 'string') {
    return node.value
  }
  if (node.type === 'TemplateLiteral' && node.expressions.length === 0) {
    return node.quasis.map((quasi) => quasi.value.cooked ?? '').join('')
  }
  return null
}

function collectClassTokensFromExpression(node, state) {
  const literalValue = getStringLiteralValue(node)
  if (literalValue !== null) {
    state.tokens.push(...splitClassTokens(literalValue))
    return
  }

  if (node.type === 'CallExpression' && node.callee.type === 'Identifier') {
    if (node.callee.name !== 'cn') {
      state.hasUnknownDynamicClass = true
      return
    }

    for (const argument of node.arguments) {
      collectClassTokensFromExpression(argument, state)
    }
    return
  }

  if (node.type === 'LogicalExpression') {
    collectClassTokensFromExpression(node.right, state)
    return
  }

  if (node.type === 'ConditionalExpression') {
    collectClassTokensFromExpression(node.consequent, state)
    collectClassTokensFromExpression(node.alternate, state)
    return
  }

  if (node.type === 'ArrayExpression') {
    for (const element of node.elements) {
      if (element) collectClassTokensFromExpression(element, state)
    }
    return
  }

  if (
    node.type === 'Literal' &&
    (node.value === false || node.value === null || node.value === undefined)
  ) {
    return
  }

  if (
    node.type === 'Identifier' &&
    ['false', 'null', 'undefined'].includes(node.name)
  ) {
    return
  }

  state.hasUnknownDynamicClass = true
}

function collectClassTokens(attributeValue) {
  const state = {
    hasUnknownDynamicClass: false,
    tokens: [],
  }

  if (!attributeValue) return state

  if (attributeValue.type === 'Literal') {
    state.tokens.push(...splitClassTokens(attributeValue.value))
    return state
  }

  if (attributeValue.type === 'JSXExpressionContainer') {
    collectClassTokensFromExpression(attributeValue.expression, state)
    return state
  }

  state.hasUnknownDynamicClass = true
  return state
}

function splitClassTokens(value) {
  if (typeof value !== 'string') return []
  return value.split(/\s+/).filter(Boolean)
}

function stripVariants(className) {
  const segments = className.split(':')
  return segments[segments.length - 1] ?? className
}

function isLayoutClass(className) {
  const baseClass = stripVariants(className)

  return [
    /^-?(m|mx|my|mt|mr|mb|ml|ms|me)-/,
    /^(w|min-w|max-w)-/,
    /^(basis|grow|shrink|order)-/,
    /^(col|row)-(span|start|end|auto|\d+)/,
    /^(block|inline-block|inline|flex|inline-flex|grid|inline-grid|hidden|contents)$/,
    /^(static|fixed|absolute|relative|sticky)$/,
    /^(inset|top|right|bottom|left|start|end)-/,
    /^z-/,
    /^(overflow|overflow-x|overflow-y)-/,
  ].some((pattern) => pattern.test(baseClass))
}

export const noButtonStyleClass = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Restrict Button className to layout utilities so visual styling stays in Button variants.',
    },
    messages: {
      dynamicClassName:
        'Button className must be statically checkable and may only contain layout utilities. Move visual styling into Button variants or sizes.',
      visualClassName:
        'Button className may only contain layout utilities. Move visual styling into Button variants or sizes. Invalid: {{classes}}.',
    },
    schema: [],
  },
  create(context) {
    const buttonLocalNames = new Set()
    const uiNamespaceNames = new Set()

    return {
      ImportDeclaration(node) {
        if (
          typeof node.source.value !== 'string' ||
          !isButtonImportSource(node.source.value)
        ) {
          return
        }

        for (const specifier of node.specifiers) {
          if (
            specifier.type === 'ImportSpecifier' &&
            specifier.imported.type === 'Identifier' &&
            specifier.imported.name === 'Button'
          ) {
            buttonLocalNames.add(specifier.local.name)
          }

          if (specifier.type === 'ImportNamespaceSpecifier') {
            uiNamespaceNames.add(specifier.local.name)
          }
        }
      },
      JSXOpeningElement(node) {
        if (!isButtonName(node.name, buttonLocalNames, uiNamespaceNames)) return

        const classNameAttribute = getClassNameAttribute(node)
        if (!classNameAttribute) return

        const { hasUnknownDynamicClass, tokens } = collectClassTokens(
          classNameAttribute.value,
        )

        if (hasUnknownDynamicClass) {
          context.report({
            node: classNameAttribute,
            messageId: 'dynamicClassName',
          })
          return
        }

        const invalidTokens = tokens.filter((token) => !isLayoutClass(token))
        if (invalidTokens.length === 0) return

        context.report({
          node: classNameAttribute,
          messageId: 'visualClassName',
          data: {
            classes: invalidTokens.join(', '),
          },
        })
      },
    }
  },
}
