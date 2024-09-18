"use client";

import { useState } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { Web3Provider } from "@/components/web3-provider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Web3Provider>
          <div className="flex h-screen overflow-hidden bg-background text-foreground">
            <Sidebar open={sidebarOpen} onClose={closeSidebar} />
            <div className="flex flex-col flex-1 overflow-hidden">
              <Header onMenuClick={() => setSidebarOpen(true)} />
              <main className="flex-1 overflow-hidden">{children}</main>
            </div>
          </div>
        </Web3Provider>
      </body>
    </html>
  );
}
