import type { Metadata } from "next";
import "./globals.css";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "charu-1727.github.io";
const isUserSite = repositoryName === "charu-1727.github.io";
const basePath = isUserSite ? "" : `/${repositoryName}`;
const siteUrl = `https://charu-1727.github.io${basePath}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Charulata Chauhan — Enterprise AI Portfolio",
  description: "Enterprise AI Automation and Applied AI portfolio spanning SAP workflows, MCP, forecasting, NLP and governed AI systems.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Charulata Chauhan — Enterprise AI Portfolio",
    description: "I turn complex enterprise workflows into useful, governed AI systems.",
    type: "website",
    images: [{ url: `${basePath}/og.png`, width: 1200, height: 630, alt: "Charulata Chauhan — Enterprise AI Automation and Applied AI Solutions" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Charulata Chauhan — Enterprise AI Portfolio",
    description: "Enterprise AI automation, MCP, SAP workflows, forecasting and applied AI.",
    images: [`${basePath}/og.png`],
  },
  icons: { icon: `${basePath}/favicon.svg`, shortcut: `${basePath}/favicon.svg` },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
