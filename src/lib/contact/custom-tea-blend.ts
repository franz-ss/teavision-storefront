export type CustomTeaBlendFlavourGroup = {
  name: string
  options: string[]
}

export const CUSTOM_TEA_BLEND_PAGE_PATH = '/pages/custom-tea-blends'
export const CUSTOM_TEA_BLEND_PAGE_TITLE = 'Custom Tea Blending'
export const CUSTOM_TEA_BLEND_META_TITLE =
  'Custom Tea Blends | NPD, R&D & Private Label'
export const CUSTOM_TEA_BLEND_DESCRIPTION =
  'Create your signature tea with Teavision custom blending, R&D support, naturopath input, low MOQ pathways, and retail-ready packaging.'
export const CUSTOM_TEA_BLEND_FORM_ID = 'custom-tea-blend-form'

export const CUSTOM_TEA_BLEND_LIMITS = {
  brief: 1200,
  field: 100,
  flavour: 40,
  maxFlavours: 12,
} as const

export const CUSTOM_TEA_BLEND_CATEGORIES = [
  'Loose-leaf tea',
  'Herbal and botanicals',
  'Pyramid tea bags',
  'Powders and instant',
  'Iced and cold-brew',
  'Chai and spice',
  'Boxes and sachets',
  'Wellness special',
]

export const CUSTOM_TEA_BLEND_PACK_FORMATS = [
  'Pouch',
  'Tin or canister',
  'Boxed sachets',
  'Pyramid tea bags',
  'Bulk foodservice',
]

export const CUSTOM_TEA_BLEND_FLAVOUR_GROUPS = [
  {
    name: 'Fruity',
    options: ['Peach', 'Mango', 'Passionfruit', 'Berry Mix', 'Apple'],
  },
  {
    name: 'Citrus',
    options: ['Lemon', 'Lime', 'Orange', 'Grapefruit', 'Yuzu'],
  },
  {
    name: 'Herbal and spice',
    options: ['Mint', 'Ginger', 'Lemongrass', 'Cinnamon', 'Cardamom'],
  },
  {
    name: 'Indulgent',
    options: ['Vanilla', 'Caramel', 'Chocolate', 'Honeycomb'],
  },
  {
    name: 'Floral',
    options: ['Jasmine', 'Rose', 'Lavender', 'Elderflower'],
  },
  {
    name: 'Functional',
    options: ['Ashwagandha', 'Ginseng', 'Reishi', 'Turmeric', 'Matcha'],
  },
] satisfies CustomTeaBlendFlavourGroup[]

const CUSTOM_TEA_BLEND_CATEGORY_SET = new Set(CUSTOM_TEA_BLEND_CATEGORIES)
const CUSTOM_TEA_BLEND_PACK_FORMAT_SET = new Set(CUSTOM_TEA_BLEND_PACK_FORMATS)
const CUSTOM_TEA_BLEND_FLAVOUR_SET = new Set(
  CUSTOM_TEA_BLEND_FLAVOUR_GROUPS.flatMap((group) => group.options),
)

export function isCustomTeaBlendCategory(value: string): boolean {
  return CUSTOM_TEA_BLEND_CATEGORY_SET.has(value)
}

export function isCustomTeaBlendPackFormat(value: string): boolean {
  return CUSTOM_TEA_BLEND_PACK_FORMAT_SET.has(value)
}

export function isCustomTeaBlendFlavour(value: string): boolean {
  return CUSTOM_TEA_BLEND_FLAVOUR_SET.has(value)
}
