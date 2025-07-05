# 🚀 Configuración de Supabase - Paso a Paso

## 1. Crear Nuevo Proyecto

Haz clic en **"Nuevo proyecto"** y completa:

- **Nombre**: `autenticacion-demo` (o el que prefieras)
- **Database Password**: Genera una fuerte (guárdala!)
- **Region**: `East US (North Virginia)` (o la más cercana)
- **Plan**: Free tier está perfecto

Clic en **"Create new project"** y espera ~2 minutos.

## 2. Obtener Credenciales

Una vez creado, ve a:
1. **Settings** (icono de engranaje)
2. **API**
3. Copia estos dos valores:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon public key**: `eyJhbGc...` (es largo)

## 3. Configurar Autenticación

### Email (Magic Link)
1. Ve a **Authentication** → **Providers**
2. **Email** debe estar habilitado por defecto ✅
3. Ve a **Authentication** → **Email Templates**
4. Personaliza el template de "Magic Link" si quieres

### OAuth (Google)
1. **Authentication** → **Providers** → **Google**
2. Necesitas crear una app en [Google Cloud Console](https://console.cloud.google.com)
3. Copia el **Callback URL** de Supabase
4. En Google:
   - Crear credenciales OAuth 2.0
   - Agregar el Callback URL
   - Copiar Client ID y Secret
5. Pegar en Supabase y Enable

### OAuth (GitHub)
1. **Authentication** → **Providers** → **GitHub**  
2. Ve a GitHub → Settings → Developer settings → OAuth Apps
3. New OAuth App:
   - **Application name**: Tu app
   - **Homepage URL**: `http://localhost:8000`
   - **Callback URL**: (copiarlo de Supabase)
4. Copiar Client ID y Secret a Supabase

## 4. Configurar URLs

En **Authentication** → **URL Configuration**:

- **Site URL**: `http://localhost:8000`
- **Redirect URLs**: 
  ```
  http://localhost:8000
  http://localhost:3000
  http://127.0.0.1:8000
  ```

## 5. Actualizar tu código

Edita `index.html` y reemplaza:

```javascript
// Líneas 15-16
const SUPABASE_URL = 'https://tuproyecto.supabase.co'  // Tu URL
const SUPABASE_ANON_KEY = 'eyJhbGc...'  // Tu anon key
```

## 6. Probar

1. Abre un servidor local:
   ```bash
   python -m http.server 8000
   ```

2. Ve a `http://localhost:8000`

3. Prueba Magic Link:
   - Ingresa tu email real
   - Revisa tu correo
   - ¡Clic en el link!

## 🎯 Para tu Demo

### Mostrar en Supabase Dashboard:
1. **Authentication** → Users (mostrar usuarios creados)
2. **Authentication** → Logs (mostrar intentos de login)
3. **SQL Editor** → Mostrar la tabla `auth.users`

### Queries útiles para la demo:
```sql
-- Ver todos los usuarios
SELECT * FROM auth.users;

-- Ver sesiones activas
SELECT * FROM auth.sessions WHERE expires_at > now();

-- Ver métodos de autenticación usados
SELECT 
  email,
  raw_app_meta_data->>'provider' as provider,
  created_at
FROM auth.users
ORDER BY created_at DESC;
```

## ⚡ Tips para la presentación

1. **Ten 2 navegadores abiertos**:
   - Uno con tu app
   - Otro con Supabase Dashboard

2. **Prepara emails de prueba**:
   - USA: `tunombre+demo1@gmail.com`
   - USA: `tunombre+demo2@gmail.com`
   - (Gmail ignora todo después del +)

3. **Si algo falla**, di:
   "Esto demuestra la importancia de configurar bien los servicios cloud"

4. **Muestra el JWT**:
   - Abre DevTools → Application → Local Storage
   - Busca `supabase.auth.token`
   - Copia a [jwt.io](https://jwt.io) para decodificar

## 🚨 Problemas comunes

**"Invalid API key"**
→ Verifica que copiaste bien la anon key

**"Email not allowed"**
→ Authentication → Settings → desactiva "Confirm email"

**OAuth no funciona**
→ Verifica las Redirect URLs en ambos lados