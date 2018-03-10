import React from 'react';
import classNames from 'classnames';

import styles from './Sequencer.css';

// Helper function
const calculateInterval = (bpm) => 60000 / bpm;

class Sequencer extends React.Component {
  constructor() {
    super();
    
    this.state = {
      bpm: 200,
      playing: false,
      currentStep: 0,
      totalSteps: 8,
      sequence: {
        kick: [0,0,0,0,0,0,0,0],
        snare: [0,0,0,0,0,0,0,0],
        bass: [0,0,0,0,0,0,0,0],
      }
    };
    
    this.timerWorker = new Worker('../workers/scheduler');
    this.playSequence = this.playSequence.bind(this);
    this.renderInstrument = this.renderInstrument.bind(this);
  }
  
  playSequence() {
    if (this.state.playing) {
      this.timerWorker.postMessage('stop');
      this.setState({playing: false});
    } else {
      const interval = calculateInterval(this.state.bpm);
      this.timerWorker.postMessage({ interval });
      
      this.timerWorker.onmessage = (e) => {
        if (e.data == 'step') {
          console.log('currentStep', this.state.currentStep);
          if (this.state.currentStep < this.state.totalSteps - 1) {
            this.setState({ currentStep: this.state.currentStep + 1 })
          } else {
            this.setState({ currentStep: 0 })
          }
        }
      }
      this.setState({playing: true});
    }
  }
  
  onButtonClick(position, key) {
    const { sequence } = this.state;
    // A better way to manipulate state
    sequence[key][position] = (sequence[key][position] === 1) ? 0 : 1;
    this.setState(sequence);
  }
  
  renderInstrument(key) {
    const instrumentButtons = this.state.sequence[key].map((buttonState, index) => {
      return (
        <button
          className={classNames({ test: this.state.currentStep === index })}
          key={index}
          onClick={this.onButtonClick.bind(this, index, key)}
        >
          {buttonState}
        </button>
      );
    });
    
    return <div>{instrumentButtons}</div>
  }
  
  render() {
    const { sequence } = this.state;
    const setBpm = (elem) => {
      
      // TODO error handling
      const bpm = parseInt(elem.target.value);
      this.setState({ bpm });
    }

    return (
      <div>
        <button onClick={this.playSequence}>Play/Pause</button>
        <input onBlur={setBpm} />
        <div>
          {Object.keys(sequence).map((key) => this.renderInstrument(key))}
        </div>
      </div>
    )
  }
}

export default Sequencer;