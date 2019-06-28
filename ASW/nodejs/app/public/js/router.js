const router = new VueRouter({
    mode: 'history',
    routes: [
      { path: '/', components: { default: Home, gmap: Gmap } },
      //{ path: '/', component: Home },
      { path: '/login', component: LoginForm, props: { action: "login" } },
      { path: '/register', component: LoginForm, props: { action: "register" } },
      { path: '/signal', component: SignalForm },
      //{ path: '/details/:id', component: Details, props: true },
      { path: '/details/:id', components: { default: Home, det: Details, gmap: Gmap },
                              props: { det: true } },
      { path: '/user', component: UserHome },
      //router.push( { name: "user", params: { user: response.data.message } } );
      //{ path: '/user', component: UserHome, name : 'user', props: true },
      { path: '/404', component: NotFound },
      { path: '*', redirect: '/404' }
    ]
  })
