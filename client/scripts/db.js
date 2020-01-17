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
          newTop250Db = segmentCollection.flat();
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
      writeClassificationResultToStorage();
      setSessionActiveStatus();
      functionToRun();
    });
  }
  else {
    if (!(sessionStorage.getItem('session-active'))) {
      setSessionActiveStatus();
      overwriteOnServiceDbWithNewDb();
      writeClassificationResultToStorage();
    }
    functionToRun();
    getTop250().then(() => {
      writeDbToStorage();
    });
  }
}

function writeDbToStorage() {
  localStorage.setItem('newTop250', JSON.stringify(newTop250Db));
}

function writeClassificationResultToStorage() {
  localStorage.setItem('classification', JSON.stringify(classifyMovies(readOnServiceDb())));
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

function readDbClassification() {
  return JSON.parse(localStorage.getItem('classification'));
}

function classifyMovies(collection) {
  return collection.reduce((catagoryCollection, item) => {
    item.genres.forEach((catagory) => {
      if (matchObj = searchInObjArray(catagoryCollection, catagory)) {
        matchObj.id.push(item.id);
      }
      else {
        let cataObj = {};
        cataObj.name = catagory;
        cataObj.id = [item.id];
        catagoryCollection.push(cataObj);
      }
    })
    return catagoryCollection;
  }, []);
}

function searchInObjArray(objArray, objname) {
  for (let index = 0; index < objArray.length; index++) {
    if (objname === objArray[index].name) {
      return objArray[index];
    }
  }
  return false;
}

function itemSearch(collection, textToSearch) {
  let singleTextArr = textToSearch.split(' ');
  let matchingItems = collectAllMatchingObj(collection, singleTextArr);
  return removeDuplicateItems(matchingItems);
}

function collectAllMatchingObj(collection, textArr) {
  return textArr.reduce((matches, currentText) => {
    return matches.concat(singleItemSearch(collection, currentText));
  }, []);
}

function singleItemSearch(collection, textToSearch) {
  return collection.reduce((matchCollection, item) => {
    if (-1 !== (item.title.search(textToSearch))) {
      matchCollection.push(item.id);
    }
    return matchCollection;
  }, [])
}

function removeDuplicateItems(itemArr) {
  return itemArr.reduce((result, currentItem) => {
    if (!result.includes(currentItem)) {
      result.push(currentItem);
    }
    return result;
  }, []);
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