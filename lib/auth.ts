import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Credenciales faltantes')
          return null
        }

        try {
          const user = await prisma.usuario.findUnique({
            where: { email: credentials.email }
          })

          if (!user) {
            console.log(`❌ Usuario no encontrado: ${credentials.email}`)
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            console.log(`❌ Contraseña inválida para: ${credentials.email}`)
            return null
          }

          console.log(`✅ Login exitoso para: ${credentials.email}`)
          return {
            id: user.id,
            email: user.email,
            name: user.nombre || user.email,
          }
        } catch (error: any) {
          console.error('❌ Error en authorize:', error.message)
          if (error.code === 'P1001') {
            console.error('❌ Error de conexión a la base de datos')
          }
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/safe-admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

