"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const interfaces = [
  {
    name: "Customer Interface",
    path: "/",
    description: "Browse catalog and create Smart Requests",
  },
  {
    name: "Seller Portal",
    path: "/seller",
    description: "View and bid on Smart Requests",
  },
  {
    name: "Procurement Dashboard",
    path: "/procurement",
    description: "Manage requests and accept bids",
  },
  {
    name: "ERP Simulation",
    path: "/erp",
    description: "View purchase orders and inventory",
  },
]

export default function InterfaceNavigation() {
  const pathname = usePathname()
  const [activeInterface, setActiveInterface] = useState("")

  useEffect(() => {
    // Determine which interface is active based on the current path
    const active = interfaces.find((item) => {
      if (item.path === "/") {
        return (
          pathname === "/" ||
          pathname.startsWith("/create-request") ||
          pathname.startsWith("/my-requests") ||
          pathname.startsWith("/catalog")
        )
      }
      return pathname.startsWith(item.path)
    })

    setActiveInterface(active?.path || "/")
  }, [pathname])

  return (
    <div className="bg-gray-100 border-b">
      <div className="container mx-auto px-4">
        <nav className="flex overflow-x-auto py-2">
          {interfaces.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md mx-1 whitespace-nowrap",
                activeInterface === item.path
                  ? "bg-white shadow-sm text-primary"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
