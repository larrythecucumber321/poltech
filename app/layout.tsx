"use client";

import { useState } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { Web3Provider } from "@/components/web3-provider";
import { ApolloProvider } from "./providers/ApolloProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-background-dark text-foreground-dark`}
      >
        <Web3Provider>
          <ApolloProvider>
            <div className="flex h-screen bg-background-dark">
              <Sidebar
                open={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
              />
              <div className="flex flex-col flex-1 overflow-hidden">
                <Header onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto">
                  {children}
                </main>
              </div>
            </div>
          </ApolloProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
