import "./globals.css";
import "@/styles/index.scss";
import { Noto_Sans_KR } from "next/font/google";

export const metadata = {
  title: "코인 평단가 계산기",
  description: "코인 평단가를 계산해 줍니다.",
  canonical: "https://next-coin-calc.vercel.app/",
  openGraph: {
    title: "코인 평단가 계산기",
    description: "코인 평단가를 계산해 줍니다.",
    type: "website",
    siteName: "Coin Calc",
    images: [
      {
        url: "./images/logo.png",
        width: 192,
        height: 192,
        alt: "이미지",
      },
    ],
  },
};

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["100", "400", "700", "900"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={notoSansKr.className}>
      <body className="relative min-h-screen w-full bg-[#f8f8f8] text-base text-neutral-900 dark:bg-neutral-900/95 dark:text-neutral-200">
        {children}
      </body>
    </html>
  );
}
