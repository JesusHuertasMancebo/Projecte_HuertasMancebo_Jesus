<template>
    <!--<img
      alt="Quasar logo"
      src="~assets/quasar-logo-full.svg"
    >-->
<div class="login">
    <h1 class="title">Test</h1>
      <input type="button" @click="loadData" value="Login">
</div>

</template>

<script>
import { api } from 'boot/axios'

export default {
  name: 'Test',
  methods: {
    loadData () {
      console.log('loadDataa')
      api.get('/')
        .then((response) => {
          console.log('responseData: ' + response.data)
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
</script>
