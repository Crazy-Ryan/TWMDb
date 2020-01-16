let classificationDb;
let movieDb;

initDb(fetchDataFromLocalStorage);
renderAllCatagorys();
renderMovieList(findMoviesIds(movieDb));
function fetchDataFromLocalStorage() {
  classificationDb = readDbClassification();
  movieDb = readOnServiceDb();
}

let showId = ["1292052", "1295644", "1307914", "1291841", "1296141", "1299131", "1293350", "26580232", "1305487"];


function findMoviesIds(movieList) {
  return movieList.map((movie) => (movie.id));
}

function findMoviesOfCatagory(catagoryList, catagoryName) {
  return catagoryList.find((catagory) => (catagoryName === catagory.name)).id;
}

// function findMoviesCatagories(catagoryList) {
//   return catagoryList.map((catagory) => (catagory.name));
// }

function removeMovies() {
  let movieGallaryEl = document.getElementsByClassName("movie-gallary")[0];
  while (movieGallaryEl.firstChild) {
    movieGallaryEl.removeChild(movieGallaryEl.firstChild);
  }
}

function renderMovieList(idList) {
  let movieGallaryEl = document.getElementsByClassName("movie-gallary")[0];
  idList.forEach((id) => {
    movieGallaryEl.appendChild(renderSingleMovie(getDataById(movieDb, id)));
  })
}

function renderSingleMovie(movieObj) {
  let movieEl = document.createElement('div');
  movieEl.setAttribute('class', 'movie-box');
  movieEl.innerHTML = `
    <a href="../pages/detailPage.html?${movieObj.id}"><img src=${movieObj.images.small} />
      <div><span class="movie-title">${movieObj.title}</span>
    </a><span class="movie-year">(${movieObj.year})</span>
    </div>
    <div><span class="rating-star">★</span><span class="movie-rating">${movieObj.rating.average.toFixed(1)}</span></div>`;
  return movieEl;
}

function renderSingleCatagory(catagoryObj) {
  let catagoryEl = document.createElement('div');
  catagoryEl.setAttribute('class', 'catagory-box');
  catagoryEl.innerHTML = `
    <span class="catagory-name">${catagoryObj.name}</span>
    <span class="catagory-count">(${catagoryObj.id.length}部)</span>`
  return catagoryEl;
}

function renderCatagorysFromList(catagoryObjList){
  let catagoryListEl = document.getElementsByClassName("catagory-list")[0];
  catagoryObjList.forEach((catagoryObj) => {
    catagoryListEl.appendChild(renderSingleCatagory(catagoryObj));
  })
}

function renderAllCatagorys(){
  renderCatagorysFromList(classificationDb);
}

function getDataById(database, id) {
  return database.find((movie) => (id.toString() === movie.id))
}
