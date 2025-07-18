<template>
  <div class="oauth-container">
    <h3>🌐 OAuth Authentication</h3>
    <p class="subtitle">Inicia sesión con tus cuentas favoritas</p>
    
    <div class="oauth-buttons">
      <button 
        @click="signInWithProvider('google')" 
        :disabled="loading"
        class="oauth-button google"
      >
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continuar con Google
      </button>
      
      <button 
        @click="signInWithProvider('github')" 
        :disabled="loading"
        class="oauth-button github"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        Continuar con GitHub
      </button>
      
      <button 
        @click="signInWithProvider('apple')" 
        :disabled="loading"
        class="oauth-button apple"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
        </svg>
        Continuar con Apple
      </button>
    </div>
    
    <div v-if="error" class="message error">
      {{ error }}
    </div>
    
    <div class="oauth-info">
      <h4>¿Cómo funciona OAuth?</h4>
      <ol>
        <li>Haces clic en el proveedor</li>
        <li>Te redirige a su página</li>
        <li>Autorizas el acceso</li>
        <li>Regresas autenticado</li>
      </ol>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { supabase } from './lib/supabaseClient'

export default {
  name: 'OAuthAuth',
  setup() {
    const loading = ref(false)
    const error = ref('')
    
    const signInWithProvider = async (provider) => {
      loading.value = true
      error.value = ''
      
      try {
        const { error: signInError } = await supabase.auth.signInWithOAuth({
          provider: provider,
          options: {
            redirectTo: window.location.origin
          }
        })
        
        if (signInError) throw signInError
      } catch (err) {
        error.value = `Error con ${provider}: ${err.message}`
      } finally {
        loading.value = false
      }
    }
    
    return {
      loading,
      error,
      signInWithProvider
    }
  }
}
</script>

<style scoped>
.oauth-container {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h3 {
  margin: 0 0 8px 0;
  text-align: center;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 24px;
}

.oauth-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.oauth-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 24px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.oauth-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.oauth-button.google:hover {
  border-color: #4285F4;
  color: #4285F4;
}

.oauth-button.github:hover {
  border-color: #333;
  color: #333;
}

.oauth-button.apple:hover {
  border-color: #000;
  color: #000;
}

.oauth-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.message.error {
  background: #ffebee;
  color: #c62828;
  padding: 12px;
  border-radius: 8px;
  margin-top: 16px;
}

.oauth-info {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-top: 24px;
}

.oauth-info h4 {
  margin: 0 0 12px 0;
  color: #333;
}

.oauth-info ol {
  margin: 0;
  padding-left: 20px;
  color: #666;
}

.oauth-info li {
  margin-bottom: 4px;
}
</style>