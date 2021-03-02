<template>
    <div style="font-size: 6vh" align="Center">
        Moduls
        <table>
          <thead>
            <td>Id_assig</td>
            <td>Cod_assig</td>
            <td>Nom_assig</td>
            <td>Modul</td>
            <td>Curs</td>
            <td>Hores</td>
            <td>Accions</td>
          </thead>
          <tbody>
            <tr v-for="assig in assignatura" :key="assig.id_assig">
              <td>{{ assig.id_assig }}</td>
              <td>{{ assig.cod_assig }}</td>
              <td>{{ assig.nom_assig }}</td>
              <td>{{ assig.modul }}</td>
              <td>{{ assig.curs }}</td>
              <td>{{ assig.hores }}</td>
              <td><a v-bind:href="'#/modulsId/' + assig.id_assig">Veure</a></td>
            </tr>
          </tbody>
        </table>
    </div>
</template>

<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.17/vue.js"></script>
<script>

import { api } from 'boot/axios'

export default {
  name: 'Moduls',
  components: { },
  data () {
    return {
      leftDrawerOpen: false,
      info: null,
      assignatura: []
    }
  },
  computed: {
    data_actual () {
      const timeStamp = new Date(
        Date.now()
      )
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      return timeStamp.toLocaleDateString('cat-ES', options)
    },
    drawerState: {
      get () {
        return this.$store.state.showcase.drawerState
      },
      set (val) {
        this.$store.commit('showcase/updateDrawerState', val)
      }
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    async loadData () {
      api.defaults.headers.common.Authorization = 'Bearer ' + getCookie('autToken')
      // console.log('Authorization: ' + api.defaults.headers.common.Authorization)
      // const params = new URLSearchParams();
      // params.append('id', this.$route.params.idAssig);
      api.get('/moduls', {}, { Authorization: 'Bearer ' + getCookie('autToken') })
        .then((response) => {
          this.data = response.data
          //console.log("data: ")
          //console.log(data)
          this.assignatura = response.data.results;
          console.log('assignatura')
          console.log(this.assignatura)
          console.log('response')
          console.log(response.data)
          this.info = response.data.assignatura
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

function getCookie (key) {
  var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)')
  return keyValue ? keyValue[2] : null
}

</script>
