import Navbar from '@/components/Navbar'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Image from 'next/image'
import EventFilters from '@/components/EventFilters'
import { Suspense } from 'react'

async function getEvents(categoria?: string) {
  const where = categoria && categoria !== 'all' 
    ? { publicado: true, categoria } 
    : { publicado: true }
  
  return await prisma.evento.findMany({
    where,
    orderBy: { fecha: 'asc' },
  })
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { categoria?: string }
}) {
  const eventos = await getEvents(searchParams.categoria)

  const categorias = [
    'Clan/Gremios',
    'Actividad Mensual',
    'Fiesta',
    'Torneo',
    'Evento Especial',
  ]

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-display font-bold text-sakura mb-4">
            Eventos de la Comunidad
          </h1>
          <p className="text-gray-400 text-lg">
            Descubre los próximos eventos y actividades
          </p>
        </div>

        <Suspense fallback={<div className="text-center text-gray-400">Cargando filtros...</div>}>
          <EventFilters categorias={categorias} categoriaActual={searchParams.categoria} />
        </Suspense>

        {eventos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">
              No hay eventos disponibles en este momento.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {eventos.map((evento) => (
              <div
                key={evento.id}
                className="bg-mystic-dark/60 backdrop-blur-sm border border-sakura/20 rounded-2xl overflow-hidden hover:border-sakura/40 transition-all duration-300 hover:shadow-sakura group"
              >
                {evento.imagen ? (
                  <div className="relative h-48 w-full overflow-hidden bg-mystic-black">
                    <Image
                      src={evento.imagen}
                      alt={evento.titulo}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      unoptimized={!evento.imagen.includes('cloudinary.com')}
                    />
                  </div>
                ) : (
                  <div className="h-48 w-full bg-mystic-black/50 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Sin imagen</span>
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-sakura/20 text-sakura text-xs font-semibold rounded-full border border-sakura/30">
                      {evento.categoria}
                    </span>
                    <span className="text-sakura text-sm font-medium">
                      {format(new Date(evento.fecha), "d 'de' MMMM", { locale: es })}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-display font-semibold text-white mb-2">
                    {evento.titulo}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {evento.descripcion}
                  </p>
                  
                  {evento.lugar && (
                    <p className="text-gray-500 text-xs mb-2">
                      📍 {evento.lugar}
                    </p>
                  )}
                  
                  {evento.hora && (
                    <p className="text-gray-500 text-xs">
                      🕐 {evento.hora}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

