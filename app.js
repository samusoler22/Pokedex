let allPokemons = [];

async function getPokemonsData() {
    if (allPokemons.length > 0) return allPokemons;
    
    const limit = 20;
    const maxItems = 151;
    let offset = 0;
    let allUrls = [];
    const API = "https://pokeapi.co/api/v2/pokemon";
  
    while (allUrls.length < maxItems) {
      const response = await fetch(`${API}?limit=${limit}&offset=${offset}`);
      const data = await response.json();
      allUrls = allUrls.concat(data.results.map(p => p.url));
      offset += limit;
      if (data.results.length < limit) break;
    }
  
    for (const url of allUrls.slice(0, maxItems)) {
      const response = await fetch(url);
      const data = await response.json();
      allPokemons.push(data);
    }
  
    return allPokemons;
}

function renderPokemons(pokemons){
    const container = document.getElementById("container");
    container.innerHTML = ""; // clear previous results
    const random = Math.floor(Math.random() * pokemons.length);
    pokemons.forEach(pokemon => {
      const div = document.createElement("div");
      div.classList.add("pokemon");

      const id_tag = document.createElement("p");
      id_tag.textContent = pokemon.id;

      const img_tag = document.createElement("img");
      if (random == pokemon.id){
        img_tag.src = pokemon.sprites.other.home.front_shiny
        //img_tag.src = pokemon.sprites.versions['generation-v']['black-white'].animated.front_shiny;
      } else {
        img_tag.src = pokemon.sprites.other.home.front_default
        //img_tag.src = pokemon.sprites.versions['generation-v']['black-white'].animated.front_default;
      }

      const name_tag = document.createElement("p");
      name_tag.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
     
      div.appendChild(id_tag)
      div.appendChild(img_tag);
      div.appendChild(name_tag);

      container.appendChild(div);
    });
}

function setupSearchbar() {
    const searchInput = document.getElementById("searchInput");
    const resultsList = document.getElementById("searchResults");
    const searchContainer = document.getElementById("searchContainer");
    
    searchInput.addEventListener("input", (event) => {
        const searchTerm = event.target.value.toLowerCase();
    
        // Clear previous results first
        resultsList.innerHTML = "";
    
        if (!searchTerm) return; // if input is empty, do nothing
    
        const filtered = allPokemons.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.id.toString().includes(searchTerm)
        );
    
        filtered.slice(0, 5).forEach(pokemon => {
          const li = document.createElement("li");
          li.textContent = `${pokemon.id} - ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}`;
          //p.sprites.versions["generation-vii"].icons.front_default
          li.addEventListener("click", () => {
            searchInput.value = `${pokemon.id} - ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}`;
            resultsList.innerHTML = "";
            searchInput.focus();
          });
          resultsList.appendChild(li);
        });
    });

    document.addEventListener("click", (e) => {
        if (!searchContainer.contains(e.target)) {
            resultsList.innerHTML = "";
        }
    });

    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            resultsList.innerHTML = "";
            searchInput.blur();
        }
    });
    }

// --- Init ---
document.addEventListener("DOMContentLoaded", async () => {
    allPokemons = await getPokemonsData();
    renderPokemons(allPokemons);
    setupSearchbar();
  });