"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { signOut } from "next-auth/react"

export function Navbar() {
  const handleLogout = () => {
    signOut({
      callbackUrl: '/login'
    })
  }

  return (
    <nav className="w-full bg-background shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold tracking-tight text-card-foreground">Invoice Summarizer</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:bg-muted hover:text-muted-foreground"
              >
                Home
              </Button>
            </Link>
            <Link href="/invoices">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:bg-muted hover:text-muted-foreground"
              >
                Invoices
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="text-muted-foreground hover:bg-muted hover:text-muted-foreground"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
