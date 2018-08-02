export function fetchUserRepos(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(data => data.json())
      .then(data => resolve(data))
      .catch(err => reject(err.message));
  });
}

function formatData(data) {
  const result = document.createElement("ul");
  data.map(repo => {
    const elem = document.createElement("li");
    const { name } = repo;
    elem.textContent = name;
    result.appendChild(elem);
  });

  return result;
}

function renderRepoList(data, node) {
  const formattedData = formatData(data);
  return node.appendChild(formattedData);
}

export default renderRepoList;
