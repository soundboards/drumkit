import React from 'react';
import classNames from 'classnames';

import loops from '../data/loops';

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
        openHat: [0,0,0,0,0,0,0,0],
        closedHat: [0,0,0,0,0,0,0,0],
      }
    };
    
    this.timerWorker = new Worker('../workers/scheduler');
    this.playSequence = this.playSequence.bind(this);
    this.pauseSequence = this.pauseSequence.bind(this);
    this.renderInstrument = this.renderInstrument.bind(this);
  }
  
  playSequence() {
    if (!this.state.playing) {
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
  
  pauseSequence() {
    if (this.state.playing) {
      this.timerWorker.postMessage('stop');
      this.setState({playing: false});
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
    
    return <div>{instrumentButtons}</div>
  }
  
  renderSequenceSelector() {
    const handleSelectorChange = (elem) => {
      const key = elem.target.value;
      const sequence = loops[key].sequence;
      this.setState({sequence});
    }
    
    const options = Object.keys(loops).map((key) => {
      return (
        <option value={key}>{loops[key].label}</option>
      )
    });
    return (
      <select onChange={handleSelectorChange}>
        {options}
      </select>
    );
  }

  render() {
    const { sequence } = this.state;
    const setBpm = (elem) => {
      // TODO error handling
      const bpm = parseInt(elem.target.value);
      const interval = calculateInterval(bpm);
      
      this.timerWorker.postMessage({ interval });
      this.setState({ bpm });
    }

    return (
      <div>
        <button
          className="control-buttons"
          onClick={this.playSequence}
        >
          Play
        </button>
        <button
          className="control-buttons"
          onClick={this.pauseSequence}
          >Pause
        </button>
        <input className="control-buttons" onBlur={setBpm} maxLength={10} />
        {this.renderSequenceSelector()}
        <div>
          {Object.keys(sequence).map((key) => this.renderInstrument(key))}
        </div>
      </div>
    )
  }
}

export default Sequencer;