let timerID = null;

self.onmessage = function (e) {
  if (e.data.interval) {
    if (timerID) {
      // if timer already exists
			clearInterval(timerID);
		}

    timerID = setInterval(() => { postMessage('step'); }, e.data.interval);
  } else if (e.data == 'stop') {
		clearInterval(timerID);
		timerID=null;
  }
};