import Link from "next/link"
import { UserButton } from "@/components/user-button"

export default function SellerHeader() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center px-4">
        <Link href="/seller" className="flex items-center gap-2">
          <span className="text-xl font-bold">Seller Portal</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/seller" className="text-sm font-medium hover:underline underline-offset-4">
            Open Requests
          </Link>
          <Link href="/seller?tab=bidded" className="text-sm font-medium hover:underline underline-offset-4">
            My Bids
          </Link>
          <Link href="/seller?tab=awarded" className="text-sm font-medium hover:underline underline-offset-4">
            Awarded
          </Link>
        </nav>
        <div className="ml-4">
          <UserButton />
        </div>
      </div>
    </header>
  )
}
