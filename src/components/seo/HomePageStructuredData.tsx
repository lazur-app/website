import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildFaqPageSchema,
  buildOrganizationSchema,
  buildSoftwareApplicationSchema,
  buildWebSiteSchema,
  buildDemoVideoSchema,
} from "@/lib/seo/schema";

export function HomePageStructuredData() {
  return (
    <JsonLd
      data={[
        buildWebSiteSchema(),
        buildOrganizationSchema(),
        buildDemoVideoSchema(),
        buildSoftwareApplicationSchema(),
        buildFaqPageSchema(),
      ]}
    />
  );
}
