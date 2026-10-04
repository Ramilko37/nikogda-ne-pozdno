import type { Metadata } from "next";
import { Header, Footer } from "@/components/site-shell";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "Никогда не поздно — благотворительный фонд",
    template: "%s | Никогда не поздно",
  },
  description:
    "Помощь, новое начало и здоровье в любом возрасте и положении. Познакомьтесь с проектом благотворительной программы фонда на 2027 год.",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <a href="#main" className="skip-link">
          Перейти к содержанию
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
