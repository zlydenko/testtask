function render(data, node) {
  const mainNode = document.createElement("section");
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
  registeredText.textContent = formatDate(created_at);
  followersCounter.textContent = `followers: ${followers}`;
  followersCounter.href = `https://github.com/${login}?tab=followers`;

  info.classList.add("userbio");
  info.appendChild(username);
  emailText.textContent.length < 1 ? info.appendChild(emailText) : null;
  companyText.textContent.length < 1 ? info.appendChild(companyText) : null;
  info.appendChild(registeredText);
  info.appendChild(followersCounter);

  mainNode.classList.add("user");
  mainNode.appendChild(avatar);
  mainNode.appendChild(info);

  return node.appendChild(mainNode);
}

function formatDate(timestamp) {
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

export function cleanSection(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

export default render;
