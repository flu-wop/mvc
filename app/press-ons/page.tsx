import { redirect } from "next/navigation";
import { SHOP_ENABLED } from "@/lib/features";

// Custom press-ons are a bookable service, not a catalog. The catalog page
// comes back with the shop (lib/features.ts).
export default function PressOnsPage() {
  redirect(SHOP_ENABLED ? "/shop" : "/book?service=press-ons");
}
