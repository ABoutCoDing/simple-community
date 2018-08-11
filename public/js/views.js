var MNavComponent = {
  template: /*html*/`
  <navbar>
    <router-link to="/" class="navbar-brand" slot="brand" href="#">ABoutCoDing Community</router-link>
    <template slot="collapse">
      <navbar-nav>
        <li class="active"><router-link to="/posts">게시판 <span class="sr-only">(current)</span></router-link></li>
      </navbar-nav>
    </template>
  </navbar>
`
}

var HomeView = {
  template: /*html*/`
  <m-nav></m-nav>
  <div>
    이곳은 ABoutCoDing 커뮤니티입니다.
  </div>
`,
  components: {
    MNav: MNavComponent,
  },
};
var PostsView = {
  template: /*html*/`
  <div>
    <m-nav></m-nav>

    <div class="container">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th style="width: 60%;">제목</th>
            <th>글쓴이</th>
            <th>날짜</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in posts">
            <td>{{ post.id }}</td>
            <router-link tag="td" v-bind:to="'/posts/'+post.id">{{ post.title }}</router-link>
            <td>{{ post.author }}</td>
            <td>{{ post.date }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
`,
  components: {
    MNav: MNavComponent,
  },
  data: function() {
    return {
      posts: null,
    };
  },
  mounted: function() {
    axios({
      url: '/api/posts',
      method: 'GET',
    }).then(resp => {
      this.posts = resp.data;
    });
  },
};
var ReadPostView = {
  template: /*html*/`
  <div>
    <m-nav></m-nav>
    <div class="container">
      {{ content }}
    </div>
  </div>
`,
  components: {
    MNav: MNavComponent,
  },
  data: function() {
    return {
      content: null,
    };
  },
  mounted: function() {
    axios({
      url: '/api/posts/' + this.$route.params.param_id,
      method: 'GET',
    }).then(resp => {
      this.content = resp.data.content;
    });
  },
};
var WritePostView = {
  template: /*html*/`
  <div>
    <alert>포스트 쓰기!</alert>
  </div>
`
};