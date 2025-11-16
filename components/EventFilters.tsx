'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function EventFilters({ 
  categorias, 
  categoriaActual 
}: { 
  categorias: string[]
  categoriaActual?: string 
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleFilter = (categoria: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (categoria === 'all') {
      params.delete('categoria')
    } else {
      params.set('categoria', categoria)
    }
    router.push(`/events?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <button
        onClick={() => handleFilter('all')}
        className={`px-4 py-2 rounded-lg font-medium transition-all ${
          !categoriaActual || categoriaActual === 'all'
            ? 'bg-sakura text-mystic-black shadow-sakura'
            : 'bg-mystic-dark/60 text-gray-300 border border-sakura/20 hover:border-sakura/40'
        }`}
      >
        Todos
      </button>
      {categorias.map((categoria) => (
        <button
          key={categoria}
          onClick={() => handleFilter(categoria)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            categoriaActual === categoria
              ? 'bg-sakura text-mystic-black shadow-sakura'
              : 'bg-mystic-dark/60 text-gray-300 border border-sakura/20 hover:border-sakura/40'
          }`}
        >
          {categoria}
        </button>
      ))}
    </div>
  )
}

