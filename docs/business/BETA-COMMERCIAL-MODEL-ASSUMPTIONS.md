# Bridge Beta Commercial Model Assumptions

As of: 2026-08-04

## Decision

Estimate whether Bridge can become a sustainable direct-to-family admissions-test and interview-preparation product after a 50-student free beta.

## Recommended offer

Bridge should use a seasonal freemium model rather than an automatically renewing monthly subscription:

- Free: diagnostic, limited daily practice, one complete mock, and a basic study plan.
- Single exam pass: RMB 699 for six months.
- Pathway pass: RMB 1,299 for up to two relevant tests plus the corresponding interview track for twelve months.
- Interview sprint: RMB 999 for eight weeks.
- Founding offer after beta: RMB 599 for one exam or RMB 999 for one pathway, limited to the first 100 paying students.

The weighted average revenue per paying student is modelled at about RMB 999 in the base case.

## Market boundary

UCAS reported 34,380 applicants from China at the January equal-consideration deadline for the 2026 cycle. Bridge's initial serviceable segment is assumed to be 25% to 40% of that population: students targeting selective courses where admissions tests, subject interviews, or intensive English preparation are material. This produces an initial serviceable population of 8,595 to 13,752 students. This is a proxy, not an observed count of test takers.

The estimate excludes UK-domiciled A-level students, Hong Kong-only applicants, applicants outside China, and later-cycle applicants. It also excludes students who only need general application management.

## Public price anchors

- TMUA Academy: GBP 59 for 12 months of self-serve TMUA access.
- Vantage Admissions: GBP 1,299 for a mentored TMUA programme.
- UniAdmissions: GBP 6,500 to GBP 35,000 for broader high-touch Oxbridge programmes.

Bridge is positioned between a single-test question bank and high-touch tutoring. The recommended RMB 699 to RMB 1,299 price is intentionally below human-led programmes until learning gain and content quality are independently validated.

## Unit economics

Base price and per-payer costs:

- Average revenue per payer: RMB 999.
- AI grading and inference: RMB 15.
- Payment processing: about 1% of revenue, rounded into the variable-cost allowance.
- Refund and service-quality reserve: about 3% of revenue.
- Customer support: RMB 30 per payer.
- Total variable cost allowance: RMB 85 per payer.
- Blended customer acquisition cost target: RMB 180 per payer.
- Net contribution after variable cost and acquisition: RMB 734 per payer.

Base annual fixed cash costs:

- Hosting, backup, domains, email, and monitoring: RMB 2,400.
- Part-time content quality assurance: RMB 36,000.
- Administration and operating tools: RMB 12,000.
- Total fixed cash cost: RMB 50,400.
- Founder labour opportunity cost: RMB 120,000 per year, shown separately.

Cash break-even excluding founder pay is 69 paying students. Fully loaded break-even including RMB 120,000 of founder labour is 233 paying students.

## Annual scenarios

### Conservative

- 400 qualified leads.
- 6% lead-to-paid conversion.
- 24 payers at RMB 799 average revenue.
- RMB 80 acquisition cost per payer.
- RMB 68 variable cost per payer.
- RMB 17,400 fixed cash costs.
- RMB 60,000 founder labour value.
- Revenue: RMB 19,176.
- Cash result before founder labour: negative RMB 1,776.
- Fully loaded result: negative RMB 61,776.

### Base

- 2,000 qualified leads.
- 12.5% lead-to-paid conversion.
- 250 payers at RMB 999 average revenue.
- RMB 180 acquisition cost per payer.
- RMB 85 variable cost per payer.
- RMB 50,400 fixed cash costs.
- RMB 120,000 founder labour value.
- Revenue: RMB 249,750.
- Cash result before founder labour: RMB 133,100.
- Fully loaded result: RMB 13,100.

### Optimistic

- 5,000 qualified leads.
- 15% lead-to-paid conversion.
- 750 payers at RMB 1,199 average revenue.
- RMB 220 acquisition cost per payer.
- RMB 102 variable cost per payer.
- RMB 102,000 fixed cash costs.
- RMB 120,000 founder labour value.
- Revenue: RMB 899,250.
- Cash result before founder labour: RMB 555,750.
- Fully loaded result: RMB 435,750.

## Fifty-student beta gates

The beta is a validation cohort, not a revenue cohort. Continue toward paid launch only if the cohort reaches most of these provisional thresholds:

- At least 35 of 50 invitees register.
- At least 25 complete a diagnostic.
- At least 15 return on or after day seven.
- At least 20 have a valid pre/post comparison.
- Median measured improvement is at least 5 percentage points for students with comparable pre/post tests.
- At least 8 say they would pay the founding price, and at least 5 later complete an actual payment when payment is enabled.
- Critical session failure rate remains below 1%.
- No unresolved copyright or answer-correctness issue remains on content used by beta students.

## Sources

- UCAS 2026 applicant release: https://www.ucas.com/corporate/news-and-key-documents/news/growing-18-year-old-population-pushes-uk-university-applicant-numbers-higher
- TMUA Academy pricing: https://tmua.academy/pricing
- Vantage Admissions TMUA programme: https://www.vantageadmissions.co.uk/course/test-of-mathematics-for-university-admission
- UniAdmissions fees: https://www.uniadmissions.co.uk/fees/
- Tencent Cloud Lighthouse pricing: https://cloud.tencent.com/document/product/1207/115752
- Resend quotas: https://resend.com/docs/knowledge-base/account-quotas-and-limits
- DeepSeek API pricing: https://api-docs.deepseek.com/quick_start/pricing

## Caveats

The market-share assumption, conversion rates, customer acquisition costs, support costs, refund allowance, and willingness to pay are judgement-based inputs. They must be replaced with observed beta and paid-launch data. Revenue is not annual recurring revenue because the product is seasonal and access passes are sold for a fixed preparation window. Taxes, legal advice, external tutor fees, and payment-provider setup fees are not included.
