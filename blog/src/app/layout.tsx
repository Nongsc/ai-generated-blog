import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GlobalBackground } from "@/components/common/GlobalBackground";
import { SiteConfigProvider } from "@/contexts/SiteConfigContext";
import { getServerSiteConfig } from "@/lib/config-server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getServerSiteConfig();

  const title = config?.basic?.title || "博客";
  const description = config?.basic?.description || "个人博客";
  const keywords = config?.seo?.keywords || [];
  const ogImage = config?.seo?.ogImage;

  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    openGraph: {
      title,
      description,
      type: "website",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: ogImage
      ? {
          card: config?.seo?.twitterCard === "summary_large_image" ? "summary_large_image" : "summary",
          site: config?.seo?.twitterSite,
        }
      : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getServerSiteConfig();
  const googleAnalyticsId = config?.analytics?.googleAnalyticsId;
  const baiduTongjiId = config?.analytics?.baiduTongjiId;

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* Google Analytics */}
        {googleAnalyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
            >
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleAnalyticsId}');
              `}
            </Script>
          </>
        )}

        {/* Baidu Analytics */}
        {baiduTongjiId && (
          <Script
            id="baidu-analytics"
            strategy="afterInteractive"
          >
            {`
              var _hmt = _hmt || [];
              (function() {
                var hm = document.createElement("script");
                hm.src = "https://hm.baidu.com/hm.js?${baiduTongjiId}";
                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(hm, s);
              })();
            `}
          </Script>
        )}

        <SiteConfigProvider initialConfig={config}>
          <GlobalBackground>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1 pt-16">
                {children}
              </main>
              <Footer />
            </div>
          </GlobalBackground>
        </SiteConfigProvider>
      </body>
    </html>
  );
}
