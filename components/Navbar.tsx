'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-mystic-dark/80 backdrop-blur-md border-b border-sakura/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-display font-bold text-sakura">
              Ꮇistic Ꭶakura Ꭲree
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-300 hover:text-sakura transition-colors"
            >
              Inicio
            </Link>
            <Link
              href="/events"
              className="text-gray-300 hover:text-sakura transition-colors"
            >
              Eventos
            </Link>
            {session ? (
              <>
                <Link
                  href="/safe-admin/events"
                  className="text-gray-300 hover:text-sakura transition-colors"
                >
                  Admin
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-300 hover:text-sakura transition-colors"
                >
                  Salir
                </button>
              </>
            ) : (
              <Link
                href="/safe-admin/login"
                className="text-gray-300 hover:text-sakura transition-colors"
              >
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

