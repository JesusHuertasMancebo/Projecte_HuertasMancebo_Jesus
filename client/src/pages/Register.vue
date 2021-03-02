<template>
  <div class="login">
    <h1 class="title">Register</h1>
    <form action="http://localhost:8093/register" class="form" method="POST">
      <label class="form-label" for="#nomComplet">Nom complet</label>
      <input class="form-input" type="nomComplet" id="nomComplet" name="nomComplet" required placeholder="Nom complet">
      <label class="form-label" for="#dni">Dni</label>
      <input class="form-input" type="dni" id="dni" name="dni" placeholder="Dni">
      <label class="form-label" for="#usuari">Usuari</label>
      <input class="form-input" type="usuari" id="usuari" name="username" placeholder="Usuari">
      <label class="form-label" for="#contraseña">Contraseña</label>
      <input class="form-input" type="contraseña" id="contraseña" name="password" placeholder="Contraseña">
      <input class="form-submit" type="submit" onClick="showMessage()" value="Sign in">
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
export default {
  name: 'Register',
  data: () => ({
    error: false,
    usuario: '',
    password: '',
    dni: ''
  })
}
</script>
