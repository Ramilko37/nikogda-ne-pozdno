import Link from "next/link";
export default function NotFound() {
  return (
    <section className="container section page-intro">
      <p className="section-label">404</p>
      <h1>Этой страницы нет.</h1>
      <p>Но нужную информацию можно найти в программах фонда.</p>
      <Link className="button" href="/programs">
        К программам
      </Link>
    </section>
  );
}
