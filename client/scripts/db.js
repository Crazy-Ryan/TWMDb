let localStorage = window.localStorage;
let sessionStorage = window.sessionStorage;
let newTop250Db = [];

function getTop250() {
  let promiseObj = new Promise(function (resolve, reject) {
    const segmentCount = 5;
    let receiveCount = 0;
    let segmentCollection = Array(segmentCount);
    for (let index = 0; index < segmentCount; index++) {
      let [start, end] = countCal(segmentCount, index, 250);
      get250Interval(start, end).then((array) => {
        segmentCollection[index] = array;
        receiveCount++;
        if (segmentCount === receiveCount) {
          console.log('finish_collection');
          newTop250Db = segmentCollection.flat();
          console.log(newTop250Db);
          resolve();
        }
      });
    }
  });
  return promiseObj;
}

function countCal(segmentCount, index, num) {
  let start = (num / segmentCount) * index + 1;
  let end = (num / segmentCount) * (index + 1);
  return [start, end];
}


function get250Interval(start, end) {
  let promiseObj = new Promise(function (resolve, reject) {
    let BASIC_URL = 'http://127.0.0.1:8888';
    let AJAXSetup = {
      url: `${BASIC_URL}/v2/movie/top250?start=${start - 1}&count=${end - start + 1}`,
      method: 'GET',
      success: function (result) {
        resolve(result.subjects);
      }
    }
    AJAXHandle(AJAXSetup);
  });
  return promiseObj;
}

function initDb(func) {
  functionToRun = func || function () { };
  if (!readOnServiceDb()) {
    getTop250().then(() => {
      writeDbToStorage();
      overwriteOnServiceDbWithNewDb();
      setSessionActiveStatus();
      console.log('finish init database');
      console.log('start to render the page');
      functionToRun();
      console.log('finish rendering the page');
    });
  }
  else {
    if (!(sessionStorage.getItem('session-active'))) {
      setSessionActiveStatus();
      console.log('renew the on service database')
      overwriteOnServiceDbWithNewDb();
    }
    functionToRun();
    console.log('start to render the page');
    console.log('start to fetch new top 250');
    getTop250().then(() => {
      writeDbToStorage();
      console.log('finish updating the new top 250');
    });
  }
}

function writeDbToStorage() {
  localStorage.setItem('newTop250', JSON.stringify(newTop250Db));
}

function overwriteOnServiceDbWithNewDb() {
  localStorage.setItem('onServiceTop250', localStorage.getItem('newTop250'));
}

function setSessionActiveStatus() {
  sessionStorage.setItem('session-active', true);
}

function readOnServiceDb() {
  return JSON.parse(localStorage.getItem('onServiceTop250'));
}

function classifyMovies(collection) {

  return collection.reduce((catagoryCollection, item) => {
    item.genres.forEach((catagory) => {
      if (catagory in catagoryCollection) {
        catagoryCollection[catagory].push(item.id)
      }
      else {
        catagoryCollection[catagory] = [item.id];
      }
    })
    return catagoryCollection;
  }, []);
}

function itemSearch(collection,textToSearch){
  return collection.reduce((matchCollection,item)=>{
    if(-1 !==(item.title.search(textToSearch))){
      matchCollection.push(item.id);
    }
    return matchCollection;
  },[])
}

function AJAXHandle(options) {
  const AJAXSetup = {
    url: options.url || "",
    method: options.method.toUpperCase() || "GET",
    headers: options.headers || {},
    data: options.data || null,
    success: options.success || function (result) { },
    fail: options.fail || function (error) { }
  };
  let xhttp = new XMLHttpRequest();
  xhttp.onload = () => {
    AJAXSetup.success(JSON.parse(xhttp.responseText));
  };
  xhttp.onerror = () => {
    AJAXSetup.fail(xhttp.status);
  };
  xhttp.open(AJAXSetup.method, AJAXSetup.url);
  if (('POST' === AJAXSetup.method) || ('PUT' === AJAXSetup.method)) {
    xhttp.setRequestHeader('content-type', 'application/json');
    AJAXSetup.data = JSON.stringify(AJAXSetup.data);
  }
  xhttp.send(AJAXSetup.data);
}