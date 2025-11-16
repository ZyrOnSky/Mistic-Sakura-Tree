'use client'

import { useState, useEffect } from 'react'

interface Evento {
  id?: string
  titulo: string
  descripcion: string
  fecha: string
  hora?: string
  lugar?: string
  imagen?: string
  categoria: string
  publicado: boolean
}

interface EventFormProps {
  evento?: Evento | null
  onSuccess: () => void
  onCancel: () => void
}

const categorias = [
  'Clan/Gremios',
  'Actividad Mensual',
  'Fiesta',
  'Torneo',
  'Evento Especial',
]

export default function EventForm({ evento, onSuccess, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState<Omit<Evento, 'id'>>({
    titulo: '',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
    hora: '',
    lugar: '',
    imagen: '',
    categoria: categorias[0],
    publicado: false,
  })
  const [imageUrl, setImageUrl] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (evento) {
      const imagenUrl = evento.imagen || ''
      setFormData({
        titulo: evento.titulo,
        descripcion: evento.descripcion,
        fecha: evento.fecha.split('T')[0],
        hora: evento.hora || '',
        lugar: evento.lugar || '',
        imagen: imagenUrl,
        categoria: evento.categoria,
        publicado: evento.publicado,
      })
      setImageUrl(imagenUrl)
    } else {
      setImageUrl('')
    }
  }, [evento])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Error al subir la imagen')
      }

      const data = await res.json()
      if (data.url) {
        console.log('✅ Imagen subida exitosamente:', data.url)
        // Actualizar ambos estados para asegurar que se mantenga
        setImageUrl(data.url)
        setFormData((prev) => {
          const updated = { ...prev, imagen: data.url }
          console.log('🔄 Estado formData actualizado con imagen:', updated.imagen)
          return updated
        })
      } else {
        throw new Error('No se recibió la URL de la imagen')
      }
    } catch (error: any) {
      console.error('❌ Error al subir imagen:', error)
      setError(error.message || 'Error al subir la imagen')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const url = evento?.id ? `/api/events/${evento.id}` : '/api/events'
      const method = evento?.id ? 'PUT' : 'POST'

      const fechaCompleta = new Date(`${formData.fecha}T${formData.hora || '12:00'}`)

      // Asegurar que la imagen se incluya (usar imageUrl si formData.imagen está vacío)
      const imagenFinal = formData.imagen || imageUrl

      const payload = {
        ...formData,
        imagen: imagenFinal,
        fecha: fechaCompleta.toISOString(),
      }

      console.log('📤 Estado actual del formulario:')
      console.log('  - formData.imagen:', formData.imagen)
      console.log('  - imageUrl:', imageUrl)
      console.log('  - imagenFinal (enviada):', imagenFinal)
      console.log('📤 Enviando evento completo:', { ...payload, imagen: payload.imagen ? `URL: ${payload.imagen.substring(0, 50)}...` : 'Sin imagen' })

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Error al guardar el evento')
      }

      const savedEvent = await res.json()
      console.log('✅ Evento guardado:', savedEvent)
      
      onSuccess()
    } catch (error: any) {
      console.error('❌ Error al guardar evento:', error)
      setError(error.message || 'Error al guardar el evento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-mystic-dark/80 backdrop-blur-sm border border-sakura/20 rounded-2xl p-8">
      <h2 className="text-2xl font-display font-bold text-sakura mb-6">
        {evento ? 'Editar Evento' : 'Nuevo Evento'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Título *
          </label>
          <input
            type="text"
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            required
            className="w-full px-4 py-3 bg-mystic-black/50 border border-sakura/30 rounded-lg focus:outline-none focus:border-sakura focus:ring-2 focus:ring-sakura/20 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Descripción *
          </label>
          <textarea
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            required
            rows={4}
            className="w-full px-4 py-3 bg-mystic-black/50 border border-sakura/30 rounded-lg focus:outline-none focus:border-sakura focus:ring-2 focus:ring-sakura/20 text-white resize-none"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Fecha *
            </label>
            <input
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              required
              className="w-full px-4 py-3 bg-mystic-black/50 border border-sakura/30 rounded-lg focus:outline-none focus:border-sakura focus:ring-2 focus:ring-sakura/20 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Hora
            </label>
            <input
              type="time"
              value={formData.hora}
              onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
              className="w-full px-4 py-3 bg-mystic-black/50 border border-sakura/30 rounded-lg focus:outline-none focus:border-sakura focus:ring-2 focus:ring-sakura/20 text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Lugar
          </label>
          <input
            type="text"
            value={formData.lugar}
            onChange={(e) => setFormData({ ...formData, lugar: e.target.value })}
            className="w-full px-4 py-3 bg-mystic-black/50 border border-sakura/30 rounded-lg focus:outline-none focus:border-sakura focus:ring-2 focus:ring-sakura/20 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Categoría *
          </label>
          <select
            value={formData.categoria}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
            required
            className="w-full px-4 py-3 bg-mystic-black/50 border border-sakura/30 rounded-lg focus:outline-none focus:border-sakura focus:ring-2 focus:ring-sakura/20 text-white"
          >
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Imagen
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="w-full px-4 py-3 bg-mystic-black/50 border border-sakura/30 rounded-lg focus:outline-none focus:border-sakura focus:ring-2 focus:ring-sakura/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sakura file:text-mystic-black hover:file:bg-sakura-dark"
          />
          {uploading && (
            <p className="text-sakura text-sm mt-2">Subiendo imagen...</p>
          )}
          {(formData.imagen || imageUrl) && (
            <div className="mt-4">
              <img
                src={formData.imagen || imageUrl}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border border-sakura/30"
                onError={(e) => {
                  console.error('❌ Error al mostrar preview de imagen:', formData.imagen || imageUrl)
                }}
              />
              <p className="text-xs text-gray-400 mt-2 truncate">
                URL: {formData.imagen || imageUrl}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="publicado"
            checked={formData.publicado}
            onChange={(e) => setFormData({ ...formData, publicado: e.target.checked })}
            className="w-4 h-4 text-sakura bg-mystic-black border-sakura/30 rounded focus:ring-sakura focus:ring-2"
          />
          <label htmlFor="publicado" className="ml-2 text-sm text-gray-300">
            Publicar evento
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-sakura hover:bg-sakura-dark text-mystic-black font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-sakura-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : evento ? 'Actualizar' : 'Crear Evento'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-mystic-dark/60 hover:bg-mystic-dark text-gray-300 border border-sakura/30 py-3 px-6 rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

