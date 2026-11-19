import { CtaBand, LocationSection } from "../../site/components";
import { PAGES } from "../../site/seo";
import { usePageSeo } from "../../site/usePageSeo";

export function ContactPage() {
  usePageSeo(PAGES.contact);

  return (
    <>
      <LocationSection headingLevel="h1" />
      <CtaBand
        text="Te respondemos por WhatsApp o en llamada."
        title="Estamos para ayudarte"
        whatsappText="Hola, quiero información de sus servicios."
      />
    </>
  );
}
