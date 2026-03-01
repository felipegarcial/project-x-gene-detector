import { Link, NavLink } from 'react-router-dom'

export function Header() {
  return (
    <header className="border-b border-border/50 bg-background sticky top-0 z-50">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 rounded-full border-2 border-primary/60 flex items-center justify-center group-hover:border-primary transition-colors">
            <div className="w-2 h-2 rounded-full bg-primary" />
          </div>
          <span className="text-sm font-bold tracking-[0.3em] uppercase text-foreground/90">
            Project X-Gene
          </span>
        </Link>
        <nav aria-label="Main navigation" className="flex gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`
            }
          >
            Scanner
          </NavLink>
          <NavLink
            to="/stats"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`
            }
          >
            Stats
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
