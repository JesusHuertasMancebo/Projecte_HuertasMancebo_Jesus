<template>
    <div style="font-size: 6vh" align="Center">
        Moduls Id {{ $route.params.idAssig }}
        <br><span id="textProfessor"></span>
        <table id="tablaModuls">
          <thead>
            <td>Id_alumne</td>
            <td>Full_name</td>
            <td>Id_assig</td>
            <td>Cod_assig</td>
            <td>Nota</td>
          </thead>
          <tbody>
            <tr v-for="asig in assignatura" :key="asig.id_assig">
              <td>{{ asig.id_alumne }}</td>
              <td>{{ asig.full_name }}</td>
              <td>{{ asig.id_assig }}</td>
              <td>{{ asig.cod_assig }}</td>
              <td>{{ asig.nota }}</td>
            </tr>
          </tbody>
        </table>
    </div>
</template>

<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.17/vue.js"></script>
<script>

import { api } from 'boot/axios'

export default {
  name: 'ModulsId',
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
      const params = { params: { id: this.$route.params.idAssig } }
      api.get('/modulsId', params, { Authorization: 'Bearer ' + getCookie('autToken') })
        .then((response) => {
          this.data = response.data
          if (typeof response.data.results === 'string') {
              console.log('es string2')
              document.getElementById('textProfessor').innerHTML = response.data.results
              document.getElementById('tablaModuls').style.display = 'none'
              console.log('innerHTML')
              console.log(document.getElementById('textProfessor'))
          } else {
            this.assignatura = response.data.atributs
            console.log("assigId")
            console.log(this.assignatura)
            console.log('response')
            console.log(response.data)
            this.info = response.data.assignaturaId
          }
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
