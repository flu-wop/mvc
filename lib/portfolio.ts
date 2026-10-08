// Portfolio sets shown on the homepage and /portfolio. To add a set: drop the
// photo in /public/portfolio, then add an entry here. Order = display order.
// `serviceSlug` powers the "Book this set" link (pre-selects that service).
export type PortfolioSet = {
  id: string;
  title: string;
  image: string;
  alt: string;
  serviceSlug: string;
  serviceLabel: string;
};

export const PORTFOLIO: PortfolioSet[] = [
  {
    id: "chocolate-chrome",
    title: "Chocolate Chrome",
    image: "/images/service-gel-x.jpg",
    alt: "Almond stiletto Gel-X set in chocolate french tips with a sculpted gold chrome accent nail",
    serviceSlug: "gel-x",
    serviceLabel: "Gel-X",
  },
  {
    id: "koi-pond",
    title: "Koi Pond",
    image: "/images/service-nail-art.jpg",
    alt: "Long square nail art set with encapsulated koi fish, wave detail, flowers and gold stars on blue",
    serviceSlug: "nail-art",
    serviceLabel: "Nail Art",
  },
  {
    id: "frost-marble",
    title: "Frost Marble",
    image: "/images/service-acrylic.jpg",
    alt: "Extra long square acrylics in marble, 3D white texture and a crystal flower accent",
    serviceSlug: "acrylic",
    serviceLabel: "Acrylic",
  },
  {
    id: "blue-willow",
    title: "Blue Willow",
    image: "/images/service-natural-nails.jpg",
    alt: "Short natural nails with white french tips, silver lines and hand-painted blue flowers",
    serviceSlug: "natural-nails",
    serviceLabel: "Natural Nails",
  },
];
