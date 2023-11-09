import Header from "@/components/Header";
import "./globals.css";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer";
import Plausible from "@/components/Plausible";
import Search from "@/components/Search";
import Link from "next/link";

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
        <Plausible />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <div className="my-10 flex justify-center">
            <Link className={`font-bold py-2 px-4 rounded bg-green-600 text-white hover:bg-green-700`} href="/weekly">Weekly summaries</Link>
          </div>
          <Search />
          <main className="px-2 flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
