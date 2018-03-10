import React from 'react';
import classNames from 'classnames';

class Sequencer extends React.Component {
  constructor() {
    super();
    
    this.state = {
      bpm: 120,
      playing: false,
      currentStep: 0,
      totalSteps: 8,
      sequence: {
        kick: [0,0,0,0,0,0,0,0],
        snare: [0,0,0,0,0,0,0,0],
        bass: [0,0,0,0,0,0,0,0],
      }
    };
    
    this.playSequence = this.playSequence.bind(this);
    this.renderInstrument = this.renderInstrument.bind(this);
  }
  
  playSequence() {
    if (this.state.playing) {
      this.setState({playing: false});
      // stop timer
    } else {
      //start timer
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

    return (
      <div>
        <button onClick={this.playSequence}>Play/Pause</button>
        <div>
          {Object.keys(sequence).map((key) => this.renderInstrument(key))}
        </div>
      </div>
    )
  }
}

export default Sequencer;