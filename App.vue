<template>
  <div id="app">
    <div class="header">
      <h1>🔐 Autenticación Sin Servidores</h1>
      <p>Magic Link, OAuth y Biometría con Supabase</p>
    </div>
    
    <div v-if="user" class="user-session">
      <div class="session-card">
        <h2>Sesión Activa</h2>
        <div class="user-details">
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>ID:</strong> {{ user.id }}</p>
          <p><strong>Proveedor:</strong> {{ user.app_metadata?.provider || 'email' }}</p>
        </div>
        <button @click="signOut" class="signout-button">
          Cerrar Sesión
        </button>
      </div>
    </div>
    
    <div v-else class="auth-methods">
      <div class="tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="['tab', { active: activeTab === tab.id }]"
        >
          {{ tab.label }}
        </button>
      </div>
      
      <div class="tab-content">
        <MagicLinkAuth v-if="activeTab === 'magic'" />
        <OAuthAuth v-if="activeTab === 'oauth'" />
        <BiometricAuth v-if="activeTab === 'biometric'" />
      </div>
    </div>
    
    <div class="demo-info">
      <h3>📝 Notas para la Demo:</h3>
      <ul>
        <li>Magic Link: Envía un enlace único por email</li>
        <li>OAuth: Usa las credenciales de Google, GitHub o Apple</li>
        <li>Biometría: Touch ID, Face ID o Windows Hello</li>
        <li>Todos los métodos generan JWT tokens seguros</li>
        <li>Sin necesidad de gestionar contraseñas</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { supabase } from './lib/supabaseClient'
import MagicLinkAuth from './MagicLinkAuth.vue'
import OAuthAuth from './OAuthAuth.vue'
import BiometricAuth from './BiometricAuth.vue'

export default {
  name: 'App',
  components: {
    MagicLinkAuth,
    OAuthAuth,
    BiometricAuth
  },
  setup() {
    const user = ref(null)
    const activeTab = ref('magic')
    
    const tabs = [
      { id: 'magic', label: '✉️ Magic Link' },
      { id: 'oauth', label: '🌐 OAuth' },
      { id: 'biometric', label: '👆 Biometría' }
    ]
    
    const signOut = async () => {
      await supabase.auth.signOut()
      user.value = null
    }
    
    onMounted(() => {
      // Verificar sesión actual
      supabase.auth.getSession().then(({ data: { session } }) => {
        user.value = session?.user || null
      })
      
      // Escuchar cambios de autenticación
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        user.value = session?.user || null
      })
      
      return () => {
        authListener.subscription.unsubscribe()
      }
    })
    
    return {
      user,
      activeTab,
      tabs,
      signOut
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: #f5f5f5;
  color: #333;
}

#app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 8px;
}

.header p {
  font-size: 1.2rem;
  color: #666;
}

.user-session {
  margin-bottom: 40px;
}

.session-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.session-card h2 {
  color: #4CAF50;
  margin-bottom: 20px;
}

.user-details {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.user-details p {
  margin: 8px 0;
  word-break: break-all;
}

.signout-button {
  background: #f44336;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.signout-button:hover {
  background: #d32f2f;
}

.auth-methods {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
}

.tabs {
  display: flex;
  background: #f5f5f5;
}

.tab {
  flex: 1;
  padding: 16px;
  border: none;
  background: transparent;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  border-bottom: 3px solid transparent;
}

.tab:hover {
  background: #e8e8e8;
}

.tab.active {
  background: white;
  border-bottom-color: #2196F3;
  font-weight: 600;
}

.tab-content {
  padding: 40px;
}

.demo-info {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.demo-info h3 {
  margin-bottom: 16px;
  color: #333;
}

.demo-info ul {
  list-style: none;
  padding-left: 0;
}

.demo-info li {
  padding: 8px 0;
  padding-left: 24px;
  position: relative;
  color: #666;
}

.demo-info li:before {
  content: "→";
  position: absolute;
  left: 0;
  color: #2196F3;
}
</style>