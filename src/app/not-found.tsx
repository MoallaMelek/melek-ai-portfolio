import Link from "next/link";

export const metadata = { title: "Not found" };

export default function NotFound() {
  return (
    <div className="wrap nf">
      <span className="label">404 · Nothing recorded here</span>
      <h1>No episode at this address.</h1>
      <p className="muted" style={{ maxWidth: "46ch" }}>
        The page you asked for doesn&apos;t exist, or it moved. Everything that does exist is on the index.
      </p>
      <p>
        <Link className="link-arrow" href="/">
          Back to the work <span className="arr">→</span>
        </Link>
      </p>
    </div>
  );
}
