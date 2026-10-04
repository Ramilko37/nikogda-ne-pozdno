import type { Metadata } from "next";
import {
  PageIntro,
  ProgramRows,
  StatusNote,
  SupportBand,
} from "@/components/ui";
export const metadata: Metadata = { title: "Программы фонда" };
export default function Programs() {
  return (
    <>
      <PageIntro
        title="Четыре способа быть рядом."
        description="Адресная помощь, новое начало, самостоятельность и здоровье. Четыре подпрограммы комплексной благотворительной программы «Никогда не поздно» на 2027 год."
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
      <SupportBand />
    </>
  );
}
