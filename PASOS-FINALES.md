# 🔑 Pasos Finales - Configuración

## 1. Obtener tu Anon Key

En Supabase Dashboard:
1. **Settings** → **API**
2. Busca **Project API keys**
3. Copia el valor de **anon public** (empieza con `eyJ...`)

## 2. Actualizar el código

En `index.html`, línea 16, reemplaza:
```javascript
const SUPABASE_ANON_KEY = 'tu-anon-key-aqui' // PEGA TU KEY AQUÍ
```

## 3. Configurar URLs permitidas

En Supabase:
1. **Authentication** → **URL Configuration**
2. **Site URL**: `http://localhost:8000`
3. **Redirect URLs** agregar:
   ```
   http://localhost:8000
   http://localhost:3000
   http://127.0.0.1:8000
   ```
4. Click en **Save**

## 4. Habilitar proveedores

**Para Magic Link** (ya está habilitado por defecto):
- **Authentication** → **Providers** → **Email** debe estar en ON

**Para OAuth Google** (opcional):
1. **Authentication** → **Providers** → **Google**
2. Si quieres habilitarlo, necesitarás crear credenciales en Google Cloud Console
3. Por ahora, puedes dejarlo deshabilitado para la demo

## 5. Deshabilitar confirmación de email (para demo rápida)

1. **Authentication** → **Providers** → **Email**
2. **Desactiva** "Confirm email" 
3. Esto permite login inmediato sin confirmar el email

## 6. Probar tu aplicación

```bash
# Abrir servidor local
python -m http.server 8000

# O con Node.js
npx http-server -p 8000

# O simplemente abre index.html en el navegador
```

## 7. Test rápido

1. Abre `http://localhost:8000`
2. Ingresa tu email
3. Click en "Enviar Magic Link"
4. Revisa tu correo (puede tardar 1-2 minutos)
5. Click en el link del email
6. ¡Deberías estar autenticado!

## 📊 Durante tu presentación

Muestra estos dashboards de Supabase:
- **Authentication → Users**: Usuarios registrados
- **Authentication → Logs**: Intentos de login
- **Authentication → Providers**: Métodos habilitados

## 🎯 Datos de tu proyecto

- **Project URL**: `https://kdxgwqszxdaexnrcyhvz.supabase.co`
- **Anon Key**: (debes copiarlo del dashboard)
- **Database Password**: `Wp1234567890,.-`

¡Ya casi está listo! Solo necesitas copiar el anon key y pegarlo en el código.