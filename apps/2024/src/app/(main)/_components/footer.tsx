import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto p-8">
      <ul className="mb-4  flex justify-center gap-2">
        <li>
          <a
            className="underline underline-offset-4"
            href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"
          >
            MLH Code of Conduct
          </a>
        </li>
        •
        <li>
          <a
            className="underline underline-offset-4"
            href="mailto:sponsorship@knighthacks.org"
          >
            Sponsor Us
          </a>
        </li>
        •
        <li>
          <Link className="underline underline-offset-4" href="/profile">
            Profile
          </Link>
        </li>
      </ul>
      <div className="text-center">
        Made with ❤️{" "}
        <a
          className="font-bold underline underline-offset-4"
          href="https://github.com/KnightHacks"
        >
          @KnightHacks
        </a>
      </div>
    </footer>
  );
}
