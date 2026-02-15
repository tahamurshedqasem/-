import "./globals.css";


// const cairo = Cairo({
//   subsets: ["arabic", "latin"],
//   weight: ["400", "500", "700"],
//   variable: "--font-cairo",
//   display: "swap",
// });

/* ================= SEO METADATA ================= */
export const metadata = {
  title: {
    default: "شغف وإشراقة | نظام متابعة السلوك والانضباط",
    template: "%s | شغف وإشراقة",
  },
  description:
    "نظام شغف وإشراقة هو نظام إلكتروني مخصص للكادر المدرسي لمتابعة السلوك والانضباط، وتسجيل النقاط بطريقة احترافية وسهلة.",
  keywords: [
    "شغف وإشراقة",
    "نظام نقاطي",
    "السلوك والانضباط",
    "نظام مدرسي",
    "الكادر التعليمي",
    "متابعة الطلاب",
    "نظام تعليمي سعودي",
  ],
  authors: [{ name: "عفراء آل منجم" }],
  creator: "عفراء آل منجم",
  publisher: "شغف وإشراقة",
  robots: {
    index: true,
    follow: true,
  },
icons: {
  icon: "/favicon.png",
},
  openGraph: {
    title: "شغف وإشراقة | نظام متابعة السلوك والانضباط",
    description:
      "منصة إلكترونية مخصصة للكادر المدرسي لمتابعة سلوك الطلاب وتعزيز الانضباط بأسلوب حديث.",
    url: "https://shaghaf-ishraqa.org",
    siteName: "شغف وإشراقة",
    images: [
      {
        url: "/image.png",
        width: 512,
        height: 512,
        alt: "شغف وإشراقة",
      },
    ],
    locale: "ar_SA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "شغف وإشراقة | نظام متابعة السلوك والانضباط",
    description:
      "نظام إلكتروني للكادر المدرسي لمتابعة السلوك والانضباط بطريقة سهلة واحترافية.",
    images: ["/image.png"],
  },
};

/* ================= ROOT LAYOUT ================= */
export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" >
      <body className="font-sans bg-gray-50 text-gray-800 min-h-screen flex flex-col">
        {/* المحتوى */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        {/* <footer className="border-t bg-white text-center py-4 text-sm text-gray-500">
          تم تنفيذه من قبل الموجهة الطلابية
          <br />
          <span className="font-semibold text-gray-700">عفراء آل منجم</span>
        </footer> */}
      </body>
    </html>
  );
}
