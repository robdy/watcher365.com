import Header from "@/components/Header";
import "./globals.css";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Home | watcher365.com",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          async
          defer
          onload="this.setAttribute('data-domain',window.location.host)"
          src="https://plausible.io/js/plausible.js"
        ></script>
      </head>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="px-2 flex-1 ">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
