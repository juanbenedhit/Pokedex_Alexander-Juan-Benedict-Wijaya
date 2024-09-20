let array = [];
let currentPage = 1;
const pokemonList = document.querySelector(".output");
const searchInput = document.querySelector("#task-input");
const prevPageBtn = document.querySelector("#prevPage");
const nextPageBtn = document.querySelector("#nextPage");
const pageInfo = document.querySelector("#pageInfo");

const pokemonModal = new bootstrap.Modal(
  document.getElementById("pokemonModal")
);
const pokemonModalLabel = document.getElementById("pokemonModalLabel");
const pokemonModalBody = document.getElementById("pokemonModalBody");

async function fetchPokemon(page = 1) {
  try {
    let res = await fetch(
      `https://pokeapi.co/api/v2/pokemon?offset=${(page - 1) * 20}&limit=20`
    );

    let data = await res.json();
    array = [];
    fetchEachPokemon(data.results);
    updatePageInfo(page);
  } catch (error) {
    console.error("Error", error);
  }
}

async function fetchOnePokemon(pokemon) {
  try {
    let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    let data = await res.json();
    return data;
  } catch (error) {
    console.error("Error", error);
  }
}

async function fetchEachPokemon(pokemonList) {
  for (let i = 0; i < pokemonList.length; i++) {
    array.push(await fetchOnePokemon(pokemonList[i].name));
  }
  console.log(array);
  showPokemon(array);
}

const showPokemon = (pokemon) => {
  const output = document.querySelector(".output");
  output.innerHTML = "";
  pokemon.forEach((each, index) => {
    let types = each.types
      .map(
        (type) => `<span class="badge bg-secondary">${type.type.name}</span>`
      )
      .join(" ");

    let card = `
      <div class="card m-3 pokemon-card" style="width: 18rem;" onclick="showPokemonDetails(${index})">
        <img src="${each.sprites.front_default}" class="card-img-top" alt="${each.name}">
        <div class="card-body">
          <h5 class="card-title">${each.name}</h5>
        </div>
      </div>
    `;
    output.innerHTML += card;
  });
};

function showPokemonDetails(index) {
  const pokemon = array[index];

  let abilities = pokemon.abilities
    .map((ability) => `<li>${ability.ability.name}</li>`)
    .join("");

  let types = pokemon.types
    .map(
      (type) => `<span class="badge bg-secondary mx-1">${type.type.name}</span>`
    )
    .join(" ");

  pokemonModalLabel.innerText = pokemon.name;
  pokemonModalBody.innerHTML = `
    <div class="d-flex flex-column align-items-center">
      <img src="${pokemon.sprites.other.dream_world.front_default}" class="img-fluid mb-3" alt="${pokemon.name}">
      <p><strong>Type:</strong> ${types}</p>
      <p><strong>Abilities:</strong></p>
      <ul>${abilities}</ul>
      <p><strong>Base Experience:</strong> ${pokemon.base_experience}</p>
    </div>
  `;

  pokemonModal.show();
}

async function searchPokemon() {
  const query = searchInput.value.toLowerCase();
  const filteredPokemon = array.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(query)
  );

  showPokemon(filteredPokemon);
}

function updatePageInfo(page) {
  currentPage = page;
  pageInfo.innerText = `Page ${currentPage}`;
}

function nextPage() {
  currentPage++;
  fetchPokemon(currentPage);
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchPokemon(currentPage);
  }
}

fetchPokemon();
