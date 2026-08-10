// You can edit ALL of the code here
let allEpisodes = [];

function setup() {
  allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

  // Clear any existing content in rootElem
  rootElem.innerHTML = "";

  // Create the search area
  const searchContainer = document.createElement("div");
  searchContainer.className = "search-container";

  const searchLabel = document.createElement("label");
  searchLabel.htmlFor = "search-input";
  searchLabel.textContent = "Search episodes: ";

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.id = "search-input";
  searchInput.placeholder = "Search by episode name or summary...";

  const resultCount = document.createElement("p");
  resultCount.className = "result-count";
  resultCount.textContent = `${episodeList.length} episodes found`;

  searchContainer.appendChild(searchLabel);
  searchContainer.appendChild(searchInput);
  searchContainer.appendChild(resultCount);

  rootElem.appendChild(searchContainer);

  // Create the episode selector
  const episodeSelect = document.createElement("select");
  episodeSelect.id = "episode-select";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Jump to an episode...";
  episodeSelect.appendChild(defaultOption);

  // Add all episodes to the dropdown
  allEpisodes.forEach((episode) => {
    const option = document.createElement("option");

    const seasonPad = String(episode.season).padStart(2, "0");
    const episodePad = String(episode.number).padStart(2, "0");
    const episodeCode = `S${seasonPad}E${episodePad}`;

    option.value = episode.id;
    option.textContent = `${episodeCode} - ${episode.name}`;

    episodeSelect.appendChild(option);
  });

  rootElem.appendChild(episodeSelect);

  // Create a container for the episode cards
  const container = document.createElement("div");
  container.className = "episodes-container";

  // Function to display episodes
  function displayEpisodes(episodes) {
    container.innerHTML = "";

    resultCount.textContent = `${episodes.length} ${
      episodes.length === 1 ? "episode" : "episodes"
    } found`;

    // Loop through each episode and build the card
    episodes.forEach((episode) => {
      const card = document.createElement("div");
      card.className = "episode-card";
      card.id = `episode-${episode.id}`;

      // Format episode code: S01E01 format using padStart
      const seasonPad = String(episode.season).padStart(2, "0");
      const episodePad = String(episode.number).padStart(2, "0");
      const episodeCode = `S${seasonPad}E${episodePad}`;

      // Episode Name and Link to TVMaze
      const title = document.createElement("h2");
      title.className = "episode-title";

      const link = document.createElement("a");
      link.href = episode.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = `${episode.name} - ${episodeCode}`;

      title.appendChild(link);

      // Medium Image
      const img = document.createElement("img");
      img.className = "episode-image";
      img.src = episode.image ? episode.image.medium : "";
      img.alt = episode.name;

      // Summary
      const summary = document.createElement("div");
      summary.className = "episode-summary";
      summary.innerHTML = episode.summary || "No summary available.";

      // Assemble card
      card.appendChild(title);
      card.appendChild(img);
      card.appendChild(summary);

      container.appendChild(card);
    });
  }

  // Add the episode container to the page
  rootElem.appendChild(container);

  // Display all episodes initially
  displayEpisodes(episodeList);

  // Live search
  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.trim().toLowerCase();

    const filteredEpisodes = allEpisodes.filter((episode) => {
      const episodeName = episode.name.toLowerCase();
      const episodeSummary = (episode.summary || "").toLowerCase();

      return (
        episodeName.includes(searchTerm) || episodeSummary.includes(searchTerm)
      );
    });

    displayEpisodes(filteredEpisodes);
  });

  // Jump to selected episode
  episodeSelect.addEventListener("change", function () {
    const selectedEpisodeId = episodeSelect.value;

    searchInput.value = "";

    if (!selectedEpisodeId) {
      displayEpisodes(allEpisodes);
      return;
    }

    const selectedEpisode = allEpisodes.find(
      (episode) => String(episode.id) === String(selectedEpisodeId)
    );

    if (selectedEpisode) {
      displayEpisodes([selectedEpisode]);
    }
  });

  // TVMaze Attribution Footer
  const footer = document.createElement("footer");
  footer.className = "tvmaze-attribution";
  footer.innerHTML = `Data originally provided by <a href="https://www.tvmaze.com/" target="_blank" rel="noopener noreferrer">TVMaze.com</a>`;
  rootElem.appendChild(footer);
}

window.onload = setup;
