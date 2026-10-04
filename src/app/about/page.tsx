import type { Metadata } from "next";
import Link from "next/link";
import { TeamSection } from "@/components/team-section";
import { PageIntro, SupportBand, StatusNote } from "@/components/ui";
import { foundation } from "@/lib/content";
export const metadata: Metadata = { title: "О фонде" };
export default function About() {
  return (
    <>
      <PageIntro
        title="Никогда не поздно быть рядом."
        description="Благотворительный фонд «Никогда не поздно» зарегистрирован в 2026 году. 2027-й в проекте программы обозначен как первый полный год работы."
      />
      <section className="container section article-layout">
        <div>
          <p className="section-label">Наша миссия</p>
          <h2>
            Возможности есть.
            <br />
            <em>В любом возрасте.</em>
          </h2>
        </div>
        <div className="prose">
          <p className="large-copy">{foundation.mission}</p>
          <h3>Поддержка в разных обстоятельствах</h3>
          <p>
            Проект программы объединяет помощь семьям и одиноким пожилым людям,
            людям с инвалидностью и безработным, детям-сиротам, выпускникам
            интернатов и замещающим семьям. Отдельное направление посвящено
            физическому и психологическому здоровью.
          </p>
          <h3>Равные условия и внимание к человеку</h3>
          <p>
            В проекте предусмотрена помощь по заявлению и при документальном
            подтверждении нуждаемости. Учредитель фонда и связанные лица могут
            пользоваться услугами только на равных условиях.
          </p>
          <StatusNote />
        </div>
      </section>
      <TeamSection />
      <section className="container section article-layout" aria-labelledby="about-documents">
        <h2 id="about-documents">Документы</h2>
        <div className="prose">
          <p>
            Ознакомьтесь с проектом благотворительной программы на 2027 год
            и предусмотренной отчётностью фонда.
          </p>
          <Link href="/reports" className="text-link">Документы и отчёты</Link>
        </div>
      </section>
      <section className="container section article-layout" aria-labelledby="about-contacts">
        <h2 id="about-contacts">Контакты</h2>
        <div className="prose">
          <p>
            Телефон, электронная почта и адрес для обращений появятся после
            подтверждения фондом. Отправка обращений через сайт пока недоступна.
          </p>
          <Link href="/contacts" className="text-link">Контакты фонда</Link>
        </div>
      </section>
      <SupportBand />
    </>
  );
}
