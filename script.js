// You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  
  // Clear any existing content in rootElem
  rootElem.innerHTML = "";

  // 1. Create a container for the episode cards
  const container = document.createElement("div");
  container.className = "episodes-container";

  // 2. Loop through each episode and build the card
  episodeList.forEach((episode) => {
    const card = document.createElement("div");
    card.className = "episode-card";

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

  rootElem.appendChild(container);

  // 3. TVMaze Attribution Footer (Requirement)
  const footer = document.createElement("footer");
  footer.className = "tvmaze-attribution";
  footer.innerHTML = `Data originally provided by <a href="https://www.tvmaze.com/" target="_blank" rel="noopener noreferrer">TVMaze.com</a>`;
  rootElem.appendChild(footer);
}

window.onload = setup;window.onload = setup;
