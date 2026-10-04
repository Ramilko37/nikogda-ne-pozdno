import Link from "next/link";
import { EarthExplorer } from "@/components/earth-explorer";
import { ProgramRows, StatusNote, SupportBand } from "@/components/ui";
import { helpSteps } from "@/lib/content";
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <h1>
              Никогда
              <br />
              не поздно
              <br />
              <em>изменить жизнь.</em>
            </h1>
            <p className="hero-description">
              Помощь в трудной ситуации, поддержка на пути к самостоятельности и
              забота о здоровье — в любом возрасте.
            </p>
            <div className="hero-actions">
              <Link href="/help" className="button">
                Помочь фонду
              </Link>
              <Link href="/programs" className="text-link">
                Наши программы
              </Link>
            </div>
            <div className="hero-status">
              <span />
              Знакомьтесь с проектом программы на 2027 год
            </div>
          </div>
          <EarthExplorer />
        </div>
      </section>
      <section className="section about-section container">
        <div>
          <p className="section-label">О фонде</p>
          <h2>
            У каждого человека
            <br />
            должна быть
            <br />
            <em>точка опоры.</em>
          </h2>
        </div>
        <div className="about-copy">
          <p className="large-copy">
            Обстоятельства могут говорить «поздно». Мы хотим, чтобы у человека
            оставалась возможность получить помощь и начать заново.
          </p>
          <p>
            «Никогда не поздно» — благотворительный фонд, зарегистрированный в
            2026 году. Проект первого полного года работы объединяет адресную
            помощь, реабилитацию и трудоустройство, наставничество и заботу о
            здоровье.
          </p>
          <Link href="/about" className="text-link">
            Познакомиться с фондом
          </Link>
        </div>
      </section>
      <section className="programs-section section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="section-label">Четыре направления заботы</p>
              <h2>
                Поддержка для
                <br />
                <em>нового начала.</em>
              </h2>
            </div>
            <p>
              Разные жизненные ситуации.
              <br />
              Одна цель — помочь человеку
              <br />
              обрести опору.
            </p>
          </div>
          <StatusNote />
          <ProgramRows />
          <p className="section-footnote">
            Планируемая география — Москва и Московская область. Регион работы
            требует подтверждения до утверждения программы.
          </p>
        </div>
      </section>
      <section className="section container">
        <div className="section-heading">
          <div>
            <p className="section-label">Как устроена помощь</p>
            <h2>
              С вниманием
              <br />
              <em>к каждой ситуации.</em>
            </h2>
          </div>
          <p>
            В проекте программы предусмотрен
            <br />
            понятный порядок рассмотрения
            <br />
            обращений.
          </p>
        </div>
        <div className="steps">
          {helpSteps.map((s, i) => (
            <article key={s.title}>
              <span className="step-number">0{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
        <Link href="/get-help" className="text-link">
          Условия получения помощи
        </Link>
      </section>
      <section className="trust-section">
        <div className="container trust-content">
          <div>
            <p className="section-label">Открытость с самого начала</p>
            <h2>
              Доверие начинается
              <br />
              <em>с понятных решений.</em>
            </h2>
          </div>
          <div>
            <p>
              В проекте предусмотрены раздельный учёт целевых пожертвований,
              документальное подтверждение помощи и публичный годовой отчёт.
            </p>
            <p>
              Сейчас можно ознакомиться с проектом программы на 2027 год. Итоги
              работы в нём не заявлены.
            </p>
            <Link href="/reports" className="text-link">
              Документы и отчётность
            </Link>
          </div>
        </div>
      </section>
      <SupportBand />
    </>
  );
}
