import Link from "next/link"
import { UserButton } from "@/components/user-button"

export default function ProcurementHeader() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center px-4">
        <Link href="/procurement" className="flex items-center gap-2">
          <span className="text-xl font-bold">Procurement Dashboard</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/procurement" className="text-sm font-medium hover:underline underline-offset-4">
            Bidding
          </Link>
          <Link href="/procurement?tab=pending" className="text-sm font-medium hover:underline underline-offset-4">
            Pending PO
          </Link>
          <Link href="/procurement?tab=completed" className="text-sm font-medium hover:underline underline-offset-4">
            Completed
          </Link>
        </nav>
        <div className="ml-4">
          <UserButton />
        </div>
      </div>
    </header>
  )
}
