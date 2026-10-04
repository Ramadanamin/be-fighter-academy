import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Be Fighter Academy | تدريب قتالي برايفت في بيتك",
  description: "مدرب ملاكمة وكيك بوكسينج وMMA ودفاع عن النفس في بيتك للأطفال والكبار. تدريب برايفت في مدينتي والرحاب والشروق والجولف والديار. اطلب تفاصيل برنامجك.",
  keywords: ["تدريب ملاكمة برايفت", "كيك بوكسينج للأطفال", "دفاع عن النفس", "مدرب بوكسينج منزلي", "Be Fighter Academy"],
  icons: { icon: "/media/be-fighter-logo.png", shortcut: "/media/be-fighter-logo.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
