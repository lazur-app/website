import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildFaqPageSchema,
  buildOrganizationSchema,
  buildSoftwareApplicationSchema,
} from "@/lib/seo/schema";

export function HomePageStructuredData() {
  return (
    <JsonLd
      data={[
        buildOrganizationSchema(),
        buildSoftwareApplicationSchema(),
        buildFaqPageSchema(),
      ]}
    />
  );
}
