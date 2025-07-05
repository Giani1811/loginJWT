# Autenticación Sin Servidores con Supabase

Demo de 3 métodos de autenticación modernos sin contraseñas tradicionales.

## 🚀 Configuración Rápida

### 1. Configurar Supabase

1. Crea una cuenta en [Supabase](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a Settings → API
4. Copia tu URL y anon key

### 2. Configurar el proyecto

```bash
# Clonar y configurar
git clone [tu-repo]
cd proyectoGianina

# Crear archivo .env
cp .env.example .env
# Edita .env con tus credenciales de Supabase
```

### 3. Ejecutar

Opción 1: Abrir `index.html` directamente en el navegador (modo demo)

Opción 2: Usar un servidor local:
```bash
# Con Python
python -m http.server 8000

# Con Node.js
npx serve

# Con PHP
php -S localhost:8000
```

## 📱 Métodos de Autenticación

### 1. Magic Link
- Usuario ingresa email
- Recibe link único por correo
- Click = autenticado

### 2. OAuth
- Google
- GitHub  
- Apple
- Sin compartir contraseñas

### 3. Biometría (WebAuthn)
- Touch ID / Face ID
- Windows Hello
- Llaves de seguridad USB

## 🔧 Configuración en Supabase

### Magic Link
1. Authentication → Settings → Email Auth → Enable
2. Personaliza el template del email

### OAuth
1. Authentication → Providers
2. Habilita Google/GitHub/Apple
3. Configura client ID y secret

### URLs de Redirección
Agrega en Authentication → URL Configuration:
- `http://localhost:8000`
- `https://tudominio.com`

## 📝 Estructura del Código

```
/
├── index.html          # Página principal con demo
├── App.vue            # Componente principal Vue
├── MagicLinkAuth.vue  # Componente Magic Link
├── OAuthAuth.vue      # Componente OAuth
├── BiometricAuth.vue  # Componente Biometría
└── lib/
    └── supabaseClient.js  # Cliente Supabase
```

## 🎯 Para tu Presentación

1. **Muestra el flujo completo** de cada método
2. **Abre las DevTools** para mostrar:
   - JWT tokens
   - Llamadas a la API
   - Local Storage
3. **Explica la seguridad**:
   - Sin contraseñas que hackear
   - Tokens con expiración
   - Autenticación multi-factor gratis

## 💡 Tips

- En modo demo (sin Supabase) todo es simulado
- Con Supabase real, los emails llegarán de verdad
- La biometría requiere HTTPS en producción
- OAuth requiere configurar apps en cada proveedor

## 🚨 Troubleshooting

**"Missing Supabase environment variables"**
→ Configura el .env con tus credenciales

**"WebAuthn no disponible"**  
→ Usa Chrome/Edge/Safari modernos

**No llegan emails**
→ Revisa spam o configura SMTP en Supabase