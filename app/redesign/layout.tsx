import type { Metadata } from "next";
import { DM_Serif_Display, Outfit } from "next/font/google";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Vedran — Portfolio",
  description: "Building digital experiences with craft and intention",
};

export default function RedesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${dmSerif.variable} ${outfit.variable}`}>
      {children}
    </div>
  );
}
