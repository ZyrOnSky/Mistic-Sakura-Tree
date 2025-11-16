'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Credenciales inválidas')
      } else {
        router.push('/safe-admin/events')
        router.refresh()
      }
    } catch (error) {
      setError('Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-mystic-black via-mystic-dark to-mystic-black p-4">
      <div className="w-full max-w-md">
        <div className="bg-mystic-dark/80 backdrop-blur-sm border border-sakura/20 rounded-2xl p-8 shadow-sakura-glow">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-display font-bold text-sakura mb-2">
              Ꮇistic Ꭶakura Ꭲree
            </h1>
            <p className="text-gray-400 text-sm">Portal de Administración</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-mystic-black/50 border border-sakura/30 rounded-lg focus:outline-none focus:border-sakura focus:ring-2 focus:ring-sakura/20 text-white placeholder-gray-500 transition-colors"
                placeholder="admin@mst.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-mystic-black/50 border border-sakura/30 rounded-lg focus:outline-none focus:border-sakura focus:ring-2 focus:ring-sakura/20 text-white placeholder-gray-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sakura hover:bg-sakura-dark text-mystic-black font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-sakura-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

