import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Serif, Fragment_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/ui/Nav";
import Providers from "@/components/providers/Providers";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif-display",
  display: "swap",
});

const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fragment",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gavika-studio.vercel.app"),
  title: {
    default: "Gavika — Digital Experience Studio",
    template: "%s — Gavika",
  },
  description:
    "Gavika is a boutique digital studio for cinematic, immersive web experiences — luxury product and automotive launches built with Awwwards-calibre craft.",
  openGraph: {
    title: "Gavika — Digital Experience Studio",
    description:
      "We don't build websites. We build digital experiences. Cinematic launches for luxury products, engineered to perform.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${instrumentSerif.variable} ${fragmentMono.variable} h-full`}
    >
      <body className="grain min-h-full bg-carbon text-bone">
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <Providers>
          <a
            href="#main"
            className="t-label fixed top-3 left-3 z-100 -translate-y-16 bg-bone px-3 py-2 text-carbon transition-transform focus:translate-y-0"
          >
            Skip to content
          </a>
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
