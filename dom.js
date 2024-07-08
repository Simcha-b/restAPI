const form = document.querySelector("form");
const loginPage = document.querySelector(".login");
const site = document.querySelector(".site");
const inputs = document.querySelectorAll("input");
const users = JSON.parse(localStorage.getItem("users"));
const posts = JSON.parse(localStorage.getItem("posts"));

form.addEventListener("submit", (e) => {
  e.preventDefault();
  users.forEach((user) => {
    if (user.username === inputs[0].value && user.email === inputs[1].value) {
      localStorage.setItem("curentUser", JSON.stringify(user));
      loginPage.classList.remove("active");
      site.classList.add("active");
      client.request("GET", user.userId, "getAllPosts", "");
    }
  });
});

//loguot
function show(pack) {
  const p = JSON.parse(pack);
  if (typeof p.body.content === "string") {
    //
    return;
  }
  p.body.content.forEach((post) => {
    document.querySelector("main").append(createPostTemp(post));
  });
}

function createPostTemp(post) {
  const temp = document.querySelector("template").content.cloneNode(true);
  const posttitle = temp.querySelector("h3");
  const postbody = temp.querySelector("p");
  const postby = temp.querySelector("h6");
  const btnComments = temp.querySelector("button");
  posttitle.textContent = post.title;
  postbody.textContent = post.body;
  postby.textContent += getNameById(post.userId);
  return temp;
}

function getNameById(id) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === id) {
      return users[i].username;
    }
  }
}
