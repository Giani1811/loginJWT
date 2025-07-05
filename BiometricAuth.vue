<template>
  <div class="biometric-container">
    <h3>🔐 Autenticación Biométrica</h3>
    <p class="subtitle">Touch ID, Face ID y llaves de seguridad</p>
    
    <div v-if="!isRegistered" class="biometric-setup">
      <div class="setup-card">
        <h4>Configurar Autenticación Biométrica</h4>
        <p>Registra tu dispositivo para acceso sin contraseña</p>
        
        <input
          v-model="username"
          type="text"
          placeholder="Nombre de usuario"
          class="biometric-input"
          :disabled="loading"
        />
        
        <button 
          @click="registerBiometric" 
          :disabled="loading || !username"
          class="biometric-button primary"
        >
          <svg v-if="!loading" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M17.81 4.47c-.8 0-1.54.3-2.1.84l-7.89 7.89-2.1-2.1a3.02 3.02 0 0 0-4.25 0 3.02 3.02 0 0 0 0 4.25l4.19 4.19c.39.39.9.58 1.41.58.51 0 1.02-.19 1.41-.58l9.98-9.98c.58-.58.88-1.34.88-2.12s-.3-1.54-.88-2.12a3.02 3.02 0 0 0-2.12-.88z"/>
          </svg>
          {{ loading ? 'Configurando...' : 'Registrar Biometría' }}
        </button>
      </div>
    </div>
    
    <div v-else class="biometric-login">
      <div class="device-info">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="#4CAF50">
          <path d="M9.5 10.5C9.5 11.88 10.62 13 12 13S14.5 11.88 14.5 10.5 13.38 8 12 8 9.5 9.12 9.5 10.5M12 2C17.52 2 22 6.48 22 12S17.52 22 12 22 2 17.52 2 12 6.48 2 12 2M12 4C7.58 4 4 7.58 4 12V12.23C4.39 12.14 4.78 12.08 5.16 12.03C5.54 9.42 7.62 7.34 10.22 6.96C10.46 6.64 10.75 6.35 11.07 6.11C11.36 5.88 11.68 5.69 12 5.54C12.32 5.69 12.64 5.88 12.93 6.11C13.25 6.35 13.54 6.64 13.78 6.96C16.38 7.34 18.46 9.42 18.84 12.03C19.22 12.08 19.61 12.14 20 12.23V12C20 7.58 16.42 4 12 4Z"/>
        </svg>
        <p>Dispositivo registrado</p>
      </div>
      
      <button 
        @click="authenticateWithBiometric" 
        :disabled="loading"
        class="biometric-button success"
      >
        Iniciar con Biometría
      </button>
      
      <button 
        @click="removeBiometric" 
        class="biometric-button secondary"
      >
        Eliminar registro
      </button>
    </div>
    
    <div v-if="message" class="message success">
      {{ message }}
    </div>
    
    <div v-if="error" class="message error">
      {{ error }}
    </div>
    
    <div class="biometric-features">
      <h4>Características de WebAuthn:</h4>
      <ul>
        <li>✅ Touch ID / Face ID en dispositivos Apple</li>
        <li>✅ Windows Hello en PC</li>
        <li>✅ Huella digital en Android</li>
        <li>✅ Llaves de seguridad USB (YubiKey, etc)</li>
        <li>✅ Sin contraseñas que recordar</li>
        <li>✅ Resistente a phishing</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { supabase } from './lib/supabaseClient'

export default {
  name: 'BiometricAuth',
  setup() {
    const username = ref('')
    const loading = ref(false)
    const message = ref('')
    const error = ref('')
    const isRegistered = ref(false)
    const credential = ref(null)
    
    // Simular WebAuthn API
    const webAuthnAvailable = () => {
      return window.PublicKeyCredential !== undefined
    }
    
    const registerBiometric = async () => {
      if (!webAuthnAvailable()) {
        error.value = 'WebAuthn no está disponible en este navegador'
        return
      }
      
      loading.value = true
      error.value = ''
      message.value = ''
      
      try {
        // En producción, esto vendría del servidor
        const challenge = new Uint8Array(32)
        window.crypto.getRandomValues(challenge)
        
        const publicKeyCredentialCreationOptions = {
          challenge,
          rp: {
            name: "Supabase Auth Demo",
            id: window.location.hostname,
          },
          user: {
            id: new TextEncoder().encode(username.value),
            name: username.value,
            displayName: username.value,
          },
          pubKeyCredParams: [{alg: -7, type: "public-key"}],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required"
          },
          timeout: 60000,
          attestation: "direct"
        }
        
        const cred = await navigator.credentials.create({
          publicKey: publicKeyCredentialCreationOptions
        })
        
        if (cred) {
          // Guardar en localStorage (en producción sería en el servidor)
          localStorage.setItem('webauthn_registered', 'true')
          localStorage.setItem('webauthn_user', username.value)
          
          isRegistered.value = true
          message.value = '✅ Biometría registrada exitosamente'
          
          // Integrar con Supabase
          const { data, error: supabaseError } = await supabase.auth.signUp({
            email: `${username.value}@biometric.local`,
            password: window.crypto.randomUUID(), // Contraseña aleatoria
            options: {
              data: {
                biometric_enabled: true,
                credential_id: Array.from(new Uint8Array(cred.rawId))
              }
            }
          })
          
          if (supabaseError) throw supabaseError
        }
      } catch (err) {
        error.value = `Error al registrar: ${err.message}`
      } finally {
        loading.value = false
      }
    }
    
    const authenticateWithBiometric = async () => {
      loading.value = true
      error.value = ''
      message.value = ''
      
      try {
        const challenge = new Uint8Array(32)
        window.crypto.getRandomValues(challenge)
        
        const publicKeyCredentialRequestOptions = {
          challenge,
          timeout: 60000,
          userVerification: "required",
          rpId: window.location.hostname,
        }
        
        const assertion = await navigator.credentials.get({
          publicKey: publicKeyCredentialRequestOptions
        })
        
        if (assertion) {
          message.value = '✅ Autenticación biométrica exitosa'
          
          // En producción, verificarías con el servidor
          // Aquí simulamos el login con Supabase
          const savedUser = localStorage.getItem('webauthn_user')
          const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email: `${savedUser}@biometric.local`,
            password: 'dummy-password' // En producción sería diferente
          })
          
          if (signInError) {
            // Si falla, intentar con Magic Link como fallback
            await supabase.auth.signInWithOtp({
              email: `${savedUser}@biometric.local`
            })
          }
        }
      } catch (err) {
        error.value = `Error de autenticación: ${err.message}`
      } finally {
        loading.value = false
      }
    }
    
    const removeBiometric = () => {
      localStorage.removeItem('webauthn_registered')
      localStorage.removeItem('webauthn_user')
      isRegistered.value = false
      username.value = ''
      message.value = 'Registro biométrico eliminado'
    }
    
    onMounted(() => {
      isRegistered.value = localStorage.getItem('webauthn_registered') === 'true'
      if (isRegistered.value) {
        username.value = localStorage.getItem('webauthn_user') || ''
      }
    })
    
    return {
      username,
      loading,
      message,
      error,
      isRegistered,
      registerBiometric,
      authenticateWithBiometric,
      removeBiometric
    }
  }
}
</script>

<style scoped>
.biometric-container {
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

.setup-card {
  background: #f9f9f9;
  padding: 24px;
  border-radius: 8px;
  text-align: center;
}

.setup-card h4 {
  margin: 0 0 8px 0;
}

.setup-card p {
  color: #666;
  margin-bottom: 20px;
}

.biometric-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 16px;
}

.biometric-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 12px;
}

.biometric-button.primary {
  background: #2196F3;
  color: white;
}

.biometric-button.success {
  background: #4CAF50;
  color: white;
}

.biometric-button.secondary {
  background: #f5f5f5;
  color: #666;
  border: 1px solid #e0e0e0;
}

.biometric-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.biometric-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.device-info {
  text-align: center;
  margin-bottom: 24px;
}

.device-info p {
  margin-top: 12px;
  color: #4CAF50;
  font-weight: 500;
}

.message {
  padding: 12px;
  border-radius: 8px;
  margin: 16px 0;
  text-align: center;
}

.message.success {
  background: #e8f5e9;
  color: #2e7d32;
}

.message.error {
  background: #ffebee;
  color: #c62828;
}

.biometric-features {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-top: 24px;
}

.biometric-features h4 {
  margin: 0 0 12px 0;
  color: #333;
}

.biometric-features ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.biometric-features li {
  padding: 4px 0;
  color: #666;
}
</style>