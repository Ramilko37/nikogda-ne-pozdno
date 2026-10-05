"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
const links = [
  ["/about", "О фонде"],
  ["/programs", "Программы"],
  ["/get-help", "Условия помощи"],
  ["/reports", "Документы"],
];
export function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => setOpen(false), [path]);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link
          href="/"
          className="brand"
          aria-label="Никогда не поздно — главная"
        >
          <span className="brand-name">
            никогда
            <br />
            не поздно
            <span className="brand-light" />
          </span>
          <span className="brand-caption">
            благотворительный
            <br />
            фонд
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Основная навигация">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={path === href ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link href="/help" className="button header-help">
          Поддержка
        </Link>
        <button
          ref={menuButton}
          className="mobile-menu icon-button"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-nav"
          aria-label="Мобильная навигация"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              menuButton.current?.focus();
            }
          }}
        >
          {links.map(([href, label]) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
          <Link href="/contacts">Контакты</Link>
        </nav>
      )}
    </header>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <Link href="/" className="footer-brand">
            Никогда не поздно
          </Link>
          <p>Адресная помощь, реабилитация, наставничество и здоровье.</p>
          <nav aria-label="Навигация в подвале">
            <Link href="/contacts">Контакты</Link>
            <Link href="/reports">Документы и отчёты</Link>
            <Link href="/help">Как поддержать фонд</Link>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>Благотворительный фонд «Никогда не поздно»</span>
          <span>Проект программы · 2027</span>
        </div>
      </div>
    </footer>
  );
}
