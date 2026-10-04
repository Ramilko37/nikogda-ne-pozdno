// ФИО и назначения: Решение № 1 единственного учредителя от 19.08.2026.
// Полномочия: устав; публичные формулировки предоставлены владельцем фонда.
// Исходный PDF решения с персональными данными не публикуется.
export function TeamSection() {
  return (
    <section className="container section team-section" aria-labelledby="team">
      <h2 id="team" tabIndex={-1}>Команда и управление</h2>

      <section className="team-group" aria-labelledby="team-leadership">
        <h3 id="team-leadership">Руководство</h3>
        <div className="team-members">
          <article className="team-member">
            <h4>Шалит Павел Вадимович</h4>
            <p className="team-role">Учредитель и генеральный директор</p>
            <p>Руководит текущей деятельностью фонда, организует исполнение решений Совета, формирует команду и распределяет обязанности сотрудников. Представляет фонд, заключает договоры и отвечает за публикацию ежегодных отчётов об использовании имущества.</p>
          </article>
        </div>
      </section>

      <section className="team-group" aria-labelledby="team-council">
        <h3 id="team-council">Совет фонда</h3>
        <p className="team-responsibility">Высший орган управления фонда. Определяет приоритеты работы, утверждает благотворительные программы, годовой план, бюджет и отчётность. Избирает генерального директора и Ревизора.</p>
        <div className="team-members">
          <article className="team-member">
            <h4>Ларионова Анастасия Сергеевна</h4>
            <p className="team-role">Член Совета фонда</p>
          </article>
          <article className="team-member">
            <h4>Рыжков Михаил Ильич</h4>
            <p className="team-role">Член Совета фонда</p>
          </article>
        </div>
      </section>

      <section className="team-group" aria-labelledby="team-trustees">
        <h3 id="team-trustees">Попечительский совет</h3>
        <p className="team-responsibility">Осуществляет надзор за деятельностью фонда, принятием и исполнением решений, использованием средств и соблюдением законодательства. Работает на общественных началах.</p>
        <div className="team-members">
          <article className="team-member">
            <h4>Галямдин Рамиль Дамирович</h4>
            <p className="team-role">Член Попечительского совета</p>
          </article>
          <article className="team-member">
            <h4>Мерзликин Илья Ильич</h4>
            <p className="team-role">Член Попечительского совета</p>
          </article>
        </div>
      </section>

      <section className="team-group" aria-labelledby="team-auditor">
        <h3 id="team-auditor">Ревизор</h3>
        <div className="team-members">
          <article className="team-member">
            <h4>Пикалев Дмитрий Сергеевич</h4>
            <p className="team-role">Ревизор фонда</p>
            <p>Контролирует финансово-хозяйственную деятельность фонда. Проводит проверки не реже одного раза в год и представляет Совету заключения по их результатам.</p>
          </article>
        </div>
      </section>
    </section>
  );
}
