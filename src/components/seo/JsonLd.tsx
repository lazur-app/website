type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/** Escapes "<" so generated text can never close the script tag. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
