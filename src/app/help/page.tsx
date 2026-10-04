import type { Metadata } from "next";
import { PageIntro, StatusNote } from "@/components/ui";
import { DonationForm } from "@/components/donation-form";
export const metadata: Metadata = { title: "Поддержать фонд" };
const ways = [
  [
    "Поделиться временем",
    "В проекте предусмотрены наставничество, помощь на мероприятиях, в пункте вещевой помощи и бесплатные тренировки с тренерами-волонтёрами.",
  ],
  [
    "Помочь профессионально",
    "Фонду понадобятся услуги юристов и психологов pro bono. Для наставников предусмотрены отбор, обучение и супервизии.",
  ],
  [
    "Стать партнёром",
    "Компании смогут поддерживать подпрограммы, участвовать в корпоративном волонтёрстве и помогать помещением.",
  ],
  [
    "Передать необходимое",
    "Проект предусматривает пожертвования продуктами, вещами и техникой. Порядок передачи и список актуальных потребностей пока не опубликованы.",
  ],
];
export default function Help() {
  return (
    <>
      <PageIntro
        title="Добрые перемены начинаются с участия."
        description="Деньгами, временем, профессиональными знаниями или необходимыми вещами — в проекте программы предусмотрены разные способы поддержать людей."
      />
      <section className="container help-layout section">
        <div>
          <StatusNote />
          <div className="help-ways">
            {ways.map(([title, body], i) => (
              <article key={title}>
                <span className="small-label">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
          <p className="availability-note">
            Контакты для участия пока не опубликованы. Передача вещей, запись
            волонтёров и оформление партнёрства на сайте пока недоступны.
          </p>
        </div>
        <DonationForm />
      </section>
    </>
  );
}
