import Link from "next/link";
import { Download } from "lucide-react";
import { helpSteps, programs } from "@/lib/content";

export function ProgramRows({ exclude }: { exclude?: string }) {
  return (
    <div className="program-rows">
      {programs
        .filter((p) => p.id !== exclude)
        .map((p) => (
          <Link className="program-row" href={"/programs/" + p.slug} key={p.id}>
            <h3>{p.short}</h3>
            <p className="program-audience">{p.audience}</p>
            <p>{p.summary}</p>
            <span className="row-action">
              О программе <span aria-hidden="true">→</span>
            </span>
          </Link>
        ))}
    </div>
  );
}
export function StatusNote() {
  return (
    <p className="status-note">
      Проект программы на 2027 год. Направления и условия ожидают утверждения.
    </p>
  );
}
export function PageIntro({
  title,
  description,
  eyebrow,
}: {
  title: string;
  description: string;
  eyebrow?: string;
}) {
  return (
    <div className="page-intro container">
      <Link className="breadcrumb" href="/">
        Главная
      </Link>
      <h1>{title}</h1>
      {eyebrow && <p>{eyebrow}</p>}
      <p className="intro-description">{description}</p>
    </div>
  );
}
export function DocumentLink() {
  return (
    <a
      className="document-link"
      href="/documents/program-2027-draft.docx"
      download
    >
      <div>
        <h3>Благотворительная программа БФ «Никогда не поздно» на 2027 год</h3>
        <p>Проект · 28 сентября 2026 года · DOCX</p>
        <span className="text-link">Скачать документ</span>
      </div>
      <Download size={22} aria-hidden="true" />
    </a>
  );
}
export function HelpSteps() {
  return (
    <ol className="steps">
      {helpSteps.map((s, i) => (
        <li key={s.title}>
          <span className="step-number" aria-hidden="true">
            {i + 1}
          </span>
          <div>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
export function SupportBand() {
  return (
    <section className="support-band">
      <div className="container support-content">
        <div>
          <h2>Как поддержать фонд</h2>
          <p>
            В проекте предусмотрена помощь деньгами, вещами, временем и
            профессиональными знаниями. Пожертвование через сайт пока
            недоступно.
          </p>
        </div>
        <Link className="button button-support" href="/help">
          Способы участия
        </Link>
      </div>
    </section>
  );
}
