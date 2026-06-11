import { cn } from '@/lib/utils'

const termsContentClassNames = [
  'max-w-prose wrap-break-word text-ink',
  '[&_a]:text-brand [&_a]:underline [&_a]:underline-offset-2',
  '[&_a:hover]:text-brand-deep',
  '[&_a:focus-visible]:ring-ring [&_a:focus-visible]:rounded',
  '[&_a:focus-visible]:ring-2 [&_a:focus-visible]:ring-offset-2',
  '[&_a:focus-visible]:outline-none',
  '[&_article]:mt-10',
  '[&_h2]:type-heading-02 [&_h2]:text-ink [&_h2]:mt-10',
  '[&>h2:first-child]:mt-0',
  '[&_h3]:type-heading-04 [&_h3]:text-ink [&_h3]:mt-8',
  '[&_li]:type-body [&_li]:text-ink-soft [&_li]:pl-1',
  '[&_li]:marker:text-brand',
  '[&_p]:type-body [&_p]:text-ink-soft [&_p]:mt-4',
  '[&_ul]:mt-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6',
]

export function TermsConditionsContent() {
  return (
    <div className={cn(...termsContentClassNames)}>
      <h2>Terms &amp; Conditions</h2>

      <p>Please click on the below links to read our policies.</p>

      <ul>
        <li>
          <a href="https://www.teavision.com.au/7868339/policies/refund-policy.html?locale=en-AU">
            Refund Policy
          </a>{' '}
          (This is also detailed out below)
        </li>
        <li>
          <a href="https://www.teavision.com.au/7868339/policies/shipping-policy.html?locale=en-AU">
            Shipping Policy
          </a>
        </li>
        <li>
          <a href="https://www.teavision.com.au/7868339/policies/privacy-policy.html?locale=en-AU">
            Privacy Policy
          </a>
        </li>
        <li>
          <a href="https://www.teavision.com.au/7868339/policies/terms-of-service.html?locale=en-AU">
            Terms of Service
          </a>
        </li>
      </ul>

      <article aria-labelledby="refund-policy-heading">
        <h2 id="refund-policy-heading">Refund Policy</h2>

        <h3>Returns</h3>
        <p>Our policy lasts 14 days. If 14 days have gone by since your purchase, unfortunately we can&apos;t offer you a credit or exchange.</p>
        <p>To be eligible for a return, exchange or credit, your item must be considered defective or damaged and must be reported within 14 days of receiving your order.</p>
        <p>Teavision is a wholesaler and does not provide warranty on the product if the product has been repackaged, re-blended or incorrectly stored (see our storage conditions statement below).</p>

        <h3>
          Quality Assurance (Storage conditions, shelf life, defective product
          &amp; claims)
        </h3>
        <p>Teavision supplies Agricultural products many of which are organic. We have a tolerance level of 3% foreign matter being agricultural products such as stones, leaves, bark etc and do not consider there to be a contamination unless the contamination is greater then 3% and as such, we do not warranty and minor contaminations that are agricultural in nature.</p>
        <p>The shelf life provided by Teavision at the time of supply is subject to the purchaser / consumer meeting our recommended storage conditions which are defined here: Products should be stored at ambient temperature in an air tight packaging away from direct sunlight and humidity. It is especially important in warmer climates where humidity is high to ensure appropriate storage to avoid insect contaminations.</p>
        <p>Teavision can supply CoA (certificate of analysis) upon request for any ingredient to show that the product and batch has been tested to meet Australian food health and safety standards. If you require further testing such as heavy metal or others then we recommend you test this yourself using one of the labs available in Australia.</p>

        <h3>Defective products &amp; Claims</h3>
        <p>If you believe that your product is defective, contaminated or otherwise unfit for consumption, please report this to our team at info@teavision.com.au and we will investigate this for you.</p>
        <p>If a product is proven to be defective after Teavision has conducted an investigation, and a claim is being made, Teavision will issue a credit on the agreed amount but will not offer a refund. Each case is unique and may be treated differently depending on the circumstances and Teavision management team will assist with this process to find a fair and reasonable outcome for all parties.</p>
        <p>To complete your return, we require a receipt or proof of purchase.</p>
        <p>There are certain situations where only partial credits are granted (if applicable):</p>
        <ul>
          <li>
            Any item not in its original condition, is damaged or missing parts
            for reasons not due to our error.
          </li>
          <li>Any item that is returned more than 14 days after delivery.</li>
        </ul>

        <h3>Credits (if applicable)</h3>
        <p>Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your credit.</p>

        <h3>Sale items (if applicable)</h3>
        <p>Only regular priced items may be refunded, unfortunately sale items cannot be refunded.</p>

        <h3>Exchanges (if applicable)</h3>
        <p>We only replace items if they are defective or damaged. If you need to exchange it for the same item, send us an email at info@teavision.com.au and we will assist with the next steps.</p>

        <h3>Gifts</h3>
        <p>If the item was marked as a gift when purchased and shipped directly to you, you&apos;ll receive a gift credit for the value of your return. Once the returned item is received, a gift certificate will be mailed to you.</p>
        <p>If the item wasn&apos;t marked as a gift when purchased, or the gift giver had the order shipped to themselves to give to you later, we will send a refund to the gift giver and he will find out about your return.</p>

        <h3>Shipping</h3>
        <p>To return your product, you should mail your product to Teavision&apos;s listed business address.</p>
        <p>You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a credit, the cost of return shipping may also be included in your credit.</p>
        <p>Depending on where you live, the time it may take for your exchanged product to reach you, may vary.</p>
        <p>If you are shipping an item over $75, you should consider using a trackable shipping service or purchasing shipping insurance. We don&apos;t guarantee that we will receive your returned item.</p>
      </article>
    </div>
  )
}
