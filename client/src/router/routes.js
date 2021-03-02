
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'about', component: () => import('pages/About.vue') },
      { path: 'register', component: () => import('pages/Register.vue') },
      { path: 'test', component: () => import('pages/Test.vue') },
      { path: 'login', component: () => import('pages/Login.vue') },
      { path: 'notes', component: () => import('pages/Notes.vue') },
      { path: 'notesId/:idAssig', component: () => import('pages/NotesId.vue') },
      { path: 'assignatura', component: () => import('pages/Asignatura.vue') },
      { path: 'assignaturaId/:idAssig', component: () => import('pages/AsignaturaId.vue') },
      { path: 'moduls', component: () => import('pages/Moduls.vue') },
      { path: 'modulsId/:idAssig', component: () => import('pages/ModulsId.vue') }

    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
