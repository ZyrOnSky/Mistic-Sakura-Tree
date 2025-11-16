import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const evento = await prisma.evento.findUnique({
    where: { id: params.id },
  })
  
  if (!evento) {
    return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 })
  }
  
  return NextResponse.json(evento)
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    console.log('📥 Recibiendo evento para actualizar:', { 
      id: params.id,
      titulo: body.titulo,
      imagen: body.imagen || 'Sin imagen',
      imagenLength: body.imagen?.length || 0
    })
    
    // Asegurar que imagen sea null si está vacío, o la URL si tiene valor
    const imagenValue = body.imagen && body.imagen.trim() !== '' ? body.imagen.trim() : null
    
    const evento = await prisma.evento.update({
      where: { id: params.id },
      data: {
        ...body,
        imagen: imagenValue,
      },
    })
    
    console.log('✅ Evento actualizado en DB:', { 
      id: evento.id,
      titulo: evento.titulo,
      imagen: evento.imagen || 'Sin imagen',
      imagenLength: evento.imagen?.length || 0
    })
    return NextResponse.json(evento)
  } catch (error: any) {
    console.error('❌ Error al actualizar evento:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el evento', details: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    await prisma.evento.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al eliminar el evento' },
      { status: 500 }
    )
  }
}

