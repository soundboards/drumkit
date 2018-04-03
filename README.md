# Getting Started
Min Requirements: 

* Node 8.1.3
* npm / yarn
* gulp

## Running local server
1. Run gulp on terminal

```shell
$ cd drumkit 
$ gulp
```

2. You will be redirected to the local server, or alternatively navigate to to http://localhost:3000

## Front-end tools 
* Gulp + Webpack
* React
* CSS

I chose *React* because given the time constraint it was the easiest way I could find myself being productive and getting something on the page really quickly.

The Gulp + webpack configuration is just a basic configuration I use when I start any coding projects. It’s a good way to get started using babel, react, jsx and browser-sync features as well.

## App Data
The app has it’s own local state that contains data that the sequencer utilizes to display the sequencer. However, unlike a finite state machine the sequencer doesn’t really have it’s “one” state that it’s in depending on certain user actions. The sequencer object that represents the data I chose to represent the sequencer with an object with an array of 1s and 0s. 

```js
{
	kick: [1,0,1,0,1,0],
	snare: [1,0,1,0,1,0]
}
```

For the selection of existing sequences I chose an object containing the name of the sequence and the actual sequence data itself. I chose an object instead of an array because it’s quicker to look it up later versus filtering an array of objects.
```js
{
	key: {
		label: '',
		sequence: { ... }
	}
}
```

## Timing model
To handle the timing of the drum machine I’m using a web worker runs an timer that sends a message to the drum machine to go the the steps in the sequence. 

The web worker runs `setInterval`  and it calls `postMessage` that gets called based on the interval that gets passed.

```js
if (timerID || e.data.action == START) {
	timerID && clearInterval(timerID);
	timerID = setInterval(() => { postMessage(STEP); }, e.data.interval);
}
```

Code that is attached to the `onMessage` event and handles the stepping through the sequence 
```js
handleStep(event) {
	if (event.data === 'step') {
		if (this.state.currentStep < this.state.totalSteps - 1) {
			this.setState({ currentStep: this.state.currentStep + 1 })
		} else {
			this.setState({ currentStep: 0 })
		}
	}
}
```

I think the best way to deal with anything related to audio is to use threads but since JS is single thread using web workers is a a way to get around this.

I learned this technique from reading [A Tale of Two Clocks - Scheduling Web Audio with Precision](https://www.html5rocks.com/en/tutorials/audio/scheduling/). It was a fascinating read and I learned a lot about scheduling and queueing notes in web audio. I could’ve easily just done `setInterval` in the sequencer but I chose running it in a web worker because it runs in the background independently and it will prevent drifts when switching doing things like switching through different tabs. 