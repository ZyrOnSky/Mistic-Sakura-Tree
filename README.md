# Mistic Sakura Tree Portal

Este repositorio contiene una aplicación Next.js (carpeta `app/`) lista para desplegar en GitHub y Netlify.

Guía rápida de despliegue

- **Requisitos (local)**:
  - Node.js 18+ (recomendado)
  - npm o pnpm/yarn
  - Cuenta en GitHub y Netlify

- **Variables de entorno**: copia `env.template` a `.env.local` y rellena las variables (`DATABASE_URL`, `NEXTAUTH_SECRET`, `CLOUDINARY_*`, etc.). No subas `.env.local` al repositorio.

Probar localmente

```powershell
# instalar dependencias
npm install

# ejecutar en modo desarrollo
npm run dev

# probar build de producción
npm run build
# ejecutar servidor de producción (después de build)
npm start
```

Subir a GitHub (comandos PowerShell)

```powershell
git init
git add .
git commit -m "Initial commit"
git branch -M main
# reemplaza USERNAME y REPO por tu usuario y nombre de repo en GitHub
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

Notas para Netlify

- Netlify soporta Next.js mediante el plugin oficial `@netlify/plugin-nextjs`.
- Añade el plugin como dependencia de desarrollo antes de desplegar si quieres usar la integración local:

```powershell
npm install -D @netlify/plugin-nextjs
```

- El fichero `netlify.toml` ya incluido configura el comando de build y el plugin.
- Dos modos para desplegar en Netlify:

1) Conectar el repositorio en la web de Netlify

  - En Netlify -> New site -> Import from Git -> conecta tu cuenta de GitHub -> elige el repo.
  - Build command: `npm run build`
  - Publish directory: `.next`
  - Añade las variables de entorno necesarias en Site settings -> Build & deploy -> Environment.

2) Usando `netlify-cli` (útil para despliegues manuales y CI)

```powershell
npm install -g netlify-cli
netlify login
netlify init        # vincula el sitio a un proyecto Netlify
# Para hacer deploy de producción
netlify deploy --prod --dir=.next
```

CI / Integración (opcional)

- Si usas GitHub Actions o Netlify CI, configura las variables de entorno (`DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `CLOUDINARY_URL`, etc.) en los secretos del repo/Netlify.
- Para despliegues automáticos desde GitHub, solo conecta el repo en Netlify y activa deploys automáticos.

Problemas comunes

- Si la build falla, ejecuta `npm run build` localmente para ver el error.
- Asegúrate de que `prisma` tenga acceso a la base de datos (variable `DATABASE_URL`) si usas migraciones en build.

Si quieres, puedo:

- Inicializar git aquí y crear commits locales.
- Preparar un `package.json` script adicional para Netlify si lo deseas.
- Generar workflows de GitHub Actions para build y deploy.

Indícame qué acción quieres que ejecute ahora.
# Portal de Eventos - Ꮇistic Ꭶakura Ꭲree (MST)

Portal web inmersivo y temático para la comunidad de Roleplay MST. Funciona como un centro de información y registro de eventos, con una sección de administración (CRUD) segura para la Community Manager.

## 🚀 Stack Tecnológico

- **Frontend/Serverless:** Next.js 14 (React) con App Router
- **Estilización:** Tailwind CSS
- **Base de Datos:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Almacenamiento de Imágenes:** Cloudinary
- **Autenticación:** NextAuth.js
- **Hosting:** Netlify (Frontend)

## 🎨 Estética

- **Paleta de Colores:**
  - Fondo: Negro Profundo (#0a0a0a)
  - Acento: Rosado Sakura (#FFC0CB)
  - Contraste: Rojo y Blanco
- **Diseño:** Dark Mode obligatorio con estilo místico y japonés
- **Fuentes:** Inter (cuerpo) y Noto Sans JP (títulos)

## 📋 Requisitos Previos

- Node.js 18+ 
- PostgreSQL (Supabase recomendado)
- Cuenta de Cloudinary

## 🔧 Instalación

1. **Clonar el repositorio:**
```bash
git clone <repository-url>
cd "WEB COMUNIDAD"
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-key-aqui"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="tu-cloud-name"
CLOUDINARY_API_KEY="tu-api-key"
CLOUDINARY_API_SECRET="tu-api-secret"
```

4. **Configurar la base de datos:**
```bash
# Generar el cliente de Prisma
npm run db:generate

# Aplicar el esquema a la base de datos
npm run db:push

# O crear una migración
npm run db:migrate
```

5. **Crear un usuario administrador:**
Puedes crear un usuario administrador usando el script de seed:

```bash
# Opción 1: Usar variables de entorno
ADMIN_EMAIL=admin@mst.com ADMIN_PASSWORD=tu-password npm run db:seed

# Opción 2: Usar valores por defecto (admin@mst.com / admin123)
npm run db:seed
```

O crear un usuario directamente en la base de datos usando Prisma Studio:

```bash
npm run db:studio
```

Ejemplo de inserción SQL:
```sql
INSERT INTO "Usuario" (id, email, password, nombre, role, "createdAt", "updatedAt")
VALUES (
  'clx...',
  'admin@mst.com',
  '$2a$10$...', -- Hash bcrypt de tu contraseña
  'Admin',
  'admin',
  NOW(),
  NOW()
);
```

Para generar el hash de la contraseña, puedes usar:
```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('tu-password', 10))"
```

6. **Ejecutar el servidor de desarrollo:**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/    # NextAuth endpoints
│   │   ├── events/                 # API de eventos
│   │   └── upload/                 # API de subida de imágenes
│   ├── events/                     # Página pública de eventos
│   ├── safe-admin/
│   │   ├── login/                  # Página de login
│   │   └── events/                 # Panel de administración
│   ├── globals.css                 # Estilos globales
│   ├── layout.tsx                  # Layout principal
│   ├── page.tsx                    # Home page
│   └── providers.tsx               # Providers (NextAuth)
├── components/
│   ├── EventForm.tsx               # Formulario de eventos
│   ├── EventFilters.tsx            # Filtros de eventos
│   └── Navbar.tsx                  # Barra de navegación
├── lib/
│   ├── auth.ts                     # Configuración NextAuth
│   ├── cloudinary.ts               # Configuración Cloudinary
│   └── prisma.ts                   # Cliente Prisma
├── prisma/
│   └── schema.prisma               # Esquema de base de datos
└── middleware.ts                   # Middleware de autenticación
```

## 🎯 Funcionalidades

### Públicas
- **Home Page (`/`):** Hero section y sección de beneficios
- **Eventos (`/events`):** Listado de eventos públicos con filtros por categoría

### Administración (Protegidas)
- **Login (`/safe-admin/login`):** Autenticación segura
- **CRUD de Eventos (`/safe-admin/events`):** 
  - Crear eventos
  - Editar eventos
  - Eliminar eventos
  - Subir imágenes a Cloudinary
  - Publicar/Borrador

## 🗄️ Modelo de Datos

### Usuario
- `id`: String (CUID)
- `email`: String (único)
- `password`: String (hash bcrypt)
- `nombre`: String (opcional)
- `role`: String (default: "admin")

### Evento
- `id`: String (CUID)
- `titulo`: String
- `descripcion`: Text
- `fecha`: DateTime
- `hora`: String (opcional)
- `lugar`: String (opcional)
- `imagen`: String (URL de Cloudinary, opcional)
- `categoria`: String (Clan/Gremios, Actividad Mensual, Fiesta, etc.)
- `publicado`: Boolean (default: false)
- `createdAt`: DateTime
- `updatedAt`: DateTime

## 🚢 Despliegue

### Netlify

1. Conecta tu repositorio a Netlify
2. Configura las variables de entorno en Netlify
3. Build command: `npm run build`
4. Publish directory: `.next`

### Variables de Entorno en Producción

Asegúrate de configurar:
- `DATABASE_URL`
- `NEXTAUTH_URL` (URL de producción)
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## 📝 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run start` - Servidor de producción
- `npm run lint` - Linter
- `npm run db:generate` - Generar cliente Prisma
- `npm run db:push` - Aplicar esquema a DB
- `npm run db:migrate` - Crear migración
- `npm run db:studio` - Abrir Prisma Studio
- `npm run db:seed` - Crear usuario administrador inicial

## 🎨 Personalización

Los colores y estilos están definidos en:
- `tailwind.config.ts` - Configuración de Tailwind
- `app/globals.css` - Estilos globales y fuentes

## 📄 Licencia

Este proyecto es privado y está destinado exclusivamente para la comunidad MST.

