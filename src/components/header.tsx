import Link from "next/link"
import { UserButton } from "@/components/user-button"

export default function Header() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">Smart Request</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/create-request" className="text-sm font-medium hover:underline underline-offset-4">
            Create Request
          </Link>
          <Link href="/my-requests" className="text-sm font-medium hover:underline underline-offset-4">
            My Requests
          </Link>
          <Link href="/catalog" className="text-sm font-medium hover:underline underline-offset-4">
            Catalog
          </Link>
        </nav>
        <div className="ml-4">
          <UserButton />
        </div>
      </div>
    </header>
  )
}
