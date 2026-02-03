import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import InterfaceNavigation from "@/components/interface-navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "R360 Rewards",
  description: "Streamline your procurement process with R360 Rewards and Smart Request",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <InterfaceNavigation />
        <main className="container mx-auto py-6 px-4">{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
