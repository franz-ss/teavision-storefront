/* ============================================================
   TEAVISION — Data layer (plain JS → window.TV)
   ============================================================ */
;(function () {
  const icon = {
    leaf: 'leaf',
    flask: 'flask',
    medal: 'medal',
    truck: 'truck',
    flag: 'flag',
    globe: 'globe',
    shield: 'shield',
    spark: 'spark',
  }

  // Product range tiles (homepage)
  const range = [
    {
      title: 'Wholesale Bulk Tea',
      sub: 'Loose leaf, by the kilo',
      href: 'tea',
      tag: '1,000+ lines',
    },
    {
      title: 'Herbs, Spices & Botanicals',
      sub: 'Wild-grown & certified organic',
      href: 'herbs',
      tag: 'Ethically sourced',
    },
    {
      title: 'Speciality Blends',
      sub: 'Signature & seasonal',
      href: 'speciality',
      tag: 'Award-winning',
    },
    {
      title: 'Functional Wellness Tea',
      sub: 'Sleep, detox, immunity',
      href: 'wellness',
      tag: 'Naturopath-led',
    },
    {
      title: 'Café Range',
      sub: 'Service-ready formats',
      href: 'cafe',
      tag: 'Barista loved',
    },
    {
      title: 'Australian Native Tea',
      sub: 'Lemon myrtle & beyond',
      href: 'native',
      tag: 'Grown here',
    },
    {
      title: 'Bulk Tea Bag Packs',
      sub: 'Pyramid & envelope',
      href: 'teabags',
      tag: 'Cafe ready',
    },
    {
      title: 'Superfood & Supplements',
      sub: 'Powders, extracts, proteins',
      href: 'superfood',
      tag: 'High potency',
    },
  ]

  // Trust stats (preserve from current brand)
  const stats = [
    { k: 'Australian', v: 'Owned & operated since 2014', ic: 'flag' },
    { k: '#1', v: 'Tea & herb wholesale supplier', ic: 'truck' },
    {
      k: '1,000+',
      v: 'Ingredient lines · 500+ certified organic',
      ic: 'flask',
    },
    { k: '15+', v: 'Golden Leaf awards incl. 5 gold', ic: 'medal' },
  ]

  // Services
  const services = [
    {
      title: 'Custom Tea Blending',
      n: '01',
      body: 'Our tea masters and naturopaths translate your brief into a signature blend — flavour, function and aroma, dialled in.',
      tag: 'From 20kg',
    },
    {
      title: 'Private Label & Packing',
      n: '02',
      body: 'Turnkey blending, filling, sealing and labelling under your own brand. Pouches, tins, cylinders and luxury finishes.',
      tag: 'Turnkey',
    },
    {
      title: 'Tea Bag Manufacture',
      n: '03',
      body: 'Pyramid and enveloped tea bags produced in-house to HACCP standard — from bulk café packs to retail cartons.',
      tag: 'In-house',
    },
  ]

  // Mega-menu structure
  const nav = {
    Tea: {
      blurb:
        'From single-origin loose leaf to award-winning blends — sold by the kilogram.',
      cols: [
        {
          h: 'By type',
          items: [
            'Black Tea',
            'Green Tea',
            'White Tea',
            'Oolong Tea',
            'Pu-erh Tea',
            'Matcha',
          ],
        },
        {
          h: 'Blends',
          items: [
            'Speciality Blends',
            'Chai',
            'Wellness & Functional',
            'Cocktail & Iced',
            "Tea Masters' Selection",
          ],
        },
        {
          h: 'Origin',
          items: [
            'Australian Native',
            'Certified Organic',
            'Single Origin',
            'Rare & Exclusive',
          ],
        },
      ],
      feature: {
        tag: 'New season',
        title: "Tea Masters' Selection",
        sub: 'The rarest lots we source, all year.',
      },
    },
    'Tea Bags': {
      blurb: 'Service-ready formats for cafés, restaurants and retailers.',
      cols: [
        {
          h: 'Formats',
          items: [
            'Pyramid Tea Bags',
            'Enveloped & Tagged',
            'Café Bulk Packs',
            'String & Tag',
          ],
        },
        {
          h: 'Ranges',
          items: ['Organic Range', 'Everyday Range', 'Wellness Range'],
        },
      ],
      feature: {
        tag: 'Café ready',
        title: 'Bulk Tea Bag Packs',
        sub: '100s per case, brew-consistent.',
      },
    },
    'Herbs & Spices': {
      blurb:
        'Wild-grown herbs and certified-organic spices, sourced direct from farm.',
      cols: [
        {
          h: 'Herbs',
          items: [
            'Peppermint',
            'Chamomile',
            'Lemon Balm',
            'Nettle Leaf',
            'Rooibos',
          ],
        },
        {
          h: 'Spices',
          items: ['Turmeric', 'Cinnamon', 'Cardamom', 'Ginger', 'Star Anise'],
        },
        {
          h: 'Botanicals',
          items: ['Rose Buds', 'Hibiscus', 'Calendula', 'Elderberries'],
        },
      ],
      feature: {
        tag: 'Direct trade',
        title: 'Certified Organic Spices',
        sub: 'Freight-insured, farm to floor.',
      },
    },
    Superfoods: {
      blurb: 'Powders, extracts, proteins and supplements at potency.',
      cols: [
        {
          h: 'Powders',
          items: ['Matcha Powder', 'Turmeric Powder', 'Cacao', 'Beetroot'],
        },
        {
          h: 'Extracts',
          items: [
            'Green Tea Extract',
            'Black Tea Extract',
            'Botanical Extracts',
          ],
        },
      ],
      feature: {
        tag: 'High potency',
        title: 'Superfood Powders',
        sub: 'Lab-verified actives.',
      },
    },
  }

  const services_menu = [
    { t: 'Custom Tea Blending', s: 'Your signature blend' },
    { t: 'Private Label & Packing', s: 'Your brand, turnkey' },
    { t: 'Tea Bag Manufacture', s: 'Pyramid & enveloped' },
    { t: 'New Product Development', s: 'Concept to shelf' },
    { t: 'Bulk Wholesale Supply', s: '100kg+ accounts' },
    { t: 'Certifications', s: 'ACO · USDA · HACCP' },
  ]

  // Collection products (used on collection + as best sellers)
  const P = (
    id,
    name,
    origin,
    type,
    grade,
    price,
    kg,
    tags,
    organic,
    blurb,
  ) => ({ id, name, origin, type, grade, price, kg, tags, organic, blurb })

  const products = [
    P(
      'p01',
      'Australian Breakfast',
      'Australia',
      'Black',
      'OP1',
      '18.50',
      '/100g',
      ['Best seller', 'Native'],
      true,
      'Madagascan vanilla bean blended with premium white tea and rose petals over a robust Australian black base. A repeat-order morning cup.',
    ),
    P(
      'p02',
      'French Earl Grey',
      'Sri Lanka',
      'Black',
      'FBOP',
      '16.00',
      '/100g',
      ['Best seller'],
      true,
      'Ceylon black tea lifted with bergamot, cornflower and a whisper of rose. The most-loved Earl Grey we pour.',
    ),
    P(
      'p03',
      'Sencha Shincha',
      'Australia',
      'Green',
      'Grade A',
      '24.00',
      '/100g',
      ['Native', 'Limited'],
      true,
      'First-flush green grown in the Australian alpine. Bright, vegetal and clean — accumulated winter nutrients in every leaf.',
    ),
    P(
      'p04',
      'Iron Goddess Oolong',
      'China',
      'Oolong',
      'Grade A',
      '32.00',
      '/100g',
      ['Rare'],
      true,
      'Tieguanyin, hand-rolled and roasted. An intense aromatic brew, floral and lingering, with renowned health credentials.',
    ),
    P(
      'p05',
      'Silver Needle White',
      'China',
      'White',
      'Grade A',
      '46.00',
      '/100g',
      ['Rare', 'Limited'],
      true,
      'Fujian Baihao Yinzhen — only the unopened buds, downy and sweet. The most delicate tea on the bench.',
    ),
    P(
      'p06',
      'Masala Sticky Chai',
      'India',
      'Chai',
      'Loose',
      '19.50',
      '/100g',
      ['Best seller'],
      false,
      'Honey-bound black tea with cardamom, ginger, cinnamon and clove. Café-ready, brews thick and golden with milk.',
    ),
    P(
      'p07',
      'Caramel Shimmer',
      'Blend',
      'Speciality',
      'Gold medal',
      '21.00',
      '/100g',
      ['Award', 'Limited'],
      false,
      'Our Golden-Leaf gold-medal blend — buttery caramel over black tea with a soft shimmer finish. A dessert in a cup.',
    ),
    P(
      'p08',
      'Premium Matcha',
      'Japan',
      'Matcha',
      'Ceremonial',
      '58.00',
      '/100g',
      ['High grade'],
      true,
      'Stone-ground ceremonial matcha, vivid green and umami-rich. Whisks to a clean, sweet froth.',
    ),
    P(
      'p09',
      'Organic Peppermint',
      'Egypt',
      'Herbal',
      'Cut',
      '12.00',
      '/100g',
      ['Caffeine-free'],
      true,
      'Mentha piperita, refreshing and menthol-bright. Aids digestion and soothes — a wellness staple by the kilo.',
    ),
    P(
      'p10',
      'Rooibos Loose Chai',
      'South Africa',
      'Chai',
      'Loose',
      '15.50',
      '/100g',
      ['Caffeine-free'],
      true,
      'Naturally sweet red rooibos spiced for a caffeine-free chai. Warming, smooth and endlessly drinkable.',
    ),
    P(
      'p11',
      'Lemon Myrtle',
      'Australia',
      'Native',
      'Cut',
      '17.00',
      '/100g',
      ['Native', 'Caffeine-free'],
      true,
      "Australia's signature botanical — intensely citrus, clean and uplifting. Pure native, grown on country.",
    ),
    P(
      'p12',
      'Champagne Oolong',
      'China',
      'Oolong',
      'Grade A',
      '34.00',
      '/100g',
      ['Speciality'],
      true,
      'A celebratory oolong with effervescent stone-fruit notes. Light, lifted and quietly luxurious.',
    ),
  ]

  const filters = {
    type: [
      'Black',
      'Green',
      'White',
      'Oolong',
      'Chai',
      'Matcha',
      'Herbal',
      'Native',
      'Speciality',
    ],
    attr: [
      'Certified Organic',
      'Caffeine-free',
      'Award-winning',
      'Best seller',
      'Rare & Limited',
      'Native grown',
    ],
    origin: [
      'Australia',
      'China',
      'India',
      'Japan',
      'Sri Lanka',
      'South Africa',
      'Egypt',
      'Blend',
    ],
  }

  // Testimonials (real brand partners)
  const testimonials = [
    {
      brand: 'MOOD Tea',
      who: 'Ashley McGrath',
      role: 'GM, Social Enterprise',
      quote:
        'Teavision has been an exceptional partner from day one — responsive, proactive and genuinely invested in our success. Their reliable supply lets us channel more into our social mission.',
    },
    {
      brand: 'ST. ALi',
      who: 'Lucy Ward',
      role: 'Product',
      quote:
        'An outstanding supplier and trusted partner in bringing our products to life. Professional, detail-oriented and seamless across multiple product lines.',
    },
    {
      brand: 'Remedy Drinks',
      who: 'Julia Blair',
      role: 'Global Head of Manufacturing',
      quote:
        'Their efficient sourcing and deep understanding of our supply chain delivered real cost savings without compromising quality. On-time, in-full, every time.',
    },
    {
      brand: 'Buy Organics Online',
      who: 'Lucas',
      role: 'Owner',
      quote:
        'Invaluable in navigating the complexities of sourcing quality products. Having them close by reduces risk and opens their whole network to us.',
    },
  ]

  // Certifications / awards
  const certs = [
    'ACO Certified Organic',
    'USDA Organic',
    'HACCP Food Safety',
    'Golden Leaf Awards',
    'Australian Made',
    'Freight Insured',
  ]

  // Supply-chain protection points
  const supply = [
    {
      t: 'Import & freight insurance',
      s: 'Every ingredient, every shipment — fully covered, money-back.',
    },
    {
      t: 'Direct-from-source farms',
      s: 'Exclusive relationships across 15+ countries, ethically grown.',
    },
    {
      t: 'HACCP-certified handling',
      s: 'Consistent quality from receival to dispatch.',
    },
    {
      t: 'Full traceability',
      s: 'Tracking and freight detail on every order you place.',
    },
  ]

  // Journal
  const journal = [
    {
      date: 'Apr 30, 2026',
      cat: 'Spice',
      t: 'How cafés create signature blends using bulk spices',
      d: "The right combination can transform any cup — here's how to build a blend that's unmistakably yours.",
    },
    {
      date: 'Apr 30, 2026',
      cat: 'Business',
      t: 'Why buying spices in bulk reduces waste and boosts margin',
      d: 'Waste reduction and cost control without compromising the quality your menu is known for.',
    },
    {
      date: 'Apr 23, 2026',
      cat: 'Sourcing',
      t: 'Understanding spice grades and quality standards',
      d: 'For wholesale buyers, sourcing well means far more than finding the lowest price.',
    },
  ]

  const faqs = [
    {
      q: 'What types of tea do you offer?',
      a: 'A complete range of traditional and premium teas plus botanical herbs and custom blends — over 1,000 lines, 500+ certified organic. Talk to our sales team about developing your own blend.',
    },
    {
      q: 'What are the terms for wholesale purchases?',
      a: 'Wholesale pricing is available directly on our website. For volumes over 100kg you can apply for a bulk wholesale account and unlock further discounts. Contact our team to get set up.',
    },
    {
      q: 'How do I place a retail order?',
      a: 'Add products to your cart and check out directly on the site. We accept all major cards, PayPal, Apple Pay and Shop Pay.',
    },
    {
      q: 'Do you provide custom blending?',
      a: 'Yes — for both retail and wholesale. Our tea masters and naturopath will work to your brief and create a unique, safe and effective blend, with packaging to match your brand.',
    },
    {
      q: 'Where do you ship?',
      a: 'Australia-wide as standard, with worldwide freight available for wholesale and private-label clients. Every shipment is insured and tracked end to end.',
    },
  ]

  window.TV = {
    range,
    stats,
    services,
    nav,
    services_menu,
    products,
    filters,
    testimonials,
    certs,
    supply,
    journal,
    faqs,
    icon,
  }
})()
