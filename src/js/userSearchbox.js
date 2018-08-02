import render, { cleanSection } from "./userInfo.js";

const usernameResult = document.querySelector("#username_result");
const input = document.querySelector("input");
const form = document.querySelector("form");

form.addEventListener("submit", e => {
  e.preventDefault();
  cleanSection(usernameResult);
  if (input.value.length === 0) {
    onError(input);
  } else {
    fetchUserInfo(input.value)
      .then(data => render(data, usernameResult))
      .catch(err => {
        onError(input);
        console.log(err.message);
      });
  }
});

function onError(node) {
  node.classList.add("error");
  setTimeout(() => {
    node.classList.remove("error");
  }, 1000);
}

function fetchUserInfo(username) {
  const getUserInfoLink = `https://api.github.com/users/${username}`;

  return new Promise((resolve, reject) => {
    fetch(getUserInfoLink)
      .then(data => data.json())
      .then(data => {
        data.message === "Not Found" ? reject(data) : resolve(data);
      });
  });
}
