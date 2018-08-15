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
        const reposList = this.reposInfoElem(cachedRepos);
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

      repoName.textContent = name;
      repoFullName.textContent = full_name;
      repoCreateTime.textContent = `created: ${this.formatDate(created_at)}`;
      repoLanguage.textContent =
        language === null ? null : `main language: ${language}`;
      issuesCounter.textContent = `open issues: ${open_issues_count}`;
      issuesCounter.href = `https://github.com/${full_name}/issues`;
      issuesCounter.classList.add("counter");
      forksCounter.textContent = `forks: ${forks_count}`;
      forksCounter.href = `https://github.com/${full_name}/network/members`;
      repoDescription.textContent = description;
      repoDescription.classList.add("repo-description");
      repoCloneUrl.value = clone_url;
      repoCloneUrl.id = "clone";
      repoCloneLabel.textContent = "clone it";
      repoCloneLabel.htmlFor = "clone";
      forkBtn.textContent = "fork it";
      forkBtn.href = `https://github.com/${full_name}/fork`;

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

      main.appendChild(repoFullName);
      main.appendChild(repoCreateTime);
      main.appendChild(repoLanguage);
      main.appendChild(issuesCounter);
      main.appendChild(forksCounter);
      main.appendChild(repoCloneForm);
      main.appendChild(repoDescription);
      main.appendChild(forkBtn);
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
