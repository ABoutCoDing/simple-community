var routes = [
  { path: '/', component: HomeView },
  { path: '/posts', component: PostsView },
  { path: '/posts/write', component: WritePostView },
  { path: '/posts/:post_id', component: ReadPostView },
  { path: '**', redirectTo: '/' },
];

var router = new VueRouter({
  mode: 'history',
  linkActiveClass: 'active',
  routes: routes,
});

new Vue({
  el: '#app',
  router: router,
  template: '<router-view></router-view>',
});