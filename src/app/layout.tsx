import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import { DepthToggle } from "@/components/DepthToggle";
import { SITE_URL, profile } from "@/content/profile";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Melek Moalla — AI engineering, measured",
    template: "%s — Melek Moalla",
  },
  description: profile.description,
  applicationName: "Melek Moalla",
  authors: [{ name: profile.name, url: profile.github }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Melek Moalla",
    title: "Melek Moalla — AI engineering, measured",
    description: profile.description,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Melek Moalla — AI engineering, measured",
    description: profile.description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eeece6" },
    { media: "(prefers-color-scheme: dark)", color: "#131312" },
  ],
};

// Runs before paint: restores "Under the hood" mode without a flash. A link with ?depth=deep
// (or ?depth=overview) sets the mode explicitly, so engineers can be sent straight to the detail.
const boot = `try{var q=new URLSearchParams(location.search).get('depth');if(q==='deep'||q==='overview')localStorage.setItem('depth',q);if(localStorage.getItem('depth')==='deep')document.documentElement.dataset.depth='deep'}catch(e){}`;

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: profile.name,
  url: `${SITE_URL}/`,
  image: {
    "@type": "ImageObject",
    "@id": `${SITE_URL}/#portrait`,
    contentUrl: `${SITE_URL}/melek-portrait.webp`,
    caption: "Portrait of Melek Moalla",
    width: 800,
    height: 1000,
  },
  email: `mailto:${profile.email}`,
  jobTitle: "AI engineering student",
  affiliation: { "@type": "CollegeOrUniversity", name: profile.schoolFull },
  address: { "@type": "PostalAddress", addressCountry: "TN" },
  sameAs: [profile.github, profile.linkedin].filter(Boolean),
  knowsAbout: ["Reinforcement learning", "Computer vision", "Imitation learning", "LLM agents", "Machine learning"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <div className="wrap">
            <Link className="brand" href="/" aria-label="Melek Moalla, home">
              Melek Moalla<span>.</span>
            </Link>
            <nav className="nav" aria-label="Sections">
              <Link href="/#work">Work</Link>
              <Link href="/#lab">Lab</Link>
              <Link href="/#path">About</Link>
              <Link href="/#contact">Contact</Link>
            </nav>
            <a className="header-contact" href={`mailto:${profile.email}`}>Let&apos;s talk ↗</a>
            <DepthToggle />
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div className="wrap mono">
            <span>© 2026 Melek Moalla · Tunis</span>
            <span>
              Every number on this site links back to a public repository.{" "}
              <a href={profile.github} className="ext">
                GitHub
              </a>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
