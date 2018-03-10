let timerID = null;

self.onmessage = function (e) {
  if (e.data.interval) {
    console.log('starting');
    timerID = setInterval(() => { postMessage('step'); }, e.data.interval);
  } else if (e.data == 'stop') {
    console.log("stopping");
		clearInterval(timerID);
		timerID=null;
  }
};