import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { Web3Provider } from "@/components/web3-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Your App Title",
  description: "Your app description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      {" "}
      {/* Add 'dark' class here for dark mode */}
      <body className={inter.className}>
        <Web3Provider>
          <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
            <Sidebar />
            <main className="flex-1">
              <Header />
              {children}
            </main>
          </div>
        </Web3Provider>
      </body>
    </html>
  );
}
