const CHANGE = `change`;
const START = `start`;
const STEP = `step`;
const STOP = `stop`;

let timerID = null;

self.onmessage = function (e) {
  if (e.data.interval) {
    if (timerID || e.data.action == START) {
      timerID && clearInterval(timerID);
      timerID = setInterval(() => { postMessage(STEP); }, e.data.interval);
    }
    
  } else if (e.data == STOP) {
		clearInterval(timerID);
		timerID=null;
  }
};