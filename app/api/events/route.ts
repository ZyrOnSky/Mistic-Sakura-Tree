import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const eventos = await prisma.evento.findMany({
    where: { publicado: true },
    orderBy: { fecha: 'asc' },
  })
  return NextResponse.json(eventos)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    console.log('📥 Recibiendo evento para crear:', { 
      titulo: body.titulo,
      imagen: body.imagen || 'Sin imagen',
      imagenLength: body.imagen?.length || 0
    })
    
    // Asegurar que imagen sea null si está vacío, o la URL si tiene valor
    const imagenValue = body.imagen && body.imagen.trim() !== '' ? body.imagen.trim() : null
    
    const evento = await prisma.evento.create({
      data: {
        ...body,
        imagen: imagenValue,
      },
    })
    
    console.log('✅ Evento creado en DB:', { 
      id: evento.id,
      titulo: evento.titulo,
      imagen: evento.imagen || 'Sin imagen',
      imagenLength: evento.imagen?.length || 0
    })
    return NextResponse.json(evento)
  } catch (error: any) {
    console.error('❌ Error al crear evento:', error)
    return NextResponse.json(
      { error: 'Error al crear el evento', details: error.message },
      { status: 500 }
    )
  }
}

