import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, StatusNote } from "@/components/ui";
import { helpSteps, programs } from "@/lib/content";
export const metadata: Metadata = { title: "Получить помощь" };
export default function GetHelp() {
  return (
    <>
      <PageIntro
        title="Получить помощь"
        description="Здесь собраны условия и порядок обращения, предусмотренные проектом программы фонда на 2027 год."
      />
      <section className="container section reading-content">
        <div>
          <div className="availability-note">
            <h3>Приём обращений пока недоступен</h3>
            <p>
              Каналы связи и дата начала приёма пока не опубликованы. На этой
              странице можно познакомиться с планируемыми направлениями
              поддержки.
            </p>
          </div>
          <StatusNote />
        </div>
        <div className="prose">
          <h2>Кому адресованы программы</h2>
          {programs.map((p) => (
            <p key={p.id}>
              <Link className="text-link" href={"/programs/" + p.slug}>
                {p.name}
              </Link>
              <br />
              {p.audience}
            </p>
          ))}
          <h2>Условия по проекту</h2>
          <p>
            Помощь предусмотрена по заявлению и при документальном подтверждении
            нуждаемости. В зависимости от ситуации могут потребоваться сведения
            о доходах, инвалидности, статусе сироты или многодетной семьи, а при
            необходимости — акт обследования.
          </p>
          <p>
            Регион работы в проекте — Москва и Московская область. Его
            необходимо подтвердить до утверждения программы.
          </p>
          <h2>Порядок обращения</h2>
          <ol className="help-steps">
            {helpSteps.map((s) => (
              <li key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
          <p>
            Каждое решение о помощи принимается индивидуально. Срок рассмотрения
            заявлений в проекте не установлен.
          </p>
        </div>
      </section>
    </>
  );
}
