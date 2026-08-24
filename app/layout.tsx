import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import { SiteNav } from "@/components/site-nav";
import { Footer } from "@/components/footer";
import "./globals.css";

// Editorial pairing: a high-contrast serif for display type, with its
// italic for pull-quotes and accents, over a humanist sans body.
const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "The EI Path",
  description:
    "Emotional intelligence for PMT. Know yourself, read the room, practise it.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteNav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
