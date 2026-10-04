import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/ui";
export const metadata: Metadata = { title: "Контакты" };
export default function Contacts() {
  return (
    <>
      <PageIntro
        title="Связь с фондом."
        description="Благотворительный фонд «Никогда не поздно»."
      />
      <section className="container section contact-section">
        <h2>
          Контакты пока
          <br />
          <em>не опубликованы.</em>
        </h2>
        <div>
          <p>
            Телефон, электронная почта и адрес для обращений появятся здесь
            после подтверждения фондом. Отправка обращений через сайт пока
            недоступна.
          </p>
          <p>
            Планируемый регион работы — Москва и Московская область. Это
            география проекта программы, а не адрес офиса.
          </p>
          <Link href="/programs" className="text-link">
            Познакомиться с программами
          </Link>
        </div>
      </section>
    </>
  );
}
