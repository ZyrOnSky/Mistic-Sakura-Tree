import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@mst.com'
  const password = process.env.ADMIN_PASSWORD || 'admin123'
  
  console.log('🔐 Creando usuario administrador...')
  console.log(`📧 Email: ${email}`)
  console.log(`🔑 Password: ${password}`)
  
  try {
    // Verificar si el usuario ya existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('⚠️  El usuario ya existe. Actualizando contraseña...')
      
      const hashedPassword = await bcrypt.hash(password, 10)
      const updated = await prisma.usuario.update({
        where: { email },
        data: { password: hashedPassword }
      })
      
      console.log('✅ Contraseña actualizada correctamente')
      console.log(`👤 Usuario: ${updated.email}`)
    } else {
      const hashedPassword = await bcrypt.hash(password, 10)
      
      const admin = await prisma.usuario.create({
        data: {
          email,
          password: hashedPassword,
          nombre: 'Administrador',
          role: 'admin',
        },
      })

      console.log('✅ Usuario administrador creado exitosamente')
      console.log(`👤 Email: ${admin.email}`)
      console.log(`🆔 ID: ${admin.id}`)
    }
    
    // Verificar que se puede leer el usuario
    const verify = await prisma.usuario.findUnique({
      where: { email }
    })
    
    if (verify) {
      console.log('✅ Verificación: Usuario encontrado en la base de datos')
    }
    
  } catch (error: any) {
    console.error('❌ Error al crear usuario:', error.message)
    if (error.code === 'P1001') {
      console.error('❌ No se puede conectar a la base de datos. Verifica tu DATABASE_URL en el archivo .env')
    }
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

