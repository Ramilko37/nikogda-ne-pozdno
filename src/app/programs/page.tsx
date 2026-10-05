import type { Metadata } from "next";
import { PageIntro, ProgramRows, StatusNote } from "@/components/ui";
export const metadata: Metadata = { title: "Программы фонда" };
export default function Programs() {
  return (
    <>
      <PageIntro
        title="Программы фонда"
        description="Четыре направления: адресная помощь, реабилитация и трудоустройство, наставничество, физическое и психологическое здоровье."
      />
      <section className="container catalog-section">
        <StatusNote />
        <ProgramRows />
        <p className="section-footnote">
          В проекте указаны Москва и Московская область. География и
          договорённости с партнёрами требуют подтверждения до утверждения
          программы.
        </p>
      </section>
    </>
  );
}
