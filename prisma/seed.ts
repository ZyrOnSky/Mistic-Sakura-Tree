import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@mst.com'
  const password = process.env.ADMIN_PASSWORD || 'admin123'
  
  const hashedPassword = await bcrypt.hash(password, 10)

  const admin = await prisma.usuario.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashedPassword,
      nombre: 'Administrador',
      role: 'admin',
    },
  })

  console.log('Usuario administrador creado:', admin.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

