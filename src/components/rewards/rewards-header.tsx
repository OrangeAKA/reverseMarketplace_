"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Bell, HelpCircle, LogOut, User, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export default function RewardsHeader() {
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary/10 rounded-full p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-primary"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight">R360 Rewards</span>
              </div>
            </Link>

            <nav className="hidden md:flex gap-6">
              <NavLink href="/rewards-catalog" active={pathname.startsWith("/rewards-catalog")}>
                Rewards Catalog
              </NavLink>
              <NavLink href="/create-request" active={pathname.startsWith("/create-request")}>
                <Sparkles className="h-4 w-4 mr-1" />
                Smart Request
              </NavLink>
              <NavLink href="/my-requests" active={pathname.startsWith("/my-requests")}>
                My Requests
              </NavLink>
              <NavLink href="/catalog" active={pathname.startsWith("/catalog")}>
                Catalog
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className={cn("relative", searchOpen ? "block" : "hidden md:block")}>
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="What's on your mind?"
                className="w-[300px] pl-8 bg-background border-input text-foreground"
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-foreground"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" className="text-foreground">
              <Bell className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2">
              <div className="hidden md:block text-right">
                <div className="text-sm font-medium">Krishna Akhil A</div>
                <div className="text-xs text-primary">6858 Pts</div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8 border border-muted">
                      <AvatarImage src="/abstract-geometric-shapes.png" alt="User" />
                      <AvatarFallback className="bg-muted text-muted-foreground">KA</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Krishna Akhil A</p>
                      <p className="text-xs leading-none text-muted-foreground">krishna.akhil@example.com</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help & Support</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

interface NavLinkProps {
  href: string
  active?: boolean
  children: React.ReactNode
}

function NavLink({ href, active, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary flex items-center",
        active ? "text-primary" : "text-foreground",
      )}
    >
      {children}
    </Link>
  )
}
