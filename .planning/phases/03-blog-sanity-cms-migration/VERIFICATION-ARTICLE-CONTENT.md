# Blog Migration Article Verification

Generated from Shopify Storefront API, the crawled blog sitemap, the live blog listing, and authenticated Sanity GROQ reads.

## Summary

- Source Shopify articles: 82
- Source sitemap articles: 82
- Target Sanity blog posts: 82
- Missing target articles: 0
- Extra target articles: 0
- Fully matched under strict active-body 1:1 criteria: 0
- Partially matched: 82
- Needs review: 0

All titles, slugs, published dates, authors, featured image presence, featured image alt values, tags/categories, and legacy Shopify HTML matched the source set. However, the active Sanity Portable Text body is not a 1:1 copy of Shopify HTML. The original HTML is preserved in `legacy.contentHtml`, but the storefront currently renders `body` first, so visible article content is lossy unless the body conversion is improved or the HTML fallback is used.

## Issue Legend

- EX: excerpt generated/fallback, not exact Shopify excerpt.
- SEO: SEO description generated/fallback, not exact Shopify SEO description.
- LINKS: links missing from active Portable Text body.
- FMT: inline formatting/list/table semantics simplified in active Portable Text body.
- HEAD: heading structure/count differs in active Portable Text body.
- IMG: inline images missing from active Portable Text body.

## Per-Article Results

| Status            | Article                                                                          | URL slug                                                                          | Issues                    |
| ----------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------- |
| Partially matched | How Cafés and Restaurants can Create Signature Blends Using Bulk Spices          | `how-cafes-and-restaurants-can-create-signature-blends-using-bulk-spices`         | EX, SEO, LINKS            |
| Partially matched | Why Buying Spices in Bulk Helps Reduce Waste and Boost Profit Margins            | `why-buying-spices-in-bulk-helps-reduce-waste-and-boost-profit-margins`           | EX, SEO, LINKS            |
| Partially matched | Wholesale Herbs and Spices: The Secret to Consistent Menu Flavour                | `wholesale-herbs-and-spices-the-secret-to-consistent-menu-flavour`                | EX, SEO, LINKS            |
| Partially matched | How to Streamline Ingredient Costs with Bulk Spice Purchasing                    | `how-to-streamline-ingredient-costs-with-bulk-spice-purchasing`                   | EX, SEO, LINKS            |
| Partially matched | Essential Spices Every Café and Restaurant Should Keep in Stock                  | `essential-spices-every-cafe-and-restaurant-should-keep-in-stock`                 | EX, SEO, LINKS            |
| Partially matched | Understanding Spice Grades and Quality Standards for Wholesale Buyers            | `understanding-spice-grades-and-quality-standards-for-wholesale-buyers`           | EX, LINKS, FMT            |
| Partially matched | Sustainable and Ethical Spice Sourcing: What to Look for in Suppliers            | `sustainable-and-ethical-spice-sourcing-what-to-look-for-in-suppliers`            | EX, SEO, LINKS, FMT       |
| Partially matched | How to Choose a Reliable Wholesale Spice Supplier in Australia                   | `how-to-choose-a-reliable-wholesale-spice-supplier-in-australia`                  | EX, SEO, LINKS, FMT       |
| Partially matched | Why Buying Wholesale Spices can Save Your Business Thousands                     | `why-buying-wholesale-spices-can-save-your-business-thousands`                    | EX, SEO, LINKS, FMT       |
| Partially matched | How to Store Bulk Spices for Maximum Freshness and Flavour                       | `how-to-store-bulk-spices-for-maximum-freshness-and-flavour`                      | EX, SEO, LINKS, FMT       |
| Partially matched | How to Buy Bulk Spices Online in Australia: A Complete Guide for Businesses      | `how-to-buy-bulk-spices-online-in-australia-a-complete-guide-for-businesses`      | EX, SEO, HEAD, LINKS, FMT |
| Partially matched | Matcha vs. Coffee: Why Wholesale Matcha is Winning in Australia                  | `matcha-vs-coffee-why-wholesale-matcha-is-winning-in-australia`                   | EX, SEO, LINKS, FMT       |
| Partially matched | 5 Ways to Differentiate Your Retail Brand with Private Label Tea                 | `5-ways-to-differentiate-your-retail-brand-with-private-label-tea`                | EX, SEO, LINKS, FMT       |
| Partially matched | From Leaf to Cup: The Journey of Wholesale Tea in Australia                      | `from-leaf-to-cup-the-journey-of-wholesale-tea-in-australia`                      | EX, SEO, LINKS, FMT       |
| Partially matched | How Cafés Can Increase Profits by Offering Wholesale Tea Options                 | `how-cafes-can-increase-profits-by-offering-wholesale-tea-options`                | EX, SEO, LINKS, FMT       |
| Partially matched | The Rise of Functional Teas: Mushrooms, Turmeric & Beyond                        | `the-rise-of-functional-teas-mushrooms-turmeric-beyond`                           | EX, SEO, LINKS, FMT       |
| Partially matched | Top 10 Teas Every Café Should Stock in 2025                                      | `top-10-teas-every-cafe-should-stock-in-2025`                                     | EX, SEO, LINKS, FMT       |
| Partially matched | Top Tea Trends in 2025 for Cafés, Retailers & Wellness Brands                    | `top-tea-trends-in-2025-for-cafes-retailers-wellness-brands`                      | EX, SEO, LINKS            |
| Partially matched | Private Label Tea in Australia - A Complete Guide for New Brands                 | `private-label-tea-in-australia-a-complete-guide-for-new-brands`                  | EX, SEO, LINKS, FMT       |
| Partially matched | The Ultimate Guide to Storing Bulk Tea and Spices                                | `the-ultimate-guide-to-storing-bulk-tea-and-spices`                               | EX, SEO, LINKS, FMT       |
| Partially matched | The Benefits of Buying Organic Tea in Bulk                                       | `the-benefits-of-buying-organic-tea-in-bulk`                                      | EX, SEO, LINKS, FMT       |
| Partially matched | How to Choose the Right Wholesale Tea Supplier in Australia                      | `how-to-choose-the-right-wholesale-tea-supplier-in-australia`                     | EX, SEO, LINKS, FMT       |
| Partially matched | The Role of Fermentation in Oolong Tea Production                                | `the-role-of-fermentation-in-oolong-tea-production`                               | EX, SEO, LINKS, FMT       |
| Partially matched | Artisanal vs. Commercial Tea Production: Processes and Differences               | `artisanal-vs-commercial-tea-production-processes-and-differences`                | EX, SEO, FMT              |
| Partially matched | Sit Back and Relax with the Perfect Cup of Earl Grey Tea                         | `sit-back-and-relax-with-the-perfect-cup-of-earl-grey-tea`                        | EX, SEO, LINKS, FMT       |
| Partially matched | The Art of Tea Pairing                                                           | `the-art-of-tea-pairing`                                                          | EX, SEO, FMT              |
| Partially matched | The Health and Wellness Benefits of Detox Tea                                    | `the-health-and-wellness-benefits-of-detox-tea`                                   | EX, SEO, LINKS, FMT       |
| Partially matched | Matcha vs Green Tea: A Comparative Guide                                         | `matcha-vs-green-tea-a-comparative-guide`                                         | EX, SEO, LINKS, FMT       |
| Partially matched | The Important Health Benefits of Drinking Matcha Tea                             | `the-important-health-benefits-of-drinking-matcha-tea`                            | EX, SEO, LINKS, FMT       |
| Partially matched | Cordyceps Mushroom Benefits: How This Powerhouse Mushroom Boosts Your Well-Being | `cordyceps-mushroom-benefits-how-this-powerhouse-mushroom-boosts-your-well-being` | EX, SEO, LINKS, FMT       |
| Partially matched | 6 Important Benefits of Reishi Mushrooms                                         | `6-important-benefits-of-reishi-mushrooms`                                        | EX, SEO, LINKS, FMT       |
| Partially matched | How Mushroom Powder Helps Improve Your Well-Being                                | `how-mushroom-powder-helps-improve-your-well-being`                               | EX, SEO, LINKS, FMT       |
| Partially matched | Exploring the Benefits of Turkey Tail Mushrooms                                  | `exploring-the-benefits-of-turkey-tail-mushrooms`                                 | EX, SEO, LINKS, FMT       |
| Partially matched | The Health Benefits of Lion's Mane Mushroom Powder                               | `the-health-benefits-of-lion-s-mane-mushroom-powder`                              | EX, FMT                   |
| Partially matched | Discover the Power of Detox Tea: A Natural Reset for Your Body and Mind          | `detox-clean-tea-loved-by-australians`                                            | EX, SEO, LINKS, FMT       |
| Partially matched | The Pure Goodness of Teavision's Organic Tea: A Sip Above the Rest               | `the-pure-goodness-of-teavision-s-organic-tea-a-sip-above-the-rest`               | EX, SEO, LINKS, FMT       |
| Partially matched | The Science Behind Sleep Teas: How Ingredients Like Chamomile Work               | `the-science-behind-sleep-teas-how-ingredients-like-chamomile-work`               | EX, SEO, LINKS, FMT       |
| Partially matched | The Benefits of Incorporating Cardamom Pods into Your Daily Tea Ritual           | `the-benefits-of-incorporating-cardamom-pods-into-your-daily-tea-ritual`          | EX, SEO, LINKS, FMT       |
| Partially matched | Exploring the Rich History of Darjeeling Tea and Its Unique Flavour Profile      | `exploring-the-rich-history-of-darjeeling-tea-and-its-unique-flavour-profile`     | EX, SEO, LINKS, FMT       |
| Partially matched | The Renaissance of Herbal Teas in Modern Wellness                                | `the-renaissance-of-herbal-teas-in-modern-wellness`                               | EX, SEO, LINKS, FMT       |
| Partially matched | How Australian Native Herbs Like Lemon Myrtle Are Revolutionising Tea Blends     | `how-australian-native-herbs-like-lemon-myrtle-are-revolutionizing-tea-blends`    | EX, SEO, LINKS, FMT       |
| Partially matched | Matcha vs. Traditional Green Tea: Health Benefits and Brewing Techniques         | `matcha-vs-traditional-green-tea-health-benefits-and-brewing-techniques`          | EX, SEO, LINKS, FMT       |
| Partially matched | Wholesale Herbs and Their Role in Creating Custom Tea Blends                     | `wholesale-herbs-and-their-role-in-creating-custom-tea-blends`                    | EX, SEO, LINKS, FMT       |
| Partially matched | Japanese Green Tea - It's Not All About Matcha                                   | `japanese-green-tea-its-not-all-about-matcha`                                     | EX, SEO, LINKS, FMT       |
| Partially matched | The Art of Tea Packaging: Combining Functionality with Aesthetic Appeal          | `the-art-of-tea-packaging-combining-functionality-with-aesthetic-appeal`          | EX, SEO, LINKS, FMT       |
| Partially matched | Crafting the Perfect Blend: How Local Spices Enhance Tea Flavours                | `crafting-the-perfect-blend-how-local-spices-enhance-tea-flavours`                | EX, SEO, LINKS, FMT       |
| Partially matched | Sustainable Tea Farming in Australia: Practices That Protect the Earth           | `sustainable-tea-farming-in-australia-practices-that-protect-the-earth`           | EX, SEO, LINKS, FMT       |
| Partially matched | Why Do Women Use Raspberry Leaf Tea During Pregnancy?                            | `why-do-women-use-raspberry-leaf-tea-during-pregnancy`                            | EX, SEO, LINKS, FMT       |
| Partially matched | What is Genmaicha Tea?                                                           | `what-is-genmaicha-tea`                                                           | EX, SEO, LINKS, FMT       |
| Partially matched | Genmaicha vs Matcha vs Hojicha. Which is The Best Tea?                           | `genmaicha-vs-matcha-vs-hojicha-which-is-the-best-tea`                            | EX, SEO, LINKS, FMT       |
| Partially matched | Exploring Lesser-Known Teas: Attributes, Benefits, and Interesting Facts         | `exploring-lesser-known-teas-attributes-benefits-and-interesting-facts`           | EX, SEO, LINKS            |
| Partially matched | The Comprehensive Guide to Tea Benefits: Health, Sleep, Weight Loss, and More    | `the-comprehensive-guide-to-tea-benefits-health-sleep-weight-loss-and-more`       | EX, SEO, LINKS            |
| Partially matched | Tea Culture Around the World                                                     | `tea-around-the-world`                                                            | EX, SEO, LINKS, FMT       |
| Partially matched | What Are the Health Benefits of Turmeric Tea?                                    | `tumeric-tea-benefits`                                                            | EX, SEO, LINKS, FMT       |
| Partially matched | Understand What Fasting Is, And What Herbal Teas You Can Drink                   | `can-you-drink-herbal-tea-when-fasting`                                           | EX, SEO, LINKS, FMT       |
| Partially matched | Where to Find the Best Herbal Tea Brands                                         | `best-herbal-tea`                                                                 | EX, SEO, LINKS, FMT       |
| Partially matched | What are the Health Benefits of Hibiscus Tea?                                    | `hibiscus-tea-benefits`                                                           | EX, SEO, LINKS, FMT       |
| Partially matched | The Delights of Oolong Tea: Talking Benefits and Taste                           | `oolong-tea-benefits`                                                             | EX, SEO, LINKS, FMT       |
| Partially matched | The Benefits of Moringa Tea: Enhancing Health and Sleep                          | `moringa-tea-benefits`                                                            | EX, SEO, LINKS, FMT       |
| Partially matched | The Myriad of Benefits of Chamomile Tea                                          | `chamomile-tea-benefits`                                                          | EX, SEO, LINKS, FMT       |
| Partially matched | Dandelion Leaves Health Benefits & Uses                                          | `dandelion-leaves-health-benefits-uses`                                           | EX, IMG, LINKS, FMT       |
| Partially matched | Why Microbiological Testing of Tea Is Extremely Important                        | `why-microbiological-testing-of-tea-is-extremely-important`                       | EX, SEO, FMT              |
| Partially matched | 10 Ways To Keep Your Tea Fresh                                                   | `10-ways-to-keep-your-tea-fresh`                                                  | EX, SEO, FMT              |
| Partially matched | Tips When Starting A New Tea Business                                            | `tips-when-starting-a-new-tea-business`                                           | EX, SEO, HEAD, FMT        |
| Partially matched | A Cuppa Through Time: Exploring the Fascinating History of Tea                   | `a-cuppa-through-time-exploring-the-fascinating-history-of-tea`                   | FMT                       |
| Partially matched | 6 Tea Trends To Consider In 2023                                                 | `6-tea-trends-to-consider-in-2023`                                                | EX, SEO, FMT              |
| Partially matched | Global Tea Demand and Trends of 2021                                             | `global-tea-demand-and-trends-of-2021`                                            | IMG, LINKS, FMT           |
| Partially matched | Powerful Ways to Start Selling Tea Online                                        | `powerful-ways-to-start-selling-tea-online`                                       | EX, SEO, LINKS, FMT       |
| Partially matched | Everything You Need To Know About Tea Bags                                       | `tea-bags-everything-you-need-to-know`                                            | IMG, LINKS, FMT           |
| Partially matched | 5 Customers You Never Thought You Had                                            | `customers-you-never-thought-you-had`                                             | LINKS, FMT                |
| Partially matched | Tea And Herb Events Around the World That Will Help Your Business Grow           | `tea-events-around-the-world`                                                     | LINKS, FMT                |
| Partially matched | Why quality control shouldn't end at certified organic                           | `why-quality-control-shouldn-t-end-at-certified-organic`                          | LINKS, FMT                |
| Partially matched | New tea market trends to look at in 2019                                         | `new-tea-market-trends-to-look-at-in-2019`                                        | HEAD, LINKS, FMT          |
| Partially matched | Expanding your tea markets internationally                                       | `expanding-your-tea-markets-internationally`                                      | EX, HEAD, LINKS, FMT      |
| Partially matched | Yes, chocolate tea! Why cacao husks are the next big thing                       | `yes-chocolate-tea-why-cacao-husks-are-the-next-big-thing`                        | IMG, LINKS, FMT           |
| Partially matched | Four things you probably didn't know about black tea                             | `four-things-you-probably-didn-t-know-about-black-tea`                            | HEAD, IMG, LINKS, FMT     |
| Partially matched | Blending functional teas with naturopath Amy Castle                              | `blending-functional-teas-naturopath`                                             | HEAD, IMG, LINKS, FMT     |
| Partially matched | Everything you need to know about labelling your tea                             | `labelling-your-tea`                                                              | HEAD, IMG, LINKS, FMT     |
| Partially matched | Inventory management: How to bulk order tea and maximise your profits            | `bulk-order-tea-australia`                                                        | IMG, LINKS, FMT           |
| Partially matched | Five Australian tea trends for business owners to stay across                    | `five-australian-tea-trends`                                                      | HEAD, IMG, LINKS, FMT     |
| Partially matched | Tea Grading Guide                                                                | `118372165-tea-grading-guide`                                                     | EX, SEO, IMG, LINKS, FMT  |
| Partially matched | Why Organic Matters                                                              | `113488005-why-organic-matters`                                                   | EX, SEO, HEAD, FMT        |

## Aggregate Discrepancies

- FMT: 74 articles
- LINKS: 73 articles
- EX: 69 articles
- SEO: 65 articles
- IMG: 10 articles
- HEAD: 9 articles

## Cross-Check Notes

- Subagent 1 confirmed Shopify-to-Sanity field parity for identifiers and legacy fields, and separately flagged Portable Text conversion as lossy.
- Subagent 2 independently derived 82 article handles from sitemap, inventory, live pagination, and Sanity, with no missing or extra handles.
- Subagent 3 independently measured active body loss: 383 Shopify HTML links vs 0 Portable Text links, 30 inline HTML images vs 0 Portable Text inline images, 512 HTML headings vs 479 Portable Text headings, 505 inline marks vs 0 Portable Text marked spans, and 10 tables with no table representation.

## Verdict

The migration is complete at the article/document level but not a strict 1:1 content migration for rendered/editable article bodies. Treat every article as partially matched until Portable Text preserves links, media, tables, and inline marks, or the storefront renders the preserved `legacy.contentHtml` for migrated articles.
