import Link from "next/link"
import { UserButton } from "@/components/user-button"
import { Sparkles } from "lucide-react"

export default function CustomerHeader() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">R360 Rewards</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/rewards-catalog" className="text-sm font-medium hover:underline underline-offset-4">
            Rewards Catalog
          </Link>
          <Link
            href="/create-request"
            className="text-sm font-medium hover:underline underline-offset-4 flex items-center"
          >
            <Sparkles className="h-3 w-3 mr-1" /> Smart Request
          </Link>
          <Link href="/my-requests" className="text-sm font-medium hover:underline underline-offset-4">
            My Requests
          </Link>
        </nav>
        <div className="ml-4">
          <UserButton />
        </div>
      </div>
    </header>
  )
}
