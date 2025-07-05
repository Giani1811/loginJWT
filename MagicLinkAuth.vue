<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>🔐 Magic Link Authentication</h2>
      <p class="subtitle">Sin contraseñas, solo magia</p>
      
      <div v-if="!user" class="login-form">
        <input
          v-model="email"
          type="email"
          placeholder="tu@email.com"
          class="email-input"
          @keypress.enter="handleMagicLink"
          :disabled="loading"
        />
        
        <button 
          @click="handleMagicLink" 
          :disabled="loading"
          class="auth-button primary"
        >
          {{ loading ? 'Enviando...' : 'Enviar Magic Link' }}
        </button>
        
        <div v-if="message" class="message success">
          {{ message }}
        </div>
        
        <div v-if="error" class="message error">
          {{ error }}
        </div>
      </div>
      
      <div v-else class="user-info">
        <h3>¡Bienvenido! 🎉</h3>
        <p>{{ user.email }}</p>
        <pre class="jwt-display">{{ sessionInfo }}</pre>
        <button @click="signOut" class="auth-button secondary">
          Cerrar Sesión
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { supabase } from './lib/supabaseClient'

export default {
  name: 'MagicLinkAuth',
  setup() {
    const email = ref('')
    const loading = ref(false)
    const message = ref('')
    const error = ref('')
    const user = ref(null)
    const session = ref(null)
    
    const sessionInfo = computed(() => {
      if (!session.value) return ''
      return JSON.stringify({
        user_id: session.value.user.id,
        email: session.value.user.email,
        expires_at: new Date(session.value.expires_at * 1000).toLocaleString()
      }, null, 2)
    })
    
    const handleMagicLink = async () => {
      loading.value = true
      error.value = ''
      message.value = ''
      
      try {
        const { error: signInError } = await supabase.auth.signInWithOtp({
          email: email.value,
          options: {
            emailRedirectTo: window.location.origin
          }
        })
        
        if (signInError) throw signInError
        
        message.value = '✉️ ¡Revisa tu email! Te enviamos un link mágico'
        email.value = ''
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }
    
    const signOut = async () => {
      await supabase.auth.signOut()
      user.value = null
      session.value = null
    }
    
    onMounted(() => {
      // Verificar sesión actual
      supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
        session.value = currentSession
        user.value = currentSession?.user || null
      })
      
      // Escuchar cambios de autenticación
      const { data: authListener } = supabase.auth.onAuthStateChange((event, currentSession) => {
        session.value = currentSession
        user.value = currentSession?.user || null
      })
      
      return () => {
        authListener.subscription.unsubscribe()
      }
    })
    
    return {
      email,
      loading,
      message,
      error,
      user,
      sessionInfo,
      handleMagicLink,
      signOut
    }
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  padding: 20px;
}

.auth-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  margin: 0 0 8px 0;
  text-align: center;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.email-input {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.email-input:focus {
  outline: none;
  border-color: #4CAF50;
}

.auth-button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.auth-button.primary {
  background: #4CAF50;
  color: white;
}

.auth-button.primary:hover:not(:disabled) {
  background: #45a049;
}

.auth-button.secondary {
  background: #f44336;
  color: white;
}

.auth-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.message {
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
}

.message.success {
  background: #e8f5e9;
  color: #2e7d32;
}

.message.error {
  background: #ffebee;
  color: #c62828;
}

.user-info {
  text-align: center;
}

.jwt-display {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  margin: 20px 0;
  text-align: left;
  font-size: 12px;
  overflow-x: auto;
}
</style>