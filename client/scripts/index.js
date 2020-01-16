let classificationDb;
let movieDb;
let pastHighlightCatagoryBox;
let movieListToRender;
let movieRenderProgressIndex = 1;
const movieRenderInterval =20;


initDb(fetchDataFromLocalStorage);
renderAllCatagorys();
movieListToRender = findMoviesIds(movieDb);
renderMovieListInInterval(movieListToRender, movieRenderProgressIndex, movieRenderProgressIndex + movieRenderInterval - 1);

function fetchDataFromLocalStorage() {
  classificationDb = readDbClassification();
  movieDb = readOnServiceDb();
}

// let showId = ["1292052", "1295644", "1307914", "1291841", "1296141", "1299131", "1293350", "26580232", "1305487"];

function onInterfaceClick(event) {
  const catagoryBox = 'catagory-box';
  let clickClass = event.target.getAttribute('class') || event.target.parentElement.getAttribute('class');
  // console.log(clickClass);
  if (catagoryBox === clickClass) {
    selectCatagoryHandle(findCatagoryBox(event.target));
  }
}

function findMoviesIds(movieList) {
  return movieList.map((movie) => (movie.id));
}

function findMoviesOfCatagory(catagoryList, catagoryName) {
  return catagoryList.find((catagory) => (catagoryName === catagory.name)).id;
}

function highlightCatagoryBox(target) {
  toggleHighlightCatagoryBox(target);
  if (pastHighlightCatagoryBox) {
    toggleHighlightCatagoryBox(pastHighlightCatagoryBox);
  }
  pastHighlightCatagoryBox = target;
}

function toggleHighlightCatagoryBox(target) {
  if ('yellow' === target.style.backgroundColor) {
    target.style.backgroundColor = 'transparent';
  }
  else {
    target.style.backgroundColor = 'yellow';
  }
}

function findCatagoryBox(target) {
  let targetEl;
  if (event.target.getAttribute('class')) {
    targetEl = event.target;
  }
  else {
    targetEl = event.target.parentElement;
  }
  return targetEl;
}

function selectCatagoryHandle(catagoryBoxEl) {
  let catagorySelected = catagoryBoxEl.firstElementChild.textContent;
  highlightCatagoryBox(catagoryBoxEl);
  removeMovies();
  movieRenderProgressIndex = 1;
  movieListToRender = findMoviesOfCatagory(classificationDb, catagorySelected);
  renderMovieListInInterval(movieListToRender, movieRenderProgressIndex, movieRenderProgressIndex + movieRenderInterval - 1);
  window.scrollTo(0, 0);
}

function removeMovies() {
  let movieGallaryEl = document.getElementsByClassName("movie-gallary")[0];
  while (movieGallaryEl.firstChild) {
    movieGallaryEl.removeChild(movieGallaryEl.firstChild);
  }
}

function renderMovieListInInterval(idList, start, end) {
  let renderStart = start || 1;
  let renderEnd = end || idList.length;
  let movieGallaryEl = document.getElementsByClassName("movie-gallary")[0];
  idList.slice(renderStart - 1, renderEnd).forEach((id) => {
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
    <span>${catagoryObj.name}</span>
    <span>(${catagoryObj.id.length}部)</span>`
  return catagoryEl;
}

function renderCatagorysFromList(catagoryObjList) {
  let catagoryListEl = document.getElementsByClassName("catagory-list")[0];
  catagoryObjList.forEach((catagoryObj) => {
    catagoryListEl.appendChild(renderSingleCatagory(catagoryObj));
  })
}

function renderAllCatagorys() {
  renderCatagorysFromList(classificationDb);
}

function getDataById(database, id) {
  return database.find((movie) => (id.toString() === movie.id))
}

function getDocumentTop() {
  let scrollTop = 0,
    bodyScrollTop = 0,
    documentScrollTop = 0;
  if (document.body) {
    bodyScrollTop = document.body.scrollTop;
  }
  if (document.documentElement) {
    documentScrollTop = document.documentElement.scrollTop;
  }
  scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
  return scrollTop;
}

//可视窗口高度
function getWindowHeight() {
  let windowHeight = 0;
  if (document.compatMode == "CSS1Compat") {
    windowHeight = document.documentElement.clientHeight;
  } else {
    windowHeight = document.body.clientHeight;
  }
  return windowHeight;
}

//滚动条滚动高度
function getScrollHeight() {
  let scrollHeight = 0,
    bodyScrollHeight = 0,
    documentScrollHeight = 0;
  if (document.body) {
    bodyScrollHeight = document.body.scrollHeight;
  }

  if (document.documentElement) {
    documentScrollHeight = document.documentElement.scrollHeight;
  }
  scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
  return scrollHeight;
}


window.onscroll = function () {
  console.log(getWindowHeight(), getDocumentTop(), getScrollHeight());
  if (getScrollHeight() < getWindowHeight() + getDocumentTop() + 15) {
    let loadmore = document.getElementsByClassName('loadmore')[0];
    loadmore.innerHTML = '<span class="loading"></span>加载中..';
    if (getScrollHeight() -1 <= getWindowHeight() + getDocumentTop()) {
      loadmore.innerHTML = ' ';
      // console.log(index);
      movieRenderProgressIndex += movieRenderInterval;
      renderMovieListInInterval(movieListToRender, movieRenderProgressIndex, movieRenderProgressIndex + movieRenderInterval - 1);
    }
  }
}