// You can edit ALL of the code here
let allShows = [];
let allEpisodes = [];

const SHOWS_URL = "https://api.tvmaze.com/shows";

const episodeCache = {};

// Helper function to display messages to the user in the UI
function displayStatusMessage(message, isError = false) {
  const statusContainer =
    document.getElementById("status-message") || createStatusContainer();
  statusContainer.textContent = message;
  statusContainer.style.color = isError ? "red" : "black";
}

function createStatusContainer() {
  const container = document.createElement("div");
  container.id = "status-message";
  container.style.padding = "1rem";
  container.style.fontSize = "1.2rem";
  container.style.textAlign = "center";

  // Prepend to body or main container
  document.body.prepend(container);
  return container;
}

// Fetch episodes ONCE on page load
async function setup() {
  displayStatusMessage("Loading episodes, please wait...");

  try {
    const response = await fetch(SHOWS_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Store episodes in state array
    allShows = await response.json();

    // Sort shows alphabetically, case-insensitive
    allShows.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, {
        sensitivity: "base",
      })
    );

    // Clear the loading message
    displayStatusMessage("");

    // Initialize your application UI with the loaded data
    makePageForShows();
  } catch (error) {
    // Notify the user directly in the DOM (not just console.error)
    displayStatusMessage(
      "Failed to load episodes. Please check your internet connection and try refreshing the page.",
      true
    );
  }
}

function makePageForShows() {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  // Show selector
  const showContainer = document.createElement("div");
  showContainer.className = "show-selector-container";

  const showLabel = document.createElement("label");
  showLabel.htmlFor = "show-select";
  showLabel.textContent = "Choose a show: ";

  const showSelect = document.createElement("select");
  showSelect.id = "show-select";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select a show...";
  showSelect.appendChild(defaultOption);

  // Add sorted shows to dropdown
  allShows.forEach((show) => {
    const option = document.createElement("option");

    option.value = show.id;
    option.textContent = show.name;

    showSelect.appendChild(option);
  });

  showContainer.appendChild(showLabel);
  showContainer.appendChild(showSelect);

  rootElem.appendChild(showContainer);

  // Episode area
  const episodeArea = document.createElement("div");
  episodeArea.id = "episode-area";

  rootElem.appendChild(episodeArea);

  // When user selects a show
  showSelect.addEventListener("change", async function () {
    const selectedShowId = showSelect.value;

    if (!selectedShowId) {
      episodeArea.innerHTML = "";
      allEpisodes = [];
      return;
    }

    const selectedShow = allShows.find(
      (show) => String(show.id) === String(selectedShowId)
    );

    if (selectedShow) {
      await loadEpisodesForShow(selectedShow, episodeArea);
    }
  });
}

async function loadEpisodesForShow(show, episodeArea) {
  const showId = show.id;

  // If we've already fetched this show's episodes,
  // don't make another request.
  if (episodeCache[showId]) {
    allEpisodes = episodeCache[showId];

    makePageForEpisodes(allEpisodes, show, episodeArea);

    return;
  }

  displayStatusMessage(`Loading episodes for ${show.name}, please wait...`);

  try {
    const episodesUrl = `https://api.tvmaze.com/shows/${showId}/episodes`;

    const response = await fetch(episodesUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const episodes = await response.json();

    // Store episodes in cache
    episodeCache[showId] = episodes;

    allEpisodes = episodes;

    displayStatusMessage("");

    makePageForEpisodes(allEpisodes, show, episodeArea);
  } catch (error) {
    console.error(error);

    displayStatusMessage(`Failed to load episodes for ${show.name}.`, true);
  }
}

function makePageForEpisodes(episodeList, show, episodeArea) {
  episodeArea.innerHTML = "";

  const showTitle = document.createElement("h1");
  showTitle.textContent = show.name;

  episodeArea.appendChild(showTitle);

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

  episodeArea.appendChild(searchContainer);

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

  episodeArea.appendChild(episodeSelect);

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
  episodeArea.appendChild(container);

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
  episodeArea.appendChild(footer);
}

window.onload = setup;
