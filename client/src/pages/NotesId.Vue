<template>
    <div style="font-size: 6vh" align="Center">
        Notes Id {{ $route.params.idAssig }}
        <table>
          <thead>
            <td>ID</td>
            <td>Cod</td>
            <td>Nota</td>
            <td>Alumne</td>
          </thead>
          <tbody>
            <tr v-for="note in notes" :key="note.id_assig">
              <td>{{ note.id_assig }}</td>
              <td>{{ note.cod_assig }}</td>
              <td>{{ note.nota }}</td>
              <td>{{ note.username }}</td>
            </tr>
          </tbody>
        </table>
    </div>
</template>

<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.17/vue.js"></script>
<script>

import { api } from 'boot/axios'

export default {
  name: 'NotesId',
  components: { },
  data () {
    return {
      leftDrawerOpen: false,
      info: null,
      notes: []
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
      api.get('/notesId', params, { Authorization: 'Bearer ' + getCookie('autToken') })
        .then((response) => {
          this.data = response.data
          this.notes = response.data.notes;
          console.log('response')
          console.log(response.data)
          this.info = response.data.notes
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
