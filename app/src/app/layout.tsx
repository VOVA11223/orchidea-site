import type { Metadata } from "next";
import { Inter, Manrope, Marck_Script } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { ProductsProvider } from "@/lib/products-context";
import { CategoriesProvider } from "@/lib/categories-context";
import { OrdersProvider } from "@/lib/orders-context";
import { CallbackModalProvider } from "@/lib/callback-modal-context";
import { SettingsProvider } from "@/lib/settings-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CallbackModal from "@/components/CallbackModal";
import CookieConsent from "@/components/CookieConsent";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-ui" });
const manrope = Manrope({ subsets: ["latin", "cyrillic"], variable: "--font-brand" });
const marckScript = Marck_Script({ subsets: ["latin", "cyrillic"], weight: "400", variable: "--font-script" });

export const metadata: Metadata = {
  title: "Orchidea — оптовые искусственные цветы",
  description: "Оптовые поставки искусственных цветов по Волгоградской области. Минимальный заказ 10 000 ₽.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${manrope.variable} ${marckScript.variable}`}>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <SettingsProvider>
          <OrdersProvider>
            <CategoriesProvider>
              <ProductsProvider>
                <CartProvider>
                  <CallbackModalProvider>
                    <Header />
                    <main className="flex-1">{children}</main>
                    <Footer />
                    <CallbackModal />
                    <CookieConsent />
                  </CallbackModalProvider>
                </CartProvider>
              </ProductsProvider>
            </CategoriesProvider>
          </OrdersProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
