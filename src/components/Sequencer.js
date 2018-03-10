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

  render() {
    return (
      <div>
        <button onClick={this.playSequence}>Play/Pause</button>
        <div>
          
        </div>
      </div>
    )
  }
}

export default Sequencer;