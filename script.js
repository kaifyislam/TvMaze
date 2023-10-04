// script.js

document.getElementById("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const show = document.getElementById("search").value;
    const API_URL = "https://api.tvmaze.com/singlesearch/shows?q=";
    
    try {
        const result = await fetch(API_URL + show);
        const data = await result.json();

        // Update the HTML elements with data
        document.getElementById("showName").textContent = data.name;
        document.getElementById("language").textContent = data.language;
        document.getElementById("rating").textContent = data.rating.average;
        document.getElementById("genres").textContent = data.genres.join(", ");
        document.getElementById("mainImage").src = data.image.original;
        document.getElementById("showSummary").textContent = data.summary.replace(/<p>/g, "").replace(/<\/p>/g, "").replace(/<b>|<\/b>/g, "");

        // Fetch cast data
        const castResponse = await fetch(`https://api.tvmaze.com/shows/${data.id}/cast`);
        const castData = await castResponse.json();
        const castContainer = document.getElementById("castContainer");
        castContainer.innerHTML = "";

        castData.forEach((cast) => {
            const castDiv = document.createElement("div");
            castDiv.innerHTML = `
                <img class="image" src="${cast.person.image.medium}" alt="Image not found">
                <div class="image-name"><b><em>${cast.person.name}</em></b></div>
            `;
            castContainer.appendChild(castDiv);
        });

        // Fetch episode data
        const episodeResponse = await fetch(`https://api.tvmaze.com/shows/${data.id}/episodes`);
        const episodeData = await episodeResponse.json();
        const episodeContainer = document.getElementById("episodeContainer");
        episodeContainer.innerHTML = "";

        episodeData.forEach((episode) => {
            const episodeDiv = document.createElement("div");
            episodeDiv.innerHTML = `
            <div style="margin: 20px;
            background-color: #007bff77; /* Netflix blue for episode background */
            padding: 50px;
            border-radius: 5px;">
                <h2>S${episode.season} E${episode.number}</h2>
                <h4>Rating: ${episode.rating.average}</h4>
                <h3>${episode.name}</h3>
                <img class="episode-image" src="${episode.image.original}" alt="Episode Image">
                <p>${episode.summary.replace(/<p>/g, "").replace(/<\/p>/g, "")}</p>
                <br><br>
                </div>
            `;
            episodeContainer.appendChild(episodeDiv);
        });

    } catch (error) {
        document.getElementById("tag-error").textContent = error.message;
    }
});
