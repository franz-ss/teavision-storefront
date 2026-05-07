export const noRawSection = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require the shared Section primitive for storefront layout sections.',
    },
    messages: {
      useSectionPrimitive:
        'Use Section.Root instead of raw <section> elements. Pair it with Section.Container for layout bands.',
    },
    schema: [],
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.type !== 'JSXIdentifier') return
        if (node.name.name !== 'section') return

        context.report({
          node,
          messageId: 'useSectionPrimitive',
        })
      },
    }
  },
}
