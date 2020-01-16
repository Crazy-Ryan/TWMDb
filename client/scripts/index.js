let classificationDb;
let catagoryList;
let movieDb;
let movieGallaryEl = document.getElementsByClassName("movie-gallary")[0];

initDb(fetchDataFromLocalStorage);

function fetchDataFromLocalStorage(){
  classificationDb = readDbClassification();
  movieDb = readOnServiceDb();
}

let showId = ["1292052", "1295644", "1307914", "1291841", "1296141", "1299131", "1293350", "26580232", "1305487"];

let movieEl = document.createElement('div');
function renderMovieList(idList){
  idList.forEach((id)=>{
    renderSingleMovie(id);
  })
}

function renderSingleMovie(id){

}

function getDataById(database,id){
  return database.find((movie)=>(id === movie.id))
}
