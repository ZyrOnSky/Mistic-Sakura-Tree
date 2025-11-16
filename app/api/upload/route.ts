import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { v2 as cloudinary } from 'cloudinary'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  // Verificar que las variables de entorno estén configuradas
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    console.error('❌ Variables de entorno de Cloudinary no configuradas')
    console.error('  - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:', cloudName ? '✅' : '❌')
    console.error('  - CLOUDINARY_API_KEY:', apiKey ? '✅' : '❌')
    console.error('  - CLOUDINARY_API_SECRET:', apiSecret ? '✅' : '❌')
    return NextResponse.json(
      { error: 'Configuración de Cloudinary incompleta. Verifica las variables de entorno.' },
      { status: 500 }
    )
  }

  // Configurar Cloudinary
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  })

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 })
    }

    console.log('📤 Subiendo archivo:', {
      name: file.name,
      size: file.size,
      type: file.type
    })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'mst-events',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            console.error('❌ Error de Cloudinary:', error)
            reject(error)
          } else {
            console.log('✅ Imagen subida a Cloudinary:', result?.secure_url)
            resolve(result)
          }
        }
      )
      uploadStream.end(buffer)
    })

    const imageUrl = (result as any).secure_url
    if (!imageUrl) {
      throw new Error('No se recibió URL de la imagen desde Cloudinary')
    }

    console.log('📤 Retornando URL de imagen:', imageUrl)
    return NextResponse.json({ url: imageUrl })
  } catch (error: any) {
    console.error('❌ Error uploading to Cloudinary:', error)
    console.error('  - Mensaje:', error.message)
    console.error('  - Stack:', error.stack)
    
    return NextResponse.json(
      { 
        error: 'Error al subir la imagen',
        details: error.message || 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

