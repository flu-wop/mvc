// Generated from Margie's Acuity scheduler (Oct 2026). Seeds an empty database only;
// after that the live catalog is the services/addons tables, edited in /admin/services.
// Server-only: do not import from client components.

export type SeedService = { slug: string; title: string; category: string; color: string; blurb: string; fromCents: number; durationMinutes: number; paddingMinutes: number; addonIds: number[]; sort: number };
export type SeedAddon = { id: number; name: string; priceCents: number; durationMinutes: number; sort: number };

export const SEED_SERVICES: SeedService[] = [
 {
  "slug": "signature-acrylic-full-set",
  "title": "Signature Acrylic Full Set",
  "category": "Acrylic Full Sets",
  "color": "#C9A96E",
  "blurb": "A classic, customized acrylic full set tailored to your preferred shape and length.\n\n This service includes thorough cuticle prep, your choice of colored acrylic or gel polish, and a glossy finish for a clean, timeless look.\n\nDesign upgrades and add-ons may be selected at the time of booking.",
  "fromCents": 6500,
  "durationMinutes": 150,
  "paddingMinutes": 60,
  "addonIds": [
   1082755,
   2520135,
   2213971,
   2520712,
   1547115,
   2520823,
   2300705,
   2574956,
   1517642,
   2574969,
   2520850,
   1129403,
   7012746,
   7012743,
   7012741,
   7012744,
   7012745,
   1097764,
   1515888,
   1518825,
   2520838,
   2213985,
   1630854,
   1630872
  ],
  "sort": 1
 },
 {
  "slug": "ombre-full-set",
  "title": "Ombré Full Set",
  "category": "Acrylic Full Sets",
  "color": "#C9A96E",
  "blurb": "A customized and seamless two-tone blend created using acrylic powder or gel polish for the perfect ombré effect.\n\nIncludes detailed cuticle work, your choice of shape, and a glossy top coat.\n\nAdditional length, nail art, and design upgrades are available in the add-ons.",
  "fromCents": 8000,
  "durationMinutes": 180,
  "paddingMinutes": 60,
  "addonIds": [
   1082755,
   2520135,
   2213971,
   2520712,
   1547115,
   2520823,
   2300705,
   2574956,
   1517642,
   2574969,
   2520850,
   1129403,
   7012746,
   7012743,
   7012741,
   7012744,
   7012745,
   7012755,
   1097764,
   1515888,
   1518825,
   2520838,
   2213985,
   1630854,
   7012584
  ],
  "sort": 2
 },
 {
  "slug": "french-variation-full-set",
  "title": "French Variation Full Set",
  "category": "Acrylic Full Sets",
  "color": "#C9A96E",
  "blurb": "A detailed acrylic full set featuring your choice of French-inspired or color-blocking designs, including classic French tips, V-tips, slanted tips, and other modern styles.\n\nThis service includes thorough cuticle work, short length, customized color application, and a glossy finish.\n\nAdditional upgrades and nail art may be added during booking.",
  "fromCents": 8000,
  "durationMinutes": 180,
  "paddingMinutes": 60,
  "addonIds": [
   1082755,
   2520135,
   2213971,
   2520712,
   1547115,
   2520823,
   2300705,
   2574956,
   1517642,
   1129403,
   7012746,
   7012743,
   7012741,
   7012744,
   7012745,
   1097764,
   1515888,
   1518825,
   2520838,
   2213985,
   1630854,
   1630872
  ],
  "sort": 3
 },
 {
  "slug": "glitter-or-marble-full-set",
  "title": "Glitter or Marble Full Set",
  "category": "Acrylic Full Sets",
  "color": "#C9A96E",
  "blurb": "This set may include single-color glitter encapsulation or sugar-effect nails, as well as two-tone marble designs, created using either acrylic powder or gel polish.\n\nEncapsulated designs are sealed beneath a clear acrylic layer for a luxurious, dimensional finish.\n\nIncludes detailed cuticle work, short length, premium shaping , and a glossy top coat finish.\n\nAdditional upgrades such as extra length, charms, and nail art may be selected during booking.",
  "fromCents": 8000,
  "durationMinutes": 180,
  "paddingMinutes": 60,
  "addonIds": [
   1082755,
   2520135,
   2213971,
   2520712,
   1547115,
   2520823,
   2300705,
   2574956,
   1517642,
   2574969,
   2520850,
   1129403,
   7012746,
   7012743,
   7012741,
   7012744,
   7012745,
   1097764,
   1515888,
   1518825,
   2520838,
   2213985,
   1630854,
   1630872
  ],
  "sort": 4
 },
 {
  "slug": "simplistic-tier-1-freestyle-set",
  "title": "Simplistic Tier 1 Freestyle Set",
  "category": "Freestyle Sets",
  "color": "#D9A441",
  "blurb": "A customized freestyle set designed with clean, minimal to moderately detailed nail art.\n\nThis tier may include French designs, abstract art, chrome, glitter, line work, transfer foils, small crystals, pearls, and other subtle detailing.\n\nIncludes detailed cuticle work, premium shaping, and short length.",
  "fromCents": 11500,
  "durationMinutes": 180,
  "paddingMinutes": 50,
  "addonIds": [
   2520823,
   2300705,
   7012746,
   7012743,
   7012741,
   7012744,
   7012745,
   1515888,
   2213985
  ],
  "sort": 5
 },
 {
  "slug": "tier-2-freestyle-set",
  "title": "Tier 2 Freestyle Set",
  "category": "Freestyle Sets",
  "color": "#D9A441",
  "blurb": "A detailed freestyle set featuring moderate to advanced nail art with a more elevated, artistic finish.\n\nThis may include chrome, airbrush effects, 3D gel detailing, encapsulations, layered designs, moderate charms, Swarovski accents, and semi-busy artwork throughout the set.\n\n Includes detailed cuticle work and premium shaping. Final pricing may vary based on length and complexity.",
  "fromCents": 13500,
  "durationMinutes": 180,
  "paddingMinutes": 50,
  "addonIds": [
   2300705,
   7012746,
   7012743,
   7012741,
   7012744,
   7012745,
   1515888
  ],
  "sort": 6
 },
 {
  "slug": "tier-3-freestyle-set",
  "title": "Tier 3 Freestyle Set",
  "category": "Freestyle Sets",
  "color": "#D9A441",
  "blurb": "For clients who love bold, artistic, and fully customized nail sets.\n\nThis tier may include intricate hand-drawn art, advanced encapsulations, airbrush designs, character art, Swarovski crystals, chrome, layered textures, 3D elements, and busy detailing throughout the set.\n\nIncludes detailed cuticle work, premium shaping, and complete creative direction tailored to your style preferences.",
  "fromCents": 16000,
  "durationMinutes": 180,
  "paddingMinutes": 50,
  "addonIds": [
   2300705,
   7012746,
   7012743,
   7012741,
   7012744,
   7012745,
   1515888
  ],
  "sort": 7
 },
 {
  "slug": "elite-tier-4-freestyle-set",
  "title": "Elite Tier 4 Freestyle Set",
  "category": "Freestyle Sets",
  "color": "#D9A441",
  "blurb": "The ultimate freestyle experience for clients who want maximum creativity, extreme detailing, and statement nail art.\n\nThis tier may include hand-painted maximalist designs on every nail, extensive crystal work, heavy embellishments, layered textures, advanced 3D art, and luxury charm placements throughout the set.\n\nIncludes detailed cuticle work, premium shaping, and full artistic customization for a one-of-a-kind set.\n\nFinal pricing varies based on length, complexity, and overall design vision.",
  "fromCents": 20000,
  "durationMinutes": 180,
  "paddingMinutes": 50,
  "addonIds": [
   7012746,
   7012743,
   7012741,
   7012744,
   7012745,
   1515888
  ],
  "sort": 8
 },
 {
  "slug": "kawaii-charm-junk-nails-freestyle",
  "title": "Kawaii Charm / Junk Nails Freestyle",
  "category": "Freestyle Sets",
  "color": "#D9A441",
  "blurb": "This freestyle is built for the charm lovers. This set features at least one 3D Kawaii or junk charm on every nail with your choice of shape and short length.\n\nFun, playful, and completely personalized — perfect for clients who love a whimsical, maximalist vibe.",
  "fromCents": 11000,
  "durationMinutes": 190,
  "paddingMinutes": 0,
  "addonIds": [
   2520712,
   2520823,
   2300705,
   2574969,
   2520850,
   1129403,
   7012746,
   7012743,
   7012741,
   7012744,
   7012745,
   1515888,
   1518825,
   2520838,
   2213985
  ],
  "sort": 9
 },
 {
  "slug": "luxury-charm-set",
  "title": "Luxury Charm Set",
  "category": "Freestyle Sets",
  "color": "#D9A441",
  "blurb": "Every nail adorned with at least one to two statement 3D jewel charms for a bold, elevated look.\n\nIncludes short length and your choice of shape — additional length and design upgrades available in the add-ons.",
  "fromCents": 12000,
  "durationMinutes": 180,
  "paddingMinutes": 60,
  "addonIds": [
   2300705,
   2574969,
   1129403,
   7012746,
   7012743,
   7012741,
   7012744,
   7012745,
   1515888,
   2520838,
   2213985
  ],
  "sort": 10
 },
 {
  "slug": "swarovski-freestyle-set",
  "title": "Swarovski Freestyle Set",
  "category": "Freestyle Sets",
  "color": "#D9A441",
  "blurb": "A dazzling, crystal-forward set featuring a combination of genuine Swarovski and Preciosa crystals covering a portion of every nail.\n\nThis is the base price for short length — select your preferred length in the add-ons.\n\nAdditional design requests are priced accordingly.",
  "fromCents": 20000,
  "durationMinutes": 210,
  "paddingMinutes": 50,
  "addonIds": [
   2300705,
   2574969,
   7012746,
   7012743,
   7012741,
   7012744,
   7012745,
   1515888,
   2213985
  ],
  "sort": 11
 },
 {
  "slug": "solid-classic-gel-x-set",
  "title": "Solid Classic Gel-X Set",
  "category": "Gel-X Sets",
  "color": "#B8BBC0",
  "blurb": "This system is designed to feel thin, flexible, and comfortable while still giving a flawless finished look.\n\nGel-X can also support healthy natural nail growth by acting as a protective overlay when properly maintained.\n\nAchieve a clean, classy, and lightweight nail enhancement with our Gel-X extension system. This service is perfect for clients who love a natural feel while still enjoying beautiful, durable extensions.\n\nFor added strength and durability, Builder Gel reinforcement can be added for +$5.",
  "fromCents": 7000,
  "durationMinutes": 90,
  "paddingMinutes": 0,
  "addonIds": [
   1082755,
   2520135,
   2213971,
   7016699,
   1547115,
   2520823,
   2300705,
   2574956,
   1517642,
   2574969,
   2520850,
   1129403,
   7012746,
   7012743,
   7012741,
   7012744,
   7012745,
   1097764,
   1515888,
   1518825,
   2520838,
   2213985,
   1630854,
   1630872
  ],
  "sort": 12
 },
 {
  "slug": "gel-x-simplicity-tier-1-set",
  "title": "Gel-X Simplicity Tier 1 Set",
  "category": "Gel-X Sets",
  "color": "#B8BBC0",
  "blurb": "A customized set designed with clean, minimal to moderately detailed nail art.\n\nThis tier may include French designs, abstract art, chrome, glitter, line work, transfer foils, small crystals, pearls, and other subtle detailing.\n\nIncludes detailed cuticle work, short length, premium shaping, and creative freedom tailored to your personal style and preferences.\n\nPlease note that nail length, additional charms, and advanced detailing may increase pricing due to additional time and product usage.",
  "fromCents": 11500,
  "durationMinutes": 180,
  "paddingMinutes": 0,
  "addonIds": [
   7016699,
   2300705,
   7012746,
   7012743,
   7012741,
   7012744,
   7012745,
   1515888,
   2213985
  ],
  "sort": 13
 },
 {
  "slug": "gel-x-tier-2-set",
  "title": "Gel-X Tier 2 Set",
  "category": "Gel-X Sets",
  "color": "#B8BBC0",
  "blurb": "A detailed set featuring moderate to advanced nail art with a more elevated, artistic finish.\n\nThis tier may include chrome, airbrush effects, 3D gel detailing, encapsulations, layered designs, moderate charms, Swarovski accents, and semi-busy artwork throughout the set.\n\nIncludes detailed cuticle work, premium shaping, and a fully customized design experience curated to your preferences while allowing creative freedom.\n\nFinal pricing may vary based on length, complexity, and additional design elements",
  "fromCents": 13000,
  "durationMinutes": 195,
  "paddingMinutes": 0,
  "addonIds": [
   7016699,
   2300705,
   7012746,
   7012743,
   7012741,
   7012744,
   7012745,
   1515888
  ],
  "sort": 14
 },
 {
  "slug": "gel-x-tier-3-set",
  "title": "Gel-X Tier 3 Set",
  "category": "Gel-X Sets",
  "color": "#B8BBC0",
  "blurb": "This tier may include intricate hand-drawn art, advanced encapsulations, airbrush designs, character art, Swarovski crystals, chrome, layered textures, 3D elements, and busy detailing throughout the set.\n\nIncludes detailed cuticle work, premium shaping, and complete creative direction tailored to your style preferences.\n\nPlease note that longer lengths and highly detailed artwork may increase pricing due to additional time, precision, and product usage.",
  "fromCents": 16000,
  "durationMinutes": 210,
  "paddingMinutes": 0,
  "addonIds": [
   7016699,
   2300705,
   7012746,
   7012743,
   7012741,
   7012744,
   7012745,
   1515888
  ],
  "sort": 15
 },
 {
  "slug": "gel-x-elite-tier-4-set",
  "title": "Gel-X Elite Tier 4 Set",
  "category": "Gel-X Sets",
  "color": "#B8BBC0",
  "blurb": "For clients who want maximum creativity, extreme detailing, and statement nail art.\n\nThis tier may include maximalist designs on all nails, hand-painted or sculpted characters, extensive crystal work, heavy embellishments, layered textures, advanced 3D art, and luxury charm placements throughout the set.\n\nIncludes detailed cuticle work, premium shaping, and full artistic customization for a one-of-a-kind set.\n\nFinal pricing varies based on length, complexity, and overall design vision.",
  "fromCents": 20000,
  "durationMinutes": 210,
  "paddingMinutes": 0,
  "addonIds": [
   7016699,
   7012746,
   7012743,
   7012741,
   7012744,
   7012745,
   1515888
  ],
  "sort": 16
 },
 {
  "slug": "gel-polish-file-off",
  "title": "Gel Polish File Off",
  "category": "Maintenance",
  "color": "#7F8C8D",
  "blurb": "This service safely removes gel polish using an e-file and/or gentle filing methods to protect the natural nail and prepare it for your next set or service.\n\nThis option is for existing clients only who currently have gel polish applied by me.\n\nIf you have product from another nail tech, please select the appropriate removal add-on.\n\nThis service is strictly removal only. If you would like a new set, gel polish, or additional nail care services, please be sure to select those add-ons when booking.",
  "fromCents": 1000,
  "durationMinutes": 15,
  "paddingMinutes": 0,
  "addonIds": [
   1515888
  ],
  "sort": 17
 },
 {
  "slug": "enhancement-removal",
  "title": "Enhancement Removal",
  "category": "Maintenance",
  "color": "#7F8C8D",
  "blurb": "Safe, thorough removal of acrylic, builder gel, or gel polish enhancements — done gently to protect the health of your natural nail.\n\nFor existing clients only.\n\nIf your current set was done by another technician, please select the \"Outside Work\" add-on at booking.",
  "fromCents": 1500,
  "durationMinutes": 60,
  "paddingMinutes": 40,
  "addonIds": [
   1082394,
   1515888
  ],
  "sort": 18
 },
 {
  "slug": "same-color-refill",
  "title": "Same Color Refill",
  "category": "Maintenance",
  "color": "#7F8C8D",
  "blurb": "A maintenance refill for clients returning within 2–3 weeks with the same color.\n\nIncludes cuticle prep, removal of lifted areas, acrylic reapplication, and a fresh glossy top coat.\n\nIf it's been longer than 3 weeks, please note that in the add-ons.\n\n After the third consecutive refill, a full soak-off will be required before the new set.",
  "fromCents": 5500,
  "durationMinutes": 180,
  "paddingMinutes": 60,
  "addonIds": [
   2522084,
   1547115,
   2300705,
   1129403,
   1097764,
   1515888,
   1518825,
   2213985,
   1745790,
   1630854,
   1630872
  ],
  "sort": 19
 },
 {
  "slug": "different-color-refill",
  "title": "Different Color Refill",
  "category": "Maintenance",
  "color": "#7F8C8D",
  "blurb": "Same great refill process — just a fresh color.\n\nIncludes cuticle prep, removal of previous acrylic, and your choice of new acrylic powder or gel polish, finished with a glossy top coat.",
  "fromCents": 6000,
  "durationMinutes": 180,
  "paddingMinutes": 60,
  "addonIds": [
   2522084,
   1547115,
   2300705,
   1129403,
   1097764,
   1515888,
   1518825,
   2213985,
   1745790,
   1630854,
   1630872
  ],
  "sort": 20
 },
 {
  "slug": "cut-down",
  "title": "Cut Down",
  "category": "Maintenance",
  "color": "#7F8C8D",
  "blurb": "Length reduction service for existing clients.",
  "fromCents": 500,
  "durationMinutes": 30,
  "paddingMinutes": 50,
  "addonIds": [
   2300705,
   1515888,
   1518825
  ],
  "sort": 21
 },
 {
  "slug": "gel-color-change",
  "title": "Gel Color Change",
  "category": "Maintenance",
  "color": "#7F8C8D",
  "blurb": "A quick refresh for existing clients.\n\nFile-down is included.\n\n Select your new color and any desired add-ons at booking.",
  "fromCents": 3000,
  "durationMinutes": 100,
  "paddingMinutes": 40,
  "addonIds": [
   1547115,
   2300705,
   1129403,
   1097764,
   1515888,
   1518825,
   1630872
  ],
  "sort": 22
 },
 {
  "slug": "1-nail-repair",
  "title": "1 Nail Repair",
  "category": "Maintenance",
  "color": "#7F8C8D",
  "blurb": "Single nail fix for existing clients.",
  "fromCents": 500,
  "durationMinutes": 50,
  "paddingMinutes": 0,
  "addonIds": [
   2300705,
   1515888,
   1518825
  ],
  "sort": 23
 },
 {
  "slug": "signature-russian-manicure",
  "title": "Signature Russian Manicure",
  "category": "Natural Nail",
  "color": "#A9794A",
  "blurb": "A detailed dry manicure focusing on precise cuticle care and nail refinement using advanced Russian manicure techniques.\n\nThis service includes thorough cuticle work, nail shaping, buffing, and your choice of gel polish for a clean, long-lasting finish.",
  "fromCents": 4500,
  "durationMinutes": 60,
  "paddingMinutes": 30,
  "addonIds": [
   1082755,
   2213971,
   1547115,
   2520823,
   2300705,
   1517642,
   2574969,
   1129403,
   1097764,
   1515888,
   1518825,
   2520838,
   1630872
  ],
  "sort": 24
 },
 {
  "slug": "deluxe-russian-manicure",
  "title": "Deluxe Russian Manicure",
  "category": "Natural Nail",
  "color": "#A9794A",
  "blurb": "This service includes detailed cuticle work, nail shaping, buffing, gel polish application, and a relaxing spa experience with sugar exfoliation , hot towels, steam, and a nourishing oil massage for enhanced softness and hydration. Finished with a glossy top coat for a flawless, polished result.\n\nA luxurious upgrade to the Signature Russian Manicure.",
  "fromCents": 6500,
  "durationMinutes": 90,
  "paddingMinutes": 0,
  "addonIds": [
   1082755,
   2213971,
   1547115,
   2300705,
   2574969,
   1129403,
   1097764,
   2520838,
   1630872
  ],
  "sort": 25
 },
 {
  "slug": "luxury-signature-manicure",
  "title": "Luxury Signature Manicure",
  "category": "Natural Nail",
  "color": "#A9794A",
  "blurb": "This experience includes steam, mask treatment, sugar exfoliation, hot towel treatment, a hot rock oil and lotion massage, and paraffin wax for deep hydration. Finished with your choice of gel polish for a clean, polished look.",
  "fromCents": 8500,
  "durationMinutes": 105,
  "paddingMinutes": 0,
  "addonIds": [
   1082755,
   2213971,
   1547115,
   2300705,
   2574969,
   1129403,
   1097764,
   2520838,
   1630872
  ],
  "sort": 26
 },
 {
  "slug": "structured-gel-overlay",
  "title": "Structured Gel Overlay",
  "category": "Natural Nail",
  "color": "#A9794A",
  "blurb": "Strengthen and protect your natural nails without extensions.\n\nIncludes detailed cuticle care, nail shaping, buffing, a builder gel overlay for support and durability, and your choice of gel polish with a glossy finish.",
  "fromCents": 5500,
  "durationMinutes": 150,
  "paddingMinutes": 0,
  "addonIds": [
   1082755,
   2520135,
   2213971,
   1547115,
   2520823,
   2300705,
   2574969,
   1129403,
   1097764,
   1515888,
   1518825,
   2520838,
   1630872
  ],
  "sort": 27
 },
 {
  "slug": "acrylic-overlay",
  "title": "Acrylic Overlay",
  "category": "Natural Nail",
  "color": "#A9794A",
  "blurb": "All the structure of acrylic, without the extensions.\n\nIncludes proper cuticle care, nail shaping, buffing, your choice of colored acrylic powder or gel polish, and a glossy top coat for a clean, polished result.",
  "fromCents": 5500,
  "durationMinutes": 150,
  "paddingMinutes": 40,
  "addonIds": [
   1082755,
   2520135,
   2213971,
   1547115,
   2520823,
   2300705,
   1517642,
   2574969,
   1052290,
   1129403,
   1097764,
   1515888,
   1518825,
   2520838,
   1630872
  ],
  "sort": 28
 },
 {
  "slug": "press-on-sizing-kit",
  "title": "Press-On Sizing Kit",
  "category": "Press-On Nails",
  "color": "#F2EDE4",
  "blurb": "",
  "fromCents": 1500,
  "durationMinutes": 30,
  "paddingMinutes": 0,
  "addonIds": [],
  "sort": 29
 },
 {
  "slug": "press-on-application",
  "title": "Press-On Application",
  "category": "Press-On Nails",
  "color": "#F2EDE4",
  "blurb": "Book this service if you have purchased a press-on set from MVCxCreations and would like a flawless professional application.\n\nThis service includes a detailed Russian manicure, nail prep, and full press-on application for a clean, long-lasting finish.",
  "fromCents": 2500,
  "durationMinutes": 30,
  "paddingMinutes": 0,
  "addonIds": [],
  "sort": 30
 },
 {
  "slug": "press-on-recreation",
  "title": "Press-On Recreation",
  "category": "Press-On Nails",
  "color": "#F2EDE4",
  "blurb": "Send your inspiration and I'll recreate it as a custom wearable set.\n\nAll orders include:\n• application instructions\n• 2 in 1 nail cuticle pusher & trimmer\n• nail file\n• buffer block\n• alcohol wipes\n• lue\n• full set of 10",
  "fromCents": 5000,
  "durationMinutes": 15,
  "paddingMinutes": 0,
  "addonIds": [
   7016699,
   1129403
  ],
  "sort": 31
 },
 {
  "slug": "signature-press-on-set",
  "title": "Signature Press-On Set",
  "category": "Press-On Nails",
  "color": "#F2EDE4",
  "blurb": "May Include:\n\n✦solid colors\n✦ombré\n✦French tips\n✦minimal art\n\nAll orders include:\n•  application instructions\n• 2 in 1 nail cuticle pusher & trimmer\n• nail file\n• buffer block\n• alcohol wipes\n• glue\n• full set of 10",
  "fromCents": 5000,
  "durationMinutes": 60,
  "paddingMinutes": 0,
  "addonIds": [
   7016699
  ],
  "sort": 32
 },
 {
  "slug": "deluxe-press-on-set",
  "title": "Deluxe Press-On Set",
  "category": "Press-On Nails",
  "color": "#F2EDE4",
  "blurb": "May Include:\n\n✦Encapsulations\n✦Chrome\n✦Moderate charms\n✦glitter\n✦layered art\n✦airbrush\n✦abstract designs\n\nAll orders include:\n•  application instructions\n• 2 in 1 nail cuticle pusher & trimmer\n• nail file\n• buffer block\n• alcohol wipes\n• tube of glue\n• set of 10 nails",
  "fromCents": 7500,
  "durationMinutes": 30,
  "paddingMinutes": 0,
  "addonIds": [
   7016699
  ],
  "sort": 33
 },
 {
  "slug": "lux-freestyle-press-ons",
  "title": "Lux Freestyle Press-Ons",
  "category": "Press-On Nails",
  "color": "#F2EDE4",
  "blurb": "For the client who wants it all.\n\nThis tier may Include:\n\n✦Character art\n✦ Sculpted elements\n✦Advanced encapsulations\n✦Swarovski\n✦Editorial sets\n✦Kawaii designs\n\nAll orders include:\n\n• full kit with application supplies\n• full set of 10\n\nStarting at $100–$150+ depending on complexity.",
  "fromCents": 10000,
  "durationMinutes": 60,
  "paddingMinutes": 0,
  "addonIds": [
   7016699
  ],
  "sort": 34
 },
 {
  "slug": "classic-spa-pedicure",
  "title": "Classic Spa Pedicure",
  "category": "Toe Services",
  "color": "#6F9C8E",
  "blurb": "Treat your feet to a refreshing self-care experience with this classic spa pedicure designed to leave your feet feeling clean, smooth, and renewed. Perfect for routine maintenance and relaxation.\n\nThis service includes:\n∙ Nail trimming and shaping\n∙ Detailed cuticle care\n∙ Removal of nail debris\n∙ Relaxing soak\n∙ Exfoliating sugar scrub\n∙ Light massage with lotion and oils\n∙ Hot towels\n∙ Regular polish of your choice",
  "fromCents": 5000,
  "durationMinutes": 60,
  "paddingMinutes": 0,
  "addonIds": [
   1082755,
   7012633,
   7012638,
   7012644,
   2520135,
   2213971,
   7012618,
   1547115,
   2520823,
   2300705,
   1052290,
   1129403,
   1097764,
   1518825,
   2520838,
   1630872
  ],
  "sort": 35
 },
 {
  "slug": "waterless-gel-toes",
  "title": "Waterless Gel Toes",
  "category": "Toe Services",
  "color": "#6F9C8E",
  "blurb": "A clean, modern, and detailed toe service perfect for clients who love a flawless gel polish finish without the soak. This waterless treatment focuses on precision prep for a longer-lasting, polished look.\n\nThis service includes:\n∙ Removal of nail debris\n∙ Nail trimming and shaping\n∙ Detailed Russian cuticle prep\n∙ Gel polish application\n∙ Hydrating cuticle oil and lotion\n\nPerfect for clients wanting a simple yet luxury maintenance service.",
  "fromCents": 5000,
  "durationMinutes": 60,
  "paddingMinutes": 0,
  "addonIds": [
   1082755,
   7012633,
   7012638,
   7012644,
   2520135,
   2213971,
   7012618,
   1547115,
   2520823,
   2300705,
   1517642,
   1129403,
   1097764,
   1515888,
   1518825,
   2520838,
   1630872
  ],
  "sort": 36
 },
 {
  "slug": "acrylic-toe-overlay",
  "title": "Acrylic Toe Overlay",
  "category": "Toe Services",
  "color": "#6F9C8E",
  "blurb": "Enhance the appearance of your toes with a structured acrylic overlay designed to create a smooth, polished, and long-lasting finish. Great for reshaping uneven nails or achieving a perfected look.\n\nThis service includes:\n∙ Removal of nail debris\n∙ Nail trimming and shaping\n∙ Detailed Russian cuticle prep\n∙ Acrylic overlay application\n∙ One acrylic color or gel polish of your choice\n∙ Cuticle oil and moisturizing lotion",
  "fromCents": 6000,
  "durationMinutes": 120,
  "paddingMinutes": 0,
  "addonIds": [
   1082755,
   7012633,
   2520135,
   2213971,
   7012618,
   1547115,
   2520823,
   2300705,
   1517642,
   1129403,
   1097764,
   1515888,
   1518825,
   2520838,
   1630872
  ],
  "sort": 37
 },
 {
  "slug": "classic-gel-spa-pedicure",
  "title": "Classic Gel Spa Pedicure",
  "category": "Toe Services",
  "color": "#6F9C8E",
  "blurb": "A relaxing spa pedicure finished with long-lasting gel polish for the perfect shine. This treatment focuses on both foot care and relaxation while giving your toes a flawless finish.\n\nThis service includes:\n∙ Nail trimming and shaping\n∙ Removal of nail debris\n∙ Detailed Russian cuticle prep\n∙ Relaxing soak\n∙ Exfoliating sugar scrub\n∙ Light foot buffing\n∙ Hot towels\n∙ Hydrating massage\n∙ Gel polish of your choice\n\nEnhance your experience with special add-ons .",
  "fromCents": 6500,
  "durationMinutes": 75,
  "paddingMinutes": 0,
  "addonIds": [
   1082755,
   7012633,
   7012638,
   7012644,
   2520135,
   2213971,
   7012618,
   1547115,
   2520823,
   2300705,
   1129403,
   1097764,
   1518825,
   2520838,
   1630872
  ],
  "sort": 38
 },
 {
  "slug": "jelly-pedicure",
  "title": "Jelly Pedicure",
  "category": "Toe Services",
  "color": "#6F9C8E",
  "blurb": "Relax and unwind with this soothing jelly spa experience. The fluffy jelly soak helps soften the skin while creating a calming and luxurious treatment for tired feet.\n\nThis service includes everything in the Classic Gel Spa Pedicure PLUS:\n∙ Soft jelly soak experience\n∙ Steam therapy for deep relaxation\n∙ Extended exfoliation experience\n∙ More relaxation-based massage time\n\nUpgrade your experience with optional add-ons for the ultimate pedicure experience.",
  "fromCents": 7500,
  "durationMinutes": 85,
  "paddingMinutes": 0,
  "addonIds": [
   1082755,
   7012633,
   7012638,
   7012644,
   2520135,
   2213971,
   7012618,
   1547115,
   2520823,
   2300705,
   1129403,
   1097764,
   1518825,
   2520838,
   1630872
  ],
  "sort": 39
 },
 {
  "slug": "deluxe-pedicure",
  "title": "Deluxe Pedicure",
  "category": "Toe Services",
  "color": "#6F9C8E",
  "blurb": "Give your feet the extra care they deserve with this elevated spa experience designed to deeply soften, smooth, and restore tired feet.\n\nThis service includes everything in the Jelly Pedicure PLUS:\n∙ Detailed Russian cuticle prep\n∙ Callus care treatment\n∙ Hydrating mask with warm towels\n∙ Deeper foot buffing & smoothing\n∙ Extended massage with oils",
  "fromCents": 8500,
  "durationMinutes": 115,
  "paddingMinutes": 0,
  "addonIds": [
   1082755,
   7012633,
   7012638,
   7012644,
   2520135,
   2213971,
   7012618,
   1547115,
   2520823,
   2300705,
   1517642,
   1129403,
   1097764,
   1518825,
   2520838,
   1630872
  ],
  "sort": 40
 },
 {
  "slug": "elite-luxury-pedicure-experience",
  "title": "Elite Luxury Pedicure Experience",
  "category": "Toe Services",
  "color": "#6F9C8E",
  "blurb": "The ultimate luxury pedicure experience designed to relax, restore, and pamper your feet from start to finish.\n\nThis service includes :\n∙ Removal of nail debris\n∙ Nail trimming and shaping\n∙ Detailed cuticle prep\n∙ Salt soak\n∙ Steam therapy\n∙ Moisturizing jelly therapy\n∙ Exfoliating sugar scrub\n∙ Callus removal treatment\n∙ Hydrating masque with warm towels\n∙ Hot stone massage with nourishing oils and lotion\n∙ Paraffin wax treatment with heated foot warmer therapy\n∙ Gel polish",
  "fromCents": 10000,
  "durationMinutes": 120,
  "paddingMinutes": 0,
  "addonIds": [
   1082755,
   7012633,
   7012638,
   7012644,
   2520135,
   2213971,
   7012618,
   1547115,
   2520823,
   2300705,
   1129403,
   1097764,
   1518825,
   2520838,
   1630872
  ],
  "sort": 41
 },
 {
  "slug": "mini-gel-polish-manicure",
  "title": "Mini Gel Polish Manicure",
  "category": "Little Luxe Angels (10 & Under)",
  "color": "#9A86B5",
  "blurb": "A longer-lasting polish option for little luxe glam girls.\n\nIncludes:\n∙ Nail shaping\n∙ Gentle nail prep\n∙ Gel polish application\n∙ Cuticle oil finish\n\nComplimentary gel removal is included for existing clients receiving a new gel service.\n\nForeign product removal or soak-off services will require an additional fee.",
  "fromCents": 3000,
  "durationMinutes": 45,
  "paddingMinutes": 0,
  "addonIds": [
   1082394
  ],
  "sort": 42
 },
 {
  "slug": "mini-manicure",
  "title": "Mini Manicure",
  "category": "Little Luxe Angels (10 & Under)",
  "color": "#9A86B5",
  "blurb": "A simple self-care manicure perfect for little ones.\n\nIncludes:\n∙ Nail trimming and shaping\n∙ Gentle cuticle care\n∙ Light lotion massage\n∙ Regular polish of choice",
  "fromCents": 2000,
  "durationMinutes": 30,
  "paddingMinutes": 0,
  "addonIds": [],
  "sort": 43
 },
 {
  "slug": "mini-pedicure",
  "title": "Mini Pedicure",
  "category": "Little Luxe Angels (10 & Under)",
  "color": "#9A86B5",
  "blurb": "A relaxing mini spa pedicure designed for soft little feet.\n\nIncludes:\n∙ Gentle foot soak\n∙ Nail trimming and shaping\n∙ Light sugar scrub\n∙ Lotion massage\n∙ Regular polish of choice",
  "fromCents": 3000,
  "durationMinutes": 40,
  "paddingMinutes": 0,
  "addonIds": [],
  "sort": 44
 },
 {
  "slug": "little-luxe-mani-pedi",
  "title": "Little Luxe Mani & Pedi",
  "category": "Little Luxe Angels (10 & Under)",
  "color": "#9A86B5",
  "blurb": "The perfect mini pampering experience.\n\nIncludes:\n∙ Mini manicure\n∙ Mini pedicure\n∙ Regular polish on hands and toes",
  "fromCents": 4500,
  "durationMinutes": 65,
  "paddingMinutes": 0,
  "addonIds": [],
  "sort": 45
 },
 {
  "slug": "princess-polish-change",
  "title": "Princess Polish Change",
  "category": "Little Luxe Angels (10 & Under)",
  "color": "#9A86B5",
  "blurb": "Quick polish refresh with your choice of regular polish color.\n\nNails must be free of product before the appointment.\n\nIf removal is needed, please book a file off or soak off add-on for an additional charge.",
  "fromCents": 1000,
  "durationMinutes": 15,
  "paddingMinutes": 0,
  "addonIds": [],
  "sort": 46
 }
];

export const SEED_ADDONS: SeedAddon[] = [
 {
  "id": 1082755,
  "name": "$1 Per Swarovski Crystals",
  "priceCents": 0,
  "durationMinutes": 0,
  "sort": 1
 },
 {
  "id": 7012633,
  "name": "1 Big Acrylic Toe",
  "priceCents": 1000,
  "durationMinutes": 6,
  "sort": 2
 },
 {
  "id": 7012638,
  "name": "10 Acrylic Toes",
  "priceCents": 5500,
  "durationMinutes": 60,
  "sort": 3
 },
 {
  "id": 7012644,
  "name": "2 Acrylic Big Toes",
  "priceCents": 2000,
  "durationMinutes": 15,
  "sort": 4
 },
 {
  "id": 2520135,
  "name": "3D Charms [Kawaii, Jewels, Poms, Etc. [ $3 - $15 Per Charm ]",
  "priceCents": 0,
  "durationMinutes": 5,
  "sort": 5
 },
 {
  "id": 2522084,
  "name": "4 Weeks",
  "priceCents": 500,
  "durationMinutes": 0,
  "sort": 6
 },
 {
  "id": 2213971,
  "name": "Additional Color",
  "priceCents": 500,
  "durationMinutes": 0,
  "sort": 7
 },
 {
  "id": 7016699,
  "name": "Builder Gel Reinforcement",
  "priceCents": 500,
  "durationMinutes": 30,
  "sort": 8
 },
 {
  "id": 2520712,
  "name": "Chrome, Croc Print, Transfer Foil, Etc. - Per Nail",
  "priceCents": 500,
  "durationMinutes": 0,
  "sort": 9
 },
 {
  "id": 7012618,
  "name": "Classic French Tips",
  "priceCents": 1500,
  "durationMinutes": 25,
  "sort": 10
 },
 {
  "id": 1547115,
  "name": "Crystal Pixie - Per Nail",
  "priceCents": 500,
  "durationMinutes": 0,
  "sort": 11
 },
 {
  "id": 2520823,
  "name": "Cuticle Swarovski Bling - Per Nail",
  "priceCents": 800,
  "durationMinutes": 0,
  "sort": 12
 },
 {
  "id": 2300705,
  "name": "Detailed Nail Art - Per Nail  [Price Varies According To Complexity $5-$25]",
  "priceCents": 500,
  "durationMinutes": 0,
  "sort": 13
 },
 {
  "id": 2574956,
  "name": "Different Shape Nail - Per Nail",
  "priceCents": 300,
  "durationMinutes": 0,
  "sort": 14
 },
 {
  "id": 1517642,
  "name": "Foil Flakes - Per Nail",
  "priceCents": 200,
  "durationMinutes": 0,
  "sort": 15
 },
 {
  "id": 1082394,
  "name": "Foreign Work",
  "priceCents": 500,
  "durationMinutes": 0,
  "sort": 16
 },
 {
  "id": 2574969,
  "name": "French Tip, V-Cut, Slant Tip , Etc. - ALL 10",
  "priceCents": 1500,
  "durationMinutes": 0,
  "sort": 17
 },
 {
  "id": 2520850,
  "name": "French, V-Cut, Slant Tip, Etc. - Per Nail",
  "priceCents": 300,
  "durationMinutes": 0,
  "sort": 18
 },
 {
  "id": 1052290,
  "name": "Gel Polish",
  "priceCents": 1500,
  "durationMinutes": 0,
  "sort": 19
 },
 {
  "id": 1129403,
  "name": "I'd love a design, but am not sure.",
  "priceCents": 0,
  "durationMinutes": 35,
  "sort": 20
 },
 {
  "id": 7012746,
  "name": "Length : Extendo",
  "priceCents": 5000,
  "durationMinutes": 35,
  "sort": 21
 },
 {
  "id": 7012743,
  "name": "Length : Long",
  "priceCents": 2000,
  "durationMinutes": 10,
  "sort": 22
 },
 {
  "id": 7012741,
  "name": "Length : Medium",
  "priceCents": 1000,
  "durationMinutes": 5,
  "sort": 23
 },
 {
  "id": 7012744,
  "name": "Length : X-Long",
  "priceCents": 3000,
  "durationMinutes": 12,
  "sort": 24
 },
 {
  "id": 7012745,
  "name": "Length : XX-Long",
  "priceCents": 4000,
  "durationMinutes": 25,
  "sort": 25
 },
 {
  "id": 7012755,
  "name": "Marble Ombré",
  "priceCents": 1000,
  "durationMinutes": 15,
  "sort": 26
 },
 {
  "id": 1097764,
  "name": "Matte Top Coat Finish",
  "priceCents": 500,
  "durationMinutes": 0,
  "sort": 27
 },
 {
  "id": 2534787,
  "name": "Minimal Swarovski Crystals",
  "priceCents": 1500,
  "durationMinutes": 0,
  "sort": 28
 },
 {
  "id": 1515888,
  "name": "Moisturizing Exfoliating Scrub",
  "priceCents": 500,
  "durationMinutes": 0,
  "sort": 29
 },
 {
  "id": 1518825,
  "name": "Nail Decals/Stickers [ Price Varies ]",
  "priceCents": 200,
  "durationMinutes": 5,
  "sort": 30
 },
 {
  "id": 2520838,
  "name": "Outline , Sugar, Small Simple Encapsulations [ Hearts, Sparkles, Stars, Etc. - Per Nail ]",
  "priceCents": 300,
  "durationMinutes": 0,
  "sort": 31
 },
 {
  "id": 2213985,
  "name": "Peek A Boo [ Red Bottoms ] - All 10",
  "priceCents": 1000,
  "durationMinutes": 0,
  "sort": 32
 },
 {
  "id": 1745790,
  "name": "Single Nail Soak Off",
  "priceCents": 500,
  "durationMinutes": 10,
  "sort": 33
 },
 {
  "id": 1630854,
  "name": "Solid Hoop Piercing - Per Hoop",
  "priceCents": 100,
  "durationMinutes": 0,
  "sort": 34
 },
 {
  "id": 1630872,
  "name": "Tri Colored Ombré ( Per Nail )",
  "priceCents": 400,
  "durationMinutes": 0,
  "sort": 35
 },
 {
  "id": 7012584,
  "name": "Tri- Color Ombré ( All 10 Nails )",
  "priceCents": 1000,
  "durationMinutes": 30,
  "sort": 36
 }
];
