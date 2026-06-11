# Phase 4 Research: Footer 1:1 Parity

**Captured:** 2026-05-29
**Live source:** `https://www.teavision.com.au/`
**Method:** Opened the live page, fetched server-rendered HTML, extracted `<footer class="ftrR">`, footer links, image references, and `section-footer-redesign.css`.

## Summary

The live Shopify footer is much denser than the current Next footer. It has a dark top band with four columns, a hidden keyword-link block, and a light bottom row with copyright, a `Popular Searches` hash link, and payment SVGs. The footer is SEO-sensitive: project docs already call the keyword-link block deliberate internal-linking infrastructure.

## Live Structure

- Root: `<footer class="ftrR" role="contentinfo">`
- Top band: `.ftrR__top`
- Container: `.ftrR__container`, 1440px max width, 48px desktop gutters, 16px under 1439px.
- Grid: `.ftrR-grid`, 4 columns desktop, 2 columns under 989px, 1 column under 767px.
- Columns:
  - `Main Menu`
  - `Footer`
  - `Quality`
  - `Keep in Touch`
- Hidden block: `.ftrR-hidden-content > .kk-footer`, default hidden in live CSS.
- Bottom row: `.ftrR__bottom > .ftrR__wrapper`, payment icons first on tablet/mobile, policy row second.

## Live Visual Notes

- Top band background: `#1d1d1d`; live CSS also defines `--ftr-bg: #141816`.
- Accent button background: `#004E37`.
- Top band text: white.
- Column headings: `#868686`, Roboto, 16px, 600, 140% line-height, 16px bottom margin.
- Link/body text: Roboto, 16px, 400, 140% line-height.
- Menu link vertical gap: about 15.5px.
- Top padding: 60px desktop/tablet; 32px mobile.
- Quality image: `//www.teavision.com.au/cdn/shop/files/3.png?v=1757328068&width=600`, rendered at 181px wide, source asset 600x232, lazy loaded, empty alt in live HTML.
- Newsletter input/button row: input width `calc(100% - 114px)`, button width 106px, 8px gap, 4px radius.
- Bottom row: white/light background, 24px vertical padding, 14px black text, policy separators use `|`, payment icons are 38x24 with 4px gap.

## Primary Footer Links

| Area          | Label                 | Href                                                    |
| ------------- | --------------------- | ------------------------------------------------------- |
| Main Menu     | Tea                   | `/collections/wholesale-bulk-tea`                       |
| Main Menu     | Tea Bags              | `/collections/bulk-tea-bags`                            |
| Main Menu     | Herbs & Spices        | `/collections/herbs-and-spices`                         |
| Main Menu     | Services              | `/pages/services`                                       |
| Main Menu     | Tea Journal           | `/blogs/teavision-blogs`                                |
| Main Menu     | Our Story             | `/pages/our-story`                                      |
| Footer        | Search                | `/search`                                               |
| Footer        | Login                 | `https://mrtea.com.au/account/login`                    |
| Footer        | T's & C's             | `https://www.teavision.com.au/pages/terms-conditions-1` |
| Footer        | Contact us            | `/pages/contact`                                        |
| Footer        | Refund Policy         | `/pages/refund-policy`                                  |
| Footer        | Terms of Service      | `/pages/terms-of-service`                               |
| Keep in Touch | 1300 729 617          | `tel:1300 729 617`                                      |
| Keep in Touch | info@teavision.com.au | `mailto:info@teavision.com.au`                          |
| Bottom        | Teavision             | `/`                                                     |
| Bottom        | Popular Searches      | `#popular-searches`                                     |

## Quality and Newsletter Copy

- Quality heading: `Quality`
- Quality copy: `Teavision runs a HACCP Certified food & safety program to provide consistent quality throughout its products.`
- Keep in Touch heading: `Keep in Touch`
- Keep in Touch copy: `Sign up for exclusive offers, market trends and new product alerts.`
- Newsletter input placeholder: `Email`
- Newsletter button label: `Submit`

## SEO Keyword Link Block

The hidden keyword block has 97 keyword/search links. Preserve labels and hrefs exactly.

| Label                           | Href                                            |
| ------------------------------- | ----------------------------------------------- |
| teas australia                  | `/`                                             |
| tea shop australia              | `/`                                             |
| organic tea australia           | `/collections/organic-tea`                      |
| loose leaf tea                  | `/collections/loose-leaf-tea`                   |
| Chinese Tea                     | `/collections/chinese-tea`                      |
| green tea leaves                | `/collections/green-tea`                        |
| black tea                       | `/collections/black-tea`                        |
| burdock root                    | `/collections/burdock-root`                     |
| dandelion tea                   | `/collections/dandelion-tea`                    |
| sleep tea                       | `/collections/organic-sleepy-tea/`              |
| probiotic tea                   | `/collections/organic-probiotic-tea`            |
| herb tea                        | `/collections/herbal-tea`                       |
| tea blends                      | `/collections/custom-tea-blend`                 |
| detox tea                       | `/collections/wholesale-detox-tea/`             |
| spearmint tea                   | `/products/spearmint-organic`                   |
| buy spearmint tea               | `/collections/spearmint-tea`                    |
| peppermint and licorice tea     | `/collections/licorice-mint`                    |
| lemon myrtle tea                | `/collections/lemon-myrtle`                     |
| lemon balm tea                  | `/collections/organic-lemon-balm`               |
| assam tea                       | `/collections/organic-black-assam-tea`          |
| chai tea powder                 | `/products/instant-chai-powder`                 |
| chai tea                        | `/collections/chai`                             |
| chai leaves                     | `/collections/chai`                             |
| japanese green tea              | `/collections/japanese-green-tea`               |
| sencha tea                      | `/collections/japanese-sencha-tea`              |
| australian tea                  | `/collections/australian-grown-tea`             |
| marshmallow root tea            | `/collections/marshmallow-root`                 |
| matcha                          | `/collections/matcha-tea`                       |
| matcha powder                   | `/collections/matcha-tea`                       |
| olive leaf tea                  | `/collections/olive-leaf-wholesale`             |
| cold & flu tea                  | `/collections/organic-cold-flu`                 |
| buy rooibos tea                 | `/collections/organic-rooibos-tea`              |
| yerba mate tea                  | `/collections/yerba-mate`                       |
| chamomile leaves                | `/collections/chamomile`                        |
| chamomile teas                  | `/collections/chamomile`                        |
| chamomile tea bags              | `/products/organic-chamomile-pyramid-tea-bags`  |
| buy oolong tea                  | `/collections/oolong-tea-wholesale`             |
| tea packaging                   | `/pages/tea-packaging`                          |
| organic herbal colon cleanse    | `/collections/organic-body-colon-cleanse`       |
| organic turmeric powder         | `/collections/organic-turmeric-powder`          |
| bulk cinnamon                   | `/collections/organic-cinnamon-powder`          |
| dried hibiscus flowers          | `/collections/organic-hibiscus`                 |
| import herbs to australias      | `/pages/import-tea-herbs-australia`             |
| tea importers australia         | `/pages/tea-importers-australia`                |
| buy white tea                   | `/collections/white-tea`                        |
| honeybush tea                   | `/collections/organic-honeybush`                |
| pu erh tea australia            | `/collections/pu-erh-tea`                       |
| scullcap                        | `/collections/scullcap`                         |
| breakfast tea                   | `/collections/english-breakfast-tea`            |
| clove tea                       | `/collections/cloves`                           |
| calendula flowers               | `/collections/organic-calendula-petals`         |
| digestive tea                   | `/collections/organic-digestive-tea`            |
| organic earl grey tea           | `/collections/organic-earl-grey`                |
| speciality tea                  | `/collections/speciality-tea`                   |
| cocoa tea                       | `/collections/cocoa-tea-shells`                 |
| cloves wholesale                | `/collections/cloves-wholesale`                 |
| loose leaf peppermint tea       | `/collections/organic-wholesale-peppermint-tea` |
| licorice root tea               | `/collections/licorice-tea`                     |
| aniseed tea                     | `/collections/aniseed-tea`                      |
| rose bud tea                    | `/collections/rose-tea`                         |
| wholesale rose buds             | `/collections/rose-buds`                        |
| nettle leaf                     | `/collections/nettle-leaf`                      |
| pekoe tea                       | `/collections/pekoe-tea`                        |
| siberian ginseng                | `/collections/siberian-ginseng`                 |
| ginseng tea                     | `/collections/ginseng-tea`                      |
| elderberries                    | `/collections/elderberries`                     |
| blooming tea                    | `/collections/blooming-tea`                     |
| lemongrass and ginger tea       | `/collections/lemongrass-ginger-tea`            |
| lemon verbena tea               | `/collections/lemon-verbena-tea`                |
| genmaicha tea                   | `/collections/genmaicha-tea`                    |
| lapsang souchong tea            | `/collections/lapsang-souchong`                 |
| longjing tea                    | `/collections/longjing-tea`                     |
| silver needle                   | `/collections/silver-needle`                    |
| buy tulsi tea                   | `/collections/tulsi-tea`                        |
| buy hibiscus tea                | `/collections/hibiscus-tea`                     |
| white peony tea                 | `/collections/white-peony`                      |
| ginger tea bags                 | `/collections/ginger-tea-bags`                  |
| ginkgo biloba tea               | `/collections/ginkgo-biloba-tea`                |
| keemun tea                      | `/collections/keemun-tea`                       |
| damiana tea                     | `/collections/damiana-tea`                      |
| complexion tea                  | `/collections/complexion-tea`                   |
| cinnamon cassia                 | `/collections/cinnamon-cassia`                  |
| calendula tea                   | `/collections/calendula-tea`                    |
| darjeeling tea online australia | `/collections/darjeeling-tea`                   |
| ceylon tea                      | `/collections/ceylon-tea`                       |
| jasmine tea                     | `/collections/jasmine-tea`                      |
| moringa leaf                    | `/collections/moringa-leaves`                   |
| cardamom pods                   | `/collections/cardamom-pods`                    |
| cardamom powder                 | `/collections/cardamom-powder`                  |
| passionflower                   | `/collections/passionflower`                    |
| raspberry leaf                  | `/collections/raspberry-leaf`                   |
| vervain wholesale               | `/collections/vervain`                          |
| ginger powder                   | `/collections/ginger`                           |
| dried ginger                    | `/collections/ginger`                           |
| star anise                      | `/collections/star-anise`                       |
| cinnamon chips                  | `/collections/cinnamon-chips`                   |
| japanese matcha                 | `/collections/japanese-matcha`                  |

## Payment Marks

Live payment methods, in order:

1. American Express
2. Apple Pay
3. Google Pay
4. Mastercard
5. PayPal
6. Shop Pay
7. Union Pay
8. Visa

Each live icon is inline SVG with `role="img"`, title text, width `38`, and height `24`.

## Current Next Footer Gap

The current `src/components/layout/footer/footer.tsx` renders:

- A brand-token top band, not the live black footer band.
- Four small grouped columns: Shop, Services, Wholesale, Company.
- A newsletter heading/copy that differs from live.
- Legal links: Privacy, Terms, Compliance, Popular searches.
- No Quality column, certification image, exact Main Menu/Footer columns, hidden keyword block, payment marks, or 113-link parity.

## Verification Implications

- DOM parity can be checked by extracting footer links from local and live and comparing ordered label/href pairs.
- Visual parity should be checked at 1440px, 1024px, 768px, and 390px widths.
- Newsletter submission should be checked for valid, invalid, honeypot, and missing Resend env behavior.
- Accessibility should confirm footer landmarks, list semantics, labels, keyboard focus, and payment SVG names.
