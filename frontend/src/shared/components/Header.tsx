import { Link, NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold tracking-tight">
          CEREBRO
        </Link>
        <nav className="flex gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-foreground ${isActive ? 'text-foreground' : 'text-muted-foreground'}`
            }
          >
            Scanner
          </NavLink>
          <NavLink
            to="/stats"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-foreground ${isActive ? 'text-foreground' : 'text-muted-foreground'}`
            }
          >
            Stats
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
