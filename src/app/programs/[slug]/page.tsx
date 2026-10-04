import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { programs, money } from "@/lib/content";
import { ProgramRows, StatusNote } from "@/components/ui";
export function generateStaticParams() {
  return programs.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = programs.find((p) => p.slug === slug);
  return { title: p?.name ?? "Программа не найдена", description: p?.summary };
}
export default async function Program({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = programs.find((p) => p.slug === slug);
  if (!p) notFound();
  return (
    <>
      <section className="container program-intro">
        <Link className="breadcrumb" href="/programs">
          Все программы
        </Link>
        <p className="section-label">{p.category}</p>
        <h1>{p.name}</h1>
        <p className="intro-description">{p.summary}</p>
        <StatusNote />
      </section>
      <section className="container article-layout section">
        <aside className="program-aside">
          <p className="section-label">План на 2027 год</p>
          <p className="budget">{money(p.budget)}</p>
          <p>
            Проект бюджета подпрограммы.
            <br />
            Это план расходов, не собранная сумма.
          </p>
          <hr />
          <p>
            <strong>География по проекту</strong>
            <br />
            Москва и Московская область.
            <br />
            Требует подтверждения.
          </p>
          <p>
            <strong>Период по проекту</strong>
            <br />1 января — 31 декабря 2027
          </p>
          <Link href="/help" className="button">
            Поддержать фонд
          </Link>
        </aside>
        <div className="prose">
          <h2>Кому предназначена</h2>
          <p>{p.audience}</p>
          <h2>Для чего нужна помощь</h2>
          <p>{p.purpose}</p>
          <h2>Что предусмотрено</h2>
          <ul className="action-list">
            {p.actions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
          <h2>Как принять участие</h2>
          <p>
            Программа ожидает утверждения. Даты запуска мероприятий и доступные
            каналы записи пока не опубликованы.
          </p>
          <p>
            В проекте предусмотрен заявительный порядок получения помощи с
            документальным подтверждением нуждаемости. Перечень документов
            зависит от ситуации и вида поддержки.
          </p>
          <Link href="/get-help" className="text-link">
            Подробнее об условиях
          </Link>
        </div>
      </section>
      <section className="section programs-section">
        <div className="container">
          <h2>Другие программы</h2>
          <ProgramRows exclude={p.id} />
        </div>
      </section>
    </>
  );
}
