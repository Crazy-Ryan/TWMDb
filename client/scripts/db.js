let localStorage = window.localStorage;
let newTop250Db = [];

function getTop250() {
  get250Interval(1, 101);
  get250Interval(101, 201);
  get250Interval(201, 250);
};

function get250Interval(start, end) {
  let BASIC_URL = 'http://127.0.0.1:8888';
  let AJAXSetup = {
    url: `${BASIC_URL}/v2/movie/top250?start=${start - 1}&count=${end - start + 1}`,
    method: 'GET',
    success: function (result) {
      newTop250Db = newTop250Db.concat(result.subjects);
      writeTop250ToStorage();
    }
  }
  AJAXHandle(AJAXSetup);
}

function writeTop250ToStorage(){
  if (250 === newTop250Db.length){
    localStorage.setItem('newTop250',JSON.stringify(newTop250Db));
  }
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