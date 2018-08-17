class GithubInfo {
  constructor(username, userInfoElem, reposListElem, inputField) {
    this.username = username;
    this.userNode = userInfoElem;
    this.reposNode = reposListElem;
    this.inputField = inputField;
    this.userAPI = `https://api.github.com/users/${this.username}`;
    this.reposAPI = `https://api.github.com/users/${this.username}/repos`;
  }

  fetchData(link) {
    return new Promise((resolve, reject) => {
      fetch(link)
        .then(data => data.json())
        .then(data => {
          resolve(data);
        })
        .catch(err => reject(err.message));
    });
  }

  fetchUserInfo() {
    return this.fetchData(this.userAPI);
  }

  fetchReposInfo() {
    return this.fetchData(this.reposAPI);
  }

  renderError() {
    let mainElem = document.createElement("div");
    let text = document.createElement("h2");
    let subtext = document.createElement("p");
    text.textContent = "Sorry, user is not found";
    subtext.textContent = "try another one";

    mainElem.appendChild(text);
    mainElem.appendChild(subtext);

    return mainElem;
  }

  init() {
    this.cleanSection(this.userNode);
    this.cleanSection(this.reposNode);
    document.querySelector(".result-wrapper").style.display = "block";
    const cachedData = this.getFromLocalStorage(this.username);
    const cachedRepos = this.getFromLocalStorage(`${this.username}-repos`);

    if (cachedData === null) {
      this.fetchUserInfo().then(data => {
        if (data.message === "Not Found") {
          this.onError(this.inputField);
          this.reposNode.appendChild(this.renderError());
          return;
        }

        this.saveToLocalStorage(this.username, data);
        const { avatar, info } = this.userInfoElem(data);
        this.userNode.appendChild(avatar);
        this.userNode.appendChild(info);
      });
    } else {
      const { avatar, info } = this.userInfoElem(cachedData);
      this.userNode.appendChild(avatar);
      this.userNode.appendChild(info);
    }

    if (cachedRepos === null) {
      this.fetchReposInfo().then(data => {
        if (data.message === "Not Found") {
          this.onError(this.inputField);
          return;
        }

        this.saveToLocalStorage(`${this.username}-repos`, data);
        const reposList = this.reposInfoElem(data);
        this.reposNode.appendChild(reposList);
      });
    } else {
      const reposList = this.reposInfoElem(cachedRepos);
      this.reposNode.appendChild(reposList);
    }
  }

  userInfoElem(data) {
    const info = document.createElement("div");
    const avatar = document.createElement("img");
    const username = document.createElement("h2");
    const emailText = document.createElement("p");
    const companyText = document.createElement("p");
    const registeredText = document.createElement("p");
    const followersCounter = document.createElement("a");
    const {
      login,
      name,
      avatar_url,
      email,
      company,
      created_at,
      followers
    } = data;

    avatar.src = avatar_url;
    avatar.classList.add("avatar");
    username.textContent = name || login;
    emailText.textContent = email ? `email: ${email}` : null;
    companyText.textContent = company ? `company name: ${company}` : null;
    registeredText.textContent = this.formatDate(created_at);
    followersCounter.textContent = `followers: ${followers}`;
    followersCounter.href = `https://github.com/${login}?tab=followers`;

    info.classList.add("userbio");
    info.appendChild(username);
    emailText.textContent.length > 1 ? info.appendChild(emailText) : null;
    companyText.textContent.length > 1 ? info.appendChild(companyText) : null;
    info.appendChild(registeredText);
    info.appendChild(followersCounter);

    return {
      avatar,
      info
    };
  }

  reposInfoElem(data) {
    const reposList = document.createElement("ul");

    data.forEach((repo, _i, _arr) => {
      let node = document.createElement("li");
      let header = document.createElement("header");
      let main = document.createElement("main");

      let {
        name,
        full_name,
        created_at,
        language,
        open_issues_count,
        forks_count,
        description,
        clone_url
      } = repo;

      let repoName = document.createElement("h3");
      let repoFullName = document.createElement("h4");
      let repoCreateTime = document.createElement("p");
      let repoLanguage = document.createElement("p");
      let issuesCounter = document.createElement("a");
      let forksCounter = document.createElement("a");
      let repoDescription = document.createElement("p");
      let repoCloneForm = document.createElement("form");
      let repoCloneLabel = document.createElement("label");
      let repoCloneUrl = document.createElement("input");
      let forkBtn = document.createElement("a");
      let repoLink = document.createElement("a");

      let icons = {
        issuesImg: `<svg class="symbols" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"></path></svg>`,
        forkImg: `<svg class="symbols" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 1a1.993 1.993 0 0 0-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 0 0 2 1a1.993 1.993 0 0 0-1 3.72V6.5l3 3v1.78A1.993 1.993 0 0 0 5 15a1.993 1.993 0 0 0 1-3.72V9.5l3-3V4.72A1.993 1.993 0 0 0 8 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>`,
        repoImg: `<svg class="symbols" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z"></path></svg>`,
        linkImg: `<svg class="symbols" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M11 10h1v3c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h3v1H1v10h10v-3zM6 2l2.25 2.25L5 7.5 6.5 9l3.25-3.25L12 8V2H6z"></path></svg>`
      };

      repoLink.innerHTML = icons.linkImg;
      repoLink.href = `https://www.github.com/${full_name}`;
      repoLink.classList.add("repo-link");
      repoName.innerHTML = `${icons.repoImg}${name}`;
      repoFullName.textContent = full_name;
      repoFullName.appendChild(repoLink);
      repoCreateTime.textContent = `created: ${this.formatDate(created_at)}`;
      repoLanguage.textContent =
        language === null ? null : `main language: ${language}`;
      issuesCounter.innerHTML = icons.issuesImg;
      issuesCounter.innerHTML += `issues: ${open_issues_count}`;
      issuesCounter.href = `https://github.com/${full_name}/issues`;
      issuesCounter.classList.add("counter");
      issuesCounter.classList.add("btn");
      forksCounter.innerHTML = icons.forkImg;
      forksCounter.innerHTML += `forks: ${forks_count}`;
      forksCounter.href = `https://github.com/${full_name}/network/members`;
      forksCounter.classList.add("btn");
      repoDescription.textContent = description;
      repoDescription.classList.add("repo-description");
      repoCloneForm.classList.add("btn");
      repoCloneUrl.value = clone_url;
      repoCloneUrl.id = "clone";
      repoCloneLabel.textContent = "clone it";
      repoCloneLabel.htmlFor = "clone";
      forkBtn.innerHTML = icons.forkImg;
      forkBtn.innerHTML += "fork it";
      forkBtn.href = `https://github.com/${full_name}/fork`;
      forkBtn.classList.add("btn");

      repoCloneUrl.onclick = function() {
        this.select();
      };

      header.appendChild(repoName);
      header.onclick = function() {
        let mainContent = this.nextSibling;
        mainContent.classList.toggle("invisible");
      };

      repoCloneForm.classList.add("repo-clone");
      repoCloneForm.appendChild(repoCloneLabel);
      repoCloneForm.appendChild(repoCloneUrl);

      let btnWrapper = document.createElement("div");
      btnWrapper.classList.add("btns-container");
      btnWrapper.appendChild(issuesCounter);
      btnWrapper.appendChild(forkBtn);
      btnWrapper.appendChild(repoCloneForm);

      main.appendChild(repoFullName);
      main.appendChild(btnWrapper);
      main.appendChild(repoCreateTime);
      main.appendChild(repoLanguage);
      main.appendChild(repoDescription);
      main.classList.add("invisible");

      node.appendChild(header);
      node.appendChild(main);

      reposList.appendChild(node);
    });

    return reposList;
  }

  formatDate(timestamp) {
    const date = new Date(timestamp);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];

    let day = date.getDate();
    let monthIndex = date.getMonth();
    let year = date.getFullYear();

    const result = [day, monthNames[monthIndex], year].join(" ");

    return result;
  }

  onError(node) {
    node.classList.add("error");
    setTimeout(() => {
      node.classList.remove("error");
    }, 1000);
  }

  cleanSection(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  saveToLocalStorage(key, data) {
    const prettiedData = JSON.stringify(data);
    localStorage.setItem(key, prettiedData);
  }

  getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
  }
}

export default GithubInfo;
