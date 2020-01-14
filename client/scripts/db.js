let localStorage = window.localStorage;
let sessionStorage = window.sessionStorage;
let newTop250Db = [];

function getTop250() {
  let promiseObj = new Promise(function (resolve, reject) {
    get250Interval(1, 100)
      .then(() => get250Interval(101, 200))
      .then(() => get250Interval(201, 250))
      .then(() => {
        writeDbToStorage();
        resolve();
      });
  });
  return promiseObj;
}


function get250Interval(start, end) {
  let promiseObj = new Promise(function (resolve, reject) {
    let BASIC_URL = 'http://127.0.0.1:8888';
    let AJAXSetup = {
      url: `${BASIC_URL}/v2/movie/top250?start=${start - 1}&count=${end - start + 1}`,
      method: 'GET',
      success: function (result) {
        newTop250Db = newTop250Db.concat(result.subjects);
        resolve();
      }
    }
    AJAXHandle(AJAXSetup);
  });
  return promiseObj;
}

function initDb(func) {
  functionToRun = func || function (result) { };
  if (!(localStorage.getItem('onServiceTop250'))) {
    getTop250().then(() => {
      copyNewDbToOnServiceDb();
      setSessionActiveStatus();
      console.log('finish init database');
      console.log('start to render the page');
      functionToRun;
      console.log('finish rendering the page');
    });
  }
  else {
    if(!(sessionStorage.getItem('session-active'))){
      setSessionActiveStatus();
      console.log('renew the on service database')
      copyNewDbToOnServiceDb();
    }
    functionToRun;
    console.log('start to render the page');
    console.log('start to fetch new top 250');
    getTop250();
  }
}

function writeDbToStorage() {
  localStorage.setItem('newTop250', JSON.stringify(newTop250Db));
}

function copyNewDbToOnServiceDb() {
  localStorage.setItem('onServiceTop250', localStorage.getItem('newTop250'));
}

function setSessionActiveStatus() {
  sessionStorage.setItem('session-active', true);
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