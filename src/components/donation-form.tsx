"use client";
import { useState } from "react";
export function DonationForm() {
  const [amount, setAmount] = useState("1000"),
    [regular, setRegular] = useState(true),
    [notice, setNotice] = useState(false);
  return (
    <form
      className="donation-form"
      onSubmit={(e) => {
        e.preventDefault();
        setNotice(true);
      }}
    >
      <h2>Поддержать деньгами</h2>
      <p>
        Даже небольшая регулярная помощь позволяет планировать поддержку людей.
      </p>
      <fieldset>
        <legend>Периодичность</legend>
        <div className="segmented">
          {[true, false].map((value) => (
            <button
              key={String(value)}
              type="button"
              aria-pressed={regular === value}
              onClick={() => {
                setRegular(value);
                setNotice(false);
              }}
            >
              {value ? "Ежемесячно" : "Разово"}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>Сумма пожертвования</legend>
        <div className="amount-options">
          {["500", "1000", "3000"].map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={amount === value}
              onClick={() => {
                setAmount(value);
                setNotice(false);
              }}
            >
              {new Intl.NumberFormat("ru").format(Number(value))} ₽
            </button>
          ))}
        </div>
        <label htmlFor="donation-amount">Другая сумма, ₽</label>
        <input
          id="donation-amount"
          type="number"
          min="1"
          max="10000000"
          step="1"
          required
          inputMode="numeric"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setNotice(false);
          }}
        />
      </fieldset>
      <button className="button" type="submit">
        Проверить выбранную сумму · демо
      </button>
      <p className="demo-note">
        Демонстрационный режим. Платёжный сервис пока не подключён. Деньги не
        списываются, данные карты не запрашиваются.
      </p>
      {notice && (
        <p className="form-notice" role="status">
          Вы выбрали {new Intl.NumberFormat("ru").format(Number(amount))} ₽{" "}
          {regular ? "ежемесячно" : "разово"}. Оплата пока недоступна.
          Пожертвование не оформлено.
        </p>
      )}
    </form>
  );
}
