"use client"

export function Navbar() {
  return (
    <nav className="w-full bg-background shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold tracking-tight text-card-foreground">Invoice Summarizer</h1>
          </div>
        </div>
      </div>
    </nav>
  )
}
