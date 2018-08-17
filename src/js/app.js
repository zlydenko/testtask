import "../sass/main.scss";
import GithubInfo from "./gitInfo.js";

const userinfo = document.querySelector(".userinfo");
const reposlist = document.querySelector(".reposlist");
const input = document.querySelector("#username_field");

const form = document.querySelector(".username-form");

form.addEventListener("submit", e => {
  let userName = input.value;

  e.preventDefault();

  let user = new GithubInfo(userName, userinfo, reposlist);
  user.init();
});
