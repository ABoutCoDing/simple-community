var MNavComponent = {
  template: /*html*/`
  <navbar>
    <router-link to="/" class="navbar-brand" slot="brand" href="#">ABoutCoDing Community</router-link>
    <template slot="collapse">
      <navbar-nav>
        <router-link tag="li" to="/posts"><a>게시판 <span class="sr-only">(current)</span></a></router-link>
      </navbar-nav>
    </template>
  </navbar>
`
}

var HomeView = {
  template: /*html*/`
  <div>
    <m-nav></m-nav>
    <div class="container">
      <div class="jumbotron">
        <h3>이곳은 ABoutCoDing 커뮤니티입니다.</h3>
      </div>
      <h4>반갑습니다!</h4>
    </div>
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
      <btn @click="writePost">글쓰기</btn>
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
            <router-link tag="td" v-bind:to="'/posts/'+post.id"><a style="cursor: pointer; color: black;">{{ post.title }}</a></router-link>
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
  methods: {
    writePost: function() {
      this.$router.push('/posts/write')
    },
  },
};
var ReadPostView = {
  template: /*html*/`
  <div>
    <m-nav></m-nav>
    <div class="container">
      <div class="row">
        <div class="col-xs-6"><span style="font-weight: 600;">제목:</span> {{ title }}</div>
        <div class="col-xs-3"><span style="font-weight: 600;">작성자:</span> {{ author }}</div>
        <div class="col-xs-3"><span style="font-weight: 600;">날짜:</span> {{ date }}</div>
        <hr />
        <div class="col-xs-12">{{ content }}</div>
      </div>
    </div>
  </div>
`,
  components: {
    MNav: MNavComponent,
  },
  data: function() {
    return {
      title: null,
      author: null,
      date: null,
      content: null,
    };
  },
  mounted: function() {
    axios({
      url: '/api/posts/' + this.$route.params.post_id,
      method: 'GET',
    }).then(resp => {
      this.title = resp.data.title;
      this.author = resp.data.author;
      this.date = resp.data.date;
      this.content = resp.data.content;
    });
  },
};
var WritePostView = {
  template: /*html*/`
  <div>
    <m-nav></m-nav>
    <div class="container">
      <div class="row">
        <div class="col-xs-3">
          <label>제목 &nbsp;</label><input type="text" v-model="title" />
        </div>
        <div class="col-xs-3">
          <label>작성자 &nbsp;</label><input type="text" v-model="author" />
        </div>
      </div>
      <div class="row" style="height: 500px;">
        <h3 class="col-xs-6">글쓰기 (마크다운 지원)</h3>
        <h3 class="col-xs-6">미리보기</h3>
        <div class="col-xs-6" style="height: 80%;">
          <textarea style="width: 100%; height: 100%;" class="form-control" v-model="content"></textarea>
        </div>
        <div class="col-xs-6" style="height: 80%;" >
          <div style="height: auto;" v-html="marked(content)"></div>
        </div>
      </div>
      <div class="row" style="text-align: center;">
        <btn type="info" @click="submitPost">제출</btn>
        <btn type="warning" @click="cancel">취소</btn>
      </div>
    </div>
  </div>
`,
  components: {
    MNav: MNavComponent,
  },
  data: function() {
    return {
      content: '',
      author: '',
      title: '',
    };
  },
  methods: {
    submitPost: function() {
      if ('' !== this.title &&
          '' !== this.author &&
          '' !== this.content) {
        axios({
          url: '/api/posts',
          method: 'POST',
          data: {
            title: this.title,
            author: this.author,
            content: this.content,
            date: new Date(),
          }
        }).then(resp => {
          this.$router.push('/posts');
        }).catch(err => {
          alert('글 쓰기 실패!');
          console.error(err);
        });
      } else {
        alert('모든 폼을 입력해주세요');
      }
    },
    cancel: function() {
      this.$router.push('/posts');
    },
  },
};