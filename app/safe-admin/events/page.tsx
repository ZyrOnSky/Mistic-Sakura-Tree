'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import EventForm from '@/components/EventForm'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Image from 'next/image'

interface Evento {
  id: string
  titulo: string
  descripcion: string
  fecha: string
  hora?: string
  lugar?: string
  imagen?: string
  categoria: string
  publicado: boolean
}

export default function AdminEventsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [editingEvent, setEditingEvent] = useState<Evento | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/safe-admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchEvents()
    }
  }, [session])

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/admin/events')
      if (!res.ok) {
        throw new Error('Error al obtener eventos')
      }
      const data = await res.json()
      setEventos(data)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este evento?')) return

    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setEventos(eventos.filter((e) => e.id !== id))
      }
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  const handleEdit = (evento: Evento) => {
    setEditingEvent(evento)
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    fetchEvents()
    setShowForm(false)
    setEditingEvent(null)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sakura text-xl">Cargando...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-display font-bold text-sakura">
            Administración de Eventos
          </h1>
          <button
            onClick={() => {
              setEditingEvent(null)
              setShowForm(true)
            }}
            className="bg-sakura hover:bg-sakura-dark text-mystic-black font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-sakura-glow"
          >
            + Nuevo Evento
          </button>
        </div>

        {showForm && (
          <div className="mb-8">
            <EventForm
              evento={editingEvent}
              onSuccess={handleFormSuccess}
              onCancel={() => {
                setShowForm(false)
                setEditingEvent(null)
              }}
            />
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventos.map((evento) => (
            <div
              key={evento.id}
              className="bg-mystic-dark/60 backdrop-blur-sm border border-sakura/20 rounded-2xl overflow-hidden"
            >
              {evento.imagen ? (
                <div className="relative h-48 w-full overflow-hidden bg-mystic-black">
                  <Image
                    src={evento.imagen}
                    alt={evento.titulo}
                    fill
                    className="object-cover"
                    unoptimized={!evento.imagen.includes('cloudinary.com')}
                    onError={(e) => {
                      console.error('❌ Error al cargar imagen:', evento.imagen)
                      e.currentTarget.style.display = 'none'
                    }}
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
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    evento.publicado 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {evento.publicado ? 'Publicado' : 'Borrador'}
                  </span>
                </div>
                
                <h3 className="text-xl font-display font-semibold text-white mb-2">
                  {evento.titulo}
                </h3>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {evento.descripcion}
                </p>
                
                <p className="text-sakura text-sm mb-4">
                  {format(new Date(evento.fecha), "d 'de' MMMM, yyyy", { locale: es })}
                </p>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(evento)}
                    className="flex-1 bg-sakura/20 hover:bg-sakura/30 text-sakura border border-sakura/30 py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(evento.id)}
                    className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {eventos.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">
              No hay eventos. Crea tu primer evento.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

