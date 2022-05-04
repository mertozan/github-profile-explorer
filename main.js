const APIURL = "https://api.github.com/users/";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
let error = null;

async function getUser(username) {
  try {
    const resp = await fetch(APIURL + username);
    const respData = await resp.json();
    console.log(respData);
    if (respData.message) {
      error = respData.message;
    }
    createUserCard(respData);

    getRepos(username);
    error = null;
  } catch (err) {
    console.log("Hello");
    error = true;
  }
}

async function getRepos(username) {
  const resp = await fetch(APIURL + username + "/repos");
  const respData = await resp.json();

  addReposToCard(respData);
}

function createUserCard(user) {
  const cardHTML = error
    ? `<div style ="color:white;">Not Found</div>`
    : `
        <div class="card">
            <div>
                <img class="avatar" src="${user.avatar_url}" alt="${
        user.name
      }" />
            </div>
            <div class="user-info">
                <h2>${user.name}</h2>
                <p>${user.bio ? user.bio : ""}</p>
                <ul class="info">
                    <li>${user.followers}<strong>Followers</strong></li>
                    <li>${user.following}<strong>Following</strong></li>
                    <li>${user.public_repos}<strong>Repos</strong></li>
                </ul>
                <div id="repos"></div>
            </div>
        </div>
    `;

  main.innerHTML = cardHTML;
}

function addReposToCard(repos) {
  const reposEl = document.getElementById("repos");

  repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 10)
    .forEach((repo) => {
      const repoEl = document.createElement("a");
      repoEl.classList.add("repo");

      repoEl.href = repo.html_url;
      repoEl.target = "_blank";
      repoEl.innerText = repo.name;

      reposEl.appendChild(repoEl);
    });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = search.value;

  if (user) {
    getUser(user);

    search.value = "";
  }
});
