import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-border px-4 py-6 text-sm text-muted-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Jaaarland</p>
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li>
              <Link className="transition-colors hover:text-foreground" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="transition-colors hover:text-foreground" to="/products">
                Shop
              </Link>
            </li>
            <li>
              <Link className="transition-colors hover:text-foreground" to="/cart">
                Cart
              </Link>
            </li>
            <li>
              <Link className="transition-colors hover:text-foreground" to="/orders">
                Orders
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}