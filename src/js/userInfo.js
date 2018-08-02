function render(data, node) {
  const mainNode = document.createElement("section");
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
  username.textContent = name || login;
  emailText.textContent = email || "X";
  companyText.textContent = company || "X";
  registeredText.textContent = formatDate(created_at);
  followersCounter.textContent = followers;
  followersCounter.href = `https://github.com/${login}?tab=followers`;

  mainNode.appendChild(avatar);
  mainNode.appendChild(username);
  mainNode.appendChild(emailText);
  mainNode.appendChild(companyText);
  mainNode.appendChild(registeredText);
  mainNode.appendChild(followersCounter);

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

export default render;
