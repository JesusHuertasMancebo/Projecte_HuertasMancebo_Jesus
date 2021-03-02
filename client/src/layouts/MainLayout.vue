<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="drawerState = !drawerState"
        />
        <q-toolbar-title>
          Qualificacions App
        </q-toolbar-title>

        <!--Per a mostrar la versio de Quasar-->
        <!--<div>Quasar v{{ $q.version }}</div>-->
        <div>{{ data_actual }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawerState"
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8">
          <!--Nom Drawer-->
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />

      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { api } from 'boot/axios'
import EssentialLink from 'components/EssentialLink.vue'

const linksData = [
  {
    title: 'Login',
    caption: 'Login',
    icon: 'login',
    link: '/#/login'
  },
  {
    title: 'About',
    caption: 'About',
    icon: 'about',
    link: '/#/about'
  },
  {
    title: 'Test',
    caption: 'Test',
    icon: 'test',
    link: '/#/test'
  },
  {
    title: 'Notes',
    caption: 'Notes',
    icon: 'test',
    link: '/#/notes'
  },
  {
    title: 'Assignatura',
    caption: 'Assignatura',
    icon: 'test',
    link: '/#/assignatura'
  },
  {
    title: 'Moduls',
    caption: 'Moduls',
    icon: 'test',
    link: '/#/moduls'
  }
]

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData
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
  methods: {
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
</script>
