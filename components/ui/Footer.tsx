import Link from "next/link";

export default function Footer() {
  return (
    <footer className="gutter hairline-t pt-10 pb-8">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="t-label">Gavika — digital experience studio</p>
          <p className="t-serif mt-2 text-smoke">Built to be felt.</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-7 gap-y-2">
            {[
              ["Work", "/work"],
              ["Lab", "/lab"],
              ["Performance", "/performance"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="t-label t-label-bone u-link" data-cursor>
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="mailto:studio@gavika.com"
                className="t-label t-label-bone u-link"
                data-cursor
              >
                studio@gavika.com
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <p className="t-label mt-10 opacity-60">
        © Gavika MMXXVI — All case studies are self-initiated concept work.
      </p>
    </footer>
  );
}
