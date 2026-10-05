import type { Metadata, Viewport } from "next";
import { Header, Footer } from "@/components/site-shell";
import "./globals.css";
export const viewport: Viewport = { themeColor: "#fafaf7" };
export const metadata: Metadata = {
  metadataBase: new URL("https://nikogda-ne-pozdno.vercel.app"),
  title: {
    default: "Никогда не поздно — благотворительный фонд",
    template: "%s | Никогда не поздно",
  },
  description:
    "Помощь, новое начало и здоровье в любом возрасте и положении. Познакомьтесь с проектом благотворительной программы фонда на 2027 год.",
  // Indexing stays disabled until the foundation confirms public launch readiness.
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Никогда не поздно",
    title: "Никогда не поздно — благотворительный фонд",
    description:
      "Четыре направления помощи. Познакомьтесь с проектом программы фонда на 2027 год.",
    images: [
      {
        url: "/assets/social-cover.png",
        width: 1200,
        height: 630,
        alt: "Никогда не поздно — благотворительный фонд. Проект программы на 2027 год.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Никогда не поздно — благотворительный фонд",
    description: "Четыре направления помощи. Проект программы на 2027 год.",
    images: ["/assets/social-cover.png"],
  },
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
