import "./globals.css";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import MusicPlayer from "@/components/MusicPlayer";
import "@fontsource/cormorant-garamond";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400","500","600"],
  variable: "--font-serif",
});

const mont = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({ children }: any) {
  return (
    <html lang="pt-br">
      <body className={`${serif.variable} ${mont.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}

export const metadata = {
  title: "Emilly & Marcivon",
  description: "Casamento & Chá de Panela",
  icons: {
    icon: "/em-logo.svg",
  },
};