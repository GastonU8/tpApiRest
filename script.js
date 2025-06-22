const getAllBtn = document.getElementById("getAllBtn");
const filterForm = document.getElementById("filterForm");
const characterList = document.getElementById("characterList");
const errorDiv = document.getElementById("error");
const loader = document.getElementById("loader");

const BASE_URL = "https://rickandmortyapi.com/api/character";

function showLoader(show) {
  loader.classList.toggle("hidden", !show);
}

function showError(message) {
  errorDiv.textContent = message;
}

function clearCharacters() {
  characterList.innerHTML = "";
  showError("");
}

function renderCharacters(characters) {
  clearCharacters();
  if (characters.length === 0) {
    showError("No se encontraron personajes.");
    return;
  }

  characters.forEach((character) => {
    const card = document.createElement("div");
    card.className = "character-card";
    card.innerHTML = `
      <img src="${character.image}" alt="${character.name}" />
      <h3>${character.name}</h3>
      <p>${character.status} - ${character.species}</p>
      <p><strong>Ubicación:</strong> ${character.location.name}</p>
      <p><strong>Origen:</strong> ${character.origin.name}</p>
      <p><strong>Tipo:</strong> ${character.type || "N/A"}</p>
      <p><strong>Género:</strong> ${character.gender}</p>
    `;
    characterList.appendChild(card);
  });
}

async function fetchAllCharacters() {
  clearCharacters();
  showLoader(true);
  let url = BASE_URL;
  let allCharacters = [];

  try {
    while (url) {
      const res = await fetch(url);
      if (!res.ok) throw new Error("No se pudieron obtener los personajes.");
      const data = await res.json();
      allCharacters = [...allCharacters, ...data.results];
      url = data.info.next;
    }
    renderCharacters(allCharacters);
  } catch (err) {
    showError(err.message);
  } finally {
    showLoader(false);
  }
}

async function fetchFilteredCharacters(filters) {
  clearCharacters();
  showLoader(true);

  const query = new URLSearchParams(filters).toString();

  try {
    const res = await fetch(`${BASE_URL}/?${query}`);
if (!res.ok) {
  const errorData = await res.json();
  throw new Error(errorData.error || "No se encontraron personajes con esos filtros.");
}
    const data = await res.json();
    renderCharacters(data.results);
  } catch (err) {
    showError(err.message);
  } finally {
    showLoader(false);
  }
}

getAllBtn.addEventListener("click", fetchAllCharacters);

filterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const filters = {};
  new FormData(filterForm).forEach((value, key) => {
    if (value.trim()) filters[key] = value.trim();
  });
  fetchFilteredCharacters(filters);
});
