const START = 'start';
const STOP = 'stop';
const CHANGE = 'change';

let timerID = null;

self.onmessage = function (e) {
  if (e.data.interval) {
    if (timerID || e.data.action == START) {
      timerID && clearInterval(timerID);
      timerID = setInterval(() => { postMessage('step'); }, e.data.interval);
    }
    
  } else if (e.data == STOP) {
		clearInterval(timerID);
		timerID=null;
  }
};