import Link from "next/link";
import { Heart, Sprout, HandHeart, Sun, type LucideIcon } from "lucide-react";
import { programs, type Program } from "@/lib/content";
export const icons: LucideIcon[] = [Heart, Sprout, HandHeart, Sun];
export function ProgramRows({ exclude }: { exclude?: string }) {
  return (
    <div className="program-rows">
      {programs
        .filter((p) => p.id !== exclude)
        .map((p) => {
          const i = programs.indexOf(p);
          const Icon = icons[i];
          return (
            <Link
              className="program-row"
              href={"/programs/" + p.slug}
              key={p.id}
            >
              <span className="program-symbol">
                <Icon strokeWidth={1.35} />
              </span>
              <div className="program-row-title">
                <span className="small-label">Никогда не поздно</span>
                <h3>{p.short}</h3>
              </div>
              <p>{p.summary}</p>
              <span className="row-action">О программе</span>
            </Link>
          );
        })}
    </div>
  );
}
export function StatusNote() {
  return (
    <p className="status-note">
      <span className="status-dot" />
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
      {eyebrow && <p className="section-label">{eyebrow}</p>}
      <h1>{title}</h1>
      <p className="intro-description">{description}</p>
    </div>
  );
}
export function SupportBand() {
  return (
    <section className="support-band">
      <div className="container support-content">
        <h2>
          Возможность начать
          <br />
          заново — <em>рядом.</em>
        </h2>
        <div>
          <p>
            Помощь складывается из разных поступков.
            <br />
            Найдите свой способ быть рядом.
          </p>
          <Link className="button button-warm" href="/help">
            Поддержать фонд
          </Link>
        </div>
      </div>
    </section>
  );
}
export function ProgramCard({
  program,
  onClose,
}: {
  program: Program;
  onClose: () => void;
}) {
  return (
    <div
      className="selected-program"
      id="selected-program"
      role="region"
      aria-label="Выбранная программа"
    >
      <button
        className="close-card"
        aria-label="Закрыть карточку программы"
        onClick={onClose}
      >
        ×
      </button>
      <p className="small-label">Проект программы · 2027</p>
      <h3>{program.name}</h3>
      <p>{program.summary}</p>
      <Link href={"/programs/" + program.slug} className="text-link">
        О программе
      </Link>
    </div>
  );
}
