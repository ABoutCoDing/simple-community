var routes = [
  { path: '/', component: HomeView },
  { path: '/posts', component: PostsView },
  { path: '/posts/write', component: WritePostView },
  { path: '/posts/:post_id', component: ReadPostView },
  { path: '**', redirectTo: '/' },
];

var router = new VueRouter({
  mode: 'history',
  routes: routes,
});

new Vue({
  el: '#app',
  router: router,
  template: /*html*/`
  <router-view></router-view>
`,
});