import Link from "next/link";
import { EarthExplorer } from "@/components/earth-explorer";
import {
  DocumentLink,
  HelpSteps,
  ProgramRows,
  StatusNote,
  SupportBand,
} from "@/components/ui";
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <h1>
              Никогда
              <br />
              не поздно <em>изменить жизнь.</em>
            </h1>
            <p className="hero-description">
              Помощь в трудной ситуации, поддержка на пути к самостоятельности и
              забота о здоровье — в любом возрасте.
            </p>
            <div className="hero-actions">
              <Link href="/help" className="button button-support">
                Как поддержать фонд
              </Link>
              <Link href="/get-help" className="text-link">
                Условия помощи
              </Link>
            </div>
            <p className="hero-status">Проект программы на 2027 год</p>
          </div>
          <EarthExplorer />
        </div>
      </section>
      <section className="section about-section container">
        <div>
          <h2>О фонде</h2>
          <p>
            «Никогда не поздно» — благотворительный фонд, зарегистрированный в
            2026 году. Сейчас подготовлен проект программы на первый полный год
            работы.
          </p>
          <Link href="/about" className="text-link">
            Подробнее о фонде
          </Link>
        </div>
        <div className="about-copy">
          <p>
            Фонд планирует помогать семьям и одиноким пожилым людям, людям с
            инвалидностью и безработным, детям-сиротам, выпускникам интернатов и
            замещающим семьям.
          </p>
          <div className="governance-summary">
            <p>
              Текущей работой фонда руководит генеральный директор. Совет фонда
              утверждает программы и бюджет. Попечительский совет и Ревизор
              выполняют надзорные и контрольные функции.
            </p>
            <Link href="/about#team" className="text-link">
              Команда и управление
            </Link>
          </div>
        </div>
      </section>
      <section className="programs-section section">
        <div className="container">
          <h2>Программы фонда</h2>
          <StatusNote />
          <ProgramRows />
          <p className="section-footnote">
            Планируемая география — Москва и Московская область. Регион работы
            требует подтверждения до утверждения программы.
          </p>
        </div>
      </section>
      <section className="section process-section container">
        <h2>Как будет устроена помощь</h2>
        <p className="section-description">
          В проекте предусмотрены три этапа: от заявления до документального
          подтверждения помощи.
        </p>
        <HelpSteps />
        <p className="availability-note">
          Через сайт пока нельзя отправить заявку на помощь.
        </p>
        <Link href="/get-help" className="text-link">
          Условия помощи
        </Link>
      </section>
      <section className="trust-section">
        <div className="container trust-content">
          <div>
            <h2>Документы и отчётность</h2>
            <p>
              В проекте программы описаны мероприятия, план расходов и порядок
              контроля. Годовые отчёты пока не опубликованы.
            </p>
            <Link href="/reports" className="text-link">
              Все документы и порядок отчётности
            </Link>
          </div>
          <DocumentLink />
        </div>
      </section>
      <SupportBand />
    </>
  );
}
