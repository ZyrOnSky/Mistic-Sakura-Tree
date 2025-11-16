# 🔐 Guía para Configurar Variables de Entorno

Esta guía te ayudará a obtener todas las credenciales necesarias para configurar el archivo `.env`.

## 📋 Variables Requeridas

### 1. DATABASE_URL (PostgreSQL - Supabase)

**Pasos para obtenerla:**

1. Ve a [https://supabase.com](https://supabase.com) e inicia sesión
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a **Settings** (⚙️) en el menú lateral
4. Selecciona **Database** en el submenú
5. Busca la sección **Connection string**
6. Selecciona la pestaña **URI**
7. Copia la cadena de conexión
8. Reemplaza `[YOUR-PASSWORD]` con la contraseña de tu base de datos

**Ejemplo:**
```
postgresql://postgres:MiPassword123@db.abcdefghijklmnop.supabase.co:5432/postgres
```

**⚠️ Importante:** 
- Si no recuerdas la contraseña, puedes resetearla en Settings > Database > Reset database password
- La contraseña solo se muestra una vez al crear el proyecto

---

### 2. NEXTAUTH_URL

**Para desarrollo:**
```
NEXTAUTH_URL="http://localhost:3000"
```

**Para producción (Netlify):**
```
NEXTAUTH_URL="https://tu-dominio.netlify.app"
```

---

### 3. NEXTAUTH_SECRET

**Genera un secret seguro usando uno de estos métodos:**

**Opción 1: Usando Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Opción 2: Usando OpenSSL (si lo tienes instalado)**
```bash
openssl rand -base64 32
```

**Opción 3: Usando PowerShell (Windows)**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

Copia el resultado y pégalo en `NEXTAUTH_SECRET`.

---

### 4. Cloudinary (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)

**Pasos para obtenerlas:**

1. Ve a [https://cloudinary.com](https://cloudinary.com)
2. Crea una cuenta gratuita (si no tienes una)
3. Inicia sesión y ve al **Dashboard**
4. En la parte superior verás un panel con tu información:
   - **Cloud name**: Aparece en el dashboard principal
   - **API Key**: Haz clic en "Show" para revelarla
   - **API Secret**: Haz clic en "Show" para revelarla

**Ejemplo de cómo se vería:**
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dabc123xyz"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="abcdefghijklmnopqrstuvwxyz123456"
```

**⚠️ Importante:**
- Mantén estas credenciales seguras
- No las compartas públicamente
- El plan gratuito de Cloudinary es suficiente para empezar

---

## ✅ Verificación

Después de configurar todas las variables, verifica que:

1. ✅ El archivo `.env` está en la raíz del proyecto
2. ✅ Todas las variables tienen valores (no están vacías)
3. ✅ No hay espacios alrededor del signo `=`
4. ✅ Las URLs están entre comillas dobles
5. ✅ No hay caracteres especiales sin escapar

**Ejemplo de formato correcto:**
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
```

**Ejemplo de formato incorrecto:**
```env
DATABASE_URL = "postgresql://..."  ❌ (espacios alrededor del =)
DATABASE_URL=postgresql://...      ❌ (sin comillas, puede causar problemas)
```

---

## 🚀 Próximos Pasos

Una vez configurado el `.env`:

1. **Genera el cliente de Prisma:**
   ```bash
   npm run db:generate
   ```

2. **Aplica el esquema a la base de datos:**
   ```bash
   npm run db:push
   ```

3. **Crea el usuario administrador:**
   ```bash
   npm run db:seed
   ```

4. **Inicia el servidor:**
   ```bash
   npm run dev
   ```

---

## 🆘 Solución de Problemas

### Error: "Invalid DATABASE_URL"
- Verifica que la URL esté entre comillas
- Asegúrate de que la contraseña no tenga caracteres especiales sin escapar
- Prueba la conexión desde Supabase Dashboard > Database > Connection pooling

### Error: "NEXTAUTH_SECRET is missing"
- Genera un nuevo secret usando los comandos arriba
- Asegúrate de que esté en el archivo `.env`

### Error: "Cloudinary upload failed"
- Verifica que las credenciales de Cloudinary sean correctas
- Asegúrate de que `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` tenga el prefijo `NEXT_PUBLIC_`

### El archivo .env no se está leyendo
- Asegúrate de que el archivo se llame exactamente `.env` (con el punto al inicio)
- Reinicia el servidor de desarrollo después de modificar `.env`
- Verifica que no haya un archivo `.env.local` que esté sobrescribiendo valores

---

## 📝 Notas Adicionales

- El archivo `.env` está en `.gitignore`, por lo que no se subirá al repositorio
- Para producción, configura estas variables en el panel de Netlify (Environment Variables)
- Nunca compartas tu archivo `.env` públicamente

