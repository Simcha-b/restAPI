const server = {
  routing(pack) {
    const p = JSON.parse(pack);
    let fan = this[p.header.requestMethod][p.body.action];
    fan(p);
    this.response(p);
  },
  response(pack) {
    pack.body.action = "response";
    pack = JSON.stringify(pack);
    network(pack, "response");
  },
  GET: {
    getAllPosts(pack) {
      pack.body.content = JSON.parse(localStorage.getItem("posts"));
      pack.header.statusCode = "200, ok";
    },
    getPostsByUserId(pack) {
      const allposts = JSON.parse(localStorage.getItem("posts"));
      pack.body.content = allposts.filter((post) => {
        return post.userId == pack.header.userId;
      });
      pack.header.statusCode = "200, ok";
      if (pack.body.content.length === 0) {
        pack.body.content = "You have not created posts yet!";
      }
    },
    getPostsByUsername(pack) {
      const users = JSON.parse(localStorage.getItem("users"));
      const allposts = JSON.parse(localStorage.getItem("posts"));

      let user = users.filter((user) => {
        return user.username == pack.body.content;
      });
      if (user.length === 0) {
        pack.header.statusCode = "404, failed";
        pack.body.content = "user not exist!";
        return;
      }
      pack.body.content = allposts.filter((post) => {
        return post.userId === user[0].id;
      });
      pack.header.statusCode = "200, ok";
    },
    getCommentsByPostId(pack) {
      const comments = JSON.parse(localStorage.getItem("comments"));
      pack.body.content = comments.filter((comment) => {
        return comment.postId === pack.body.content;
      });
      pack.header.statusCode = "200, ok";
    },
  },
  POST: {
    addNewPost(pack) {
      const allposts = JSON.parse(localStorage.getItem("posts"));
      const newPost = {
        userId: pack.header.client,
        title: pack.body.content[0],
        body: pack.body.content[1],
        id: allposts.length,
      };
      allposts.push(newPost);
      localStorage.setItem("posts", JSON.stringify(allposts));
      pack.header.statusCode = "200, ok";
      pack.body.content = "add a new post!!";
    },
    addNewComment(pack) {
      const allComments = JSON.parse(localStorage.getItem("comments"));
      const newComment = {
        name: pack.body.content[0],
        postId: pack.body.content[1],
        email: pack.body.content[2],
        body: pack.body.content[3],
      };
      allComments.push(newComment);
      localStorage.setItem("comments", JSON.stringify(allComments));

      pack.header.statusCode = "200, ok";
      pack.body.content = "add a new comment!!";
    },
  },
  //   PUT: {},
  //   DELETE: {},
};
class Pack {
  constructor(requestMethod, userId, action, content) {
    this.header = {
      requestMethod: requestMethod, // GET, POST, PUT, DELETE
      client: userId,
      statusCode: null,
    };
    this.body = {
      action: action, //response, getAllPaosts, getPostsByUserId, getPostsByUsername, getCommentsByPostId, addNewPost, addNewComment
      content: content,
    };
  }
}
function network(pack, requestMethod) {
  setTimeout(() => {
    if (requestMethod === "response") {
      show(pack);
    } else {
      server.routing(pack);
    }
  }, 1000);
}
const client = {
  request(requestMethod, userId, action, content) {
    let pack = new Pack(requestMethod, userId, action, content);
    pack = JSON.stringify(pack);
    network(pack, requestMethod);
  },
};
