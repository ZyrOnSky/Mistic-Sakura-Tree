import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/safe-admin/login',
  },
  callbacks: {
    authorized: ({ token, req }) => {
      // Permitir acceso a la ruta de login sin autenticación
      if (req.nextUrl.pathname === '/safe-admin/login') {
        return true
      }
      return !!token
    },
  },
})

export const config = {
  matcher: ['/safe-admin/:path*'],
}

