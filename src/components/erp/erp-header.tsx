import Link from "next/link"
import { UserButton } from "@/components/user-button"

export default function ERPHeader() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center px-4">
        <Link href="/erp" className="flex items-center gap-2">
          <span className="text-xl font-bold">ERP Simulation</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/erp" className="text-sm font-medium hover:underline underline-offset-4">
            Purchase Orders
          </Link>
          <Link href="/erp?tab=inventory" className="text-sm font-medium hover:underline underline-offset-4">
            Inventory
          </Link>
        </nav>
        <div className="ml-4">
          <UserButton />
        </div>
      </div>
    </header>
  )
}
