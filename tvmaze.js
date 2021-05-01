/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  let shows = await axios.get("http://api.tvmaze.com/search/shows", {
        params: {
          q: query
        }
        });

  // Instantiate empty array to store the data
  let showData = [];
  
  //Loop through the returned show data from the tvmaze API (it returns pretty much anything that 
  //is remotely similar to the search query - "Freaks and Geeks" gets back a bunch of shows with
  //"Greeks" in the title, for instance) and store the appropriate data in the array.
  for(let i = 0; i < shows.data.length; i++){
    //if no show image exists, replace it with a default image
    let showImage = shows.data[i].show.image ? shows.data[i].show.image.medium : "https://tinyurl.com/tv-missing";
    
    showData[i] = 
      {
        id: shows.data[i].show.id,
        name: shows.data[i].show.name,
        summary: shows.data[i].show.summary,
        image: showImage
      };
    }
  return showData;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();
  
  for (let show of shows) {
    
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <img class="card-img-top" src="${show.image}">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="episode-button">Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
  //Add event listener to button(s)
  $("#shows-list").on("click", ".episode-button", async function(evt) {
    //gets the show ID from the closest div w/ class .card and then calls the functions
    //that get the episodes from that show and display them
    let showID = $(evt.target).closest("div.card").data("show-id");
    let episodeList = await getEpisodes(showID);
    populateEpisodes(episodeList);
    
  });
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above
  
  // Get the episodes from the tvmaze api
  let episodes = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

  // Create an empty array to store the data
  let episodeData = [];

  // Loop through the returned episodes and fill the array with the appropriate data
  for(let i = 0; i < episodes.data.length; i++){
    episodeData[i] = 
    { id: episodes.data[i].id,
      name: episodes.data[i].name,
      season: episodes.data[i].season,
      number: episodes.data[i].number
    };
  }

  return episodeData;

}

function populateEpisodes(episodeList){
  //unhide the section (if it isn't already)
  $("#episodes-area").show();
  
  //get the episode list UL and empty it out
  let episodesListUL = $("#episodes-list");
  episodesListUL.empty();
  
  //populate it with LIs that describe episodes of the show
  for(let episode of episodeList){
    //make the string that will be stored in the LI
    let episodeString = "ID: " + `${episode.id}` + " Name: " + `${episode.name}` 
    + " S:" + `${episode.season}` + " E:" + `${episode.number}`;
    //append the new LI
    episodesListUL.append(`<li>${episodeString}</li>`);
  }
  
}