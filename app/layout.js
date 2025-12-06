import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

export const metadata = { title: "NextShop" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 font-sans">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="max-w-7xl mx-auto p-4 md:p-6">{children}</main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}