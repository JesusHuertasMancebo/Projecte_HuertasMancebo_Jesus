<template>
  <div class="login">
    <h1 class="title">Login</h1>
    <form id="formLogin" action="http://localhost:8093/login" class="form" method="POST" @submit="login">
      <label class="form-label" for="#usuari">Usuari:</label>
      <input v-model="usuari" class="form-input" type="usuari" id="usuari" name="username" required placeholder="Usuari">
      <label class="form-label" for="#contraseña">Contraseña:</label>
      <input v-model="contraseña" class="form-input" type="contraseña" name="password" id="password" placeholder="Contraseña">
      <a href="/#/register" style="color:#0b9185;">Regístrat</a>
      <input class="form-submit" type="submit"  value="Login">
    </form>
  </div>
</template>

<style lang="scss" scoped>
.login {
  padding: 0rem;
}
.title {
  text-align: center;
}
.form {
  margin: 3rem auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 20%;
  min-width: 350px;
  max-width: 100%;
  background: rgba(0, 60, 100, 0.9);
  border-radius: 5px;
  padding: 40px;
  box-shadow: 0 4px 10px 4px rgba(0, 0, 0, 0.3);
}
.form-label {
  margin-top: 2rem;
  color: white;
  margin-bottom: 0.5rem;
  &:first-of-type {
    margin-top: 0rem;
  }
}
.form-input {
  padding: 10px 15px;
  background: none;
  background-image: none;
  border: 1px solid white;
  color: white;
  &:focus {
    outline: 0;
    border-color: #1ab188;
  }
}
.form-submit {
  background: #1ab188;
  border: none;
  color: white;
  margin-top: 3rem;
  padding: 1rem 0;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #0b9185;
  }
}
</style>

<script>

import { api } from '../boot/axios'

export default {
  name: 'PageIndex',
  data: () => ({
    usuari: '',
    contraseña: '',
    error: false
  }),
  methods: {
    login (e) {
      console.log('Prueba login')
      console.log(this.usuari)
      console.log(this.contraseña)

      api.post('/login', {
        username: this.usuari,
        password: this.contraseña
      }).then((response) => {
        console.log('response')
        console.log(response)
        console.log(response.data.autToken)
        setCookie('autToken', response.data.autToken)

        console.log('Cookies: ' + getCookie('autToken'))
      })

      e.preventDefault()
    },
    showMessage () {
      var message = document.getElementById('usuari').value
      console.log('Prueba show message')
      console.log(message)
    },
    loadData () {
      api.get('/api/backend')
        .then((response) => {
          this.data = response.data
        })
        .catch(() => {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Loading failed',
            icon: 'report_problem'
          })
        })
    }
  }
}

function setCookie (key, value) {
  var expires = new Date()
  expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000))
  document.cookie = key + '=' + value + ';expires=' + expires.toUTCString()
}

function getCookie (key) {
  var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)')
  return keyValue ? keyValue[2] : null
}
</script>
