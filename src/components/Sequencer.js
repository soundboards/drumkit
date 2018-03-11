import React from 'react';
import classNames from 'classnames';

import loops from '../data/loops';

import styles from './Sequencer.css';


// Helper function
const calculateInterval = (bpm) => ((60000 / bpm) * 4) / 8;

class Sequencer extends React.Component {
  constructor() {
    super();
    
    this.state = {
      bpm: 125,
      playing: false,
      currentStep: -1,
      totalSteps: 16,
      sequence: {
        kick: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        snare: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        openHat: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        closedHat: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      }
    };
    
    this.timerWorker = new Worker('../workers/scheduler');
    this.playSequence = this.playSequence.bind(this);
    this.stopSequence = this.stopSequence.bind(this);
    this.renderInstrument = this.renderInstrument.bind(this);
  }
  
  playSequence() {
    if (!this.state.playing) {
      const interval = calculateInterval(this.state.bpm);
      this.timerWorker.postMessage({ action: 'start', interval });
      
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
  
  stopSequence(reset = true) {
    if (this.state.playing) {
      this.timerWorker.postMessage('stop');
      this.setState({playing: false});
      reset && this.setState({currentStep: -1});
    }
  }
  
  
  onButtonClick(position, key) {
    const { sequence } = this.state;
    // A better way to manipulate state
    sequence[key][position] = (sequence[key][position] === 1) ? 0 : 1;
    this.setState(sequence);
  }
  
  renderInstrument(key) {
    const { sequence } = this.state;
    const instrumentButtons = sequence[key].map((buttonState, index) => {
      return (
        <button
          className={classNames('sequence-button',
            { ['sequence-button--seq']: this.state.currentStep === index },
            { ['sequence-button--selected']: sequence[key][index] === 1}
          )}
          key={index}
          onClick={this.onButtonClick.bind(this, index, key)}
        >
        </button>
      );
    });
    
    return <div key={key}>{instrumentButtons}</div>
  }
  
  renderSequenceSelector() {
    const handleSelectorChange = (elem) => {
      if (elem.target.value === "") {
        return;
      }
      const key = elem.target.value;
      const sequence = loops[key].sequence;
      this.setState({sequence});
    }
    
    const options = Object.keys(loops).map((seq) => {
      return (
        <option
          key={seq}
          value={seq}
        >
          {loops[seq].label}
        </option>
      )
    });
    return (
      <select
        className="control"
        onChange={handleSelectorChange}>
        <option value="">Select Sequence</option>
        {options}
      </select>
    );
  }

  render() {
    const { sequence } = this.state;
    const setBpm = (elem) => {
      const value = elem.target.value;

      if (isNaN(value)) {
        return;
      }

      const bpm = parseInt(value);
      const interval = calculateInterval(bpm);
      
      this.timerWorker.postMessage({ action: 'change', interval });
      this.setState({ bpm });
    }

    return (
      <div>
        <button
          className={classNames('control',
            { ['control--selected']: this.state.playing}
          )}
          onClick={this.playSequence}
        >
          ▶︎
        </button>
        <button
          className="control"
          onClick={this.stopSequence}
        >
          ◼
        </button>
        <button
          className="control"
          onClick={() => { this.stopSequence(false) }}
        >
          ❚❚
        </button>
        <input
          className="control bpm-input"
          maxLength={3}
          onChange={setBpm}
          value={this.state.bpm}
        />
        {this.renderSequenceSelector()}
        <div>
          {Object.keys(sequence).map((key) => this.renderInstrument(key))}
        </div>
      </div>
    )
  }
}

export default Sequencer;