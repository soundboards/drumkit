import React from 'react';
import classNames from 'classnames';

import loops from 'data/loops';

import styles from './Sequencer.css';

const calculateInterval = (bpm) => ((60000 / bpm) * 4) / 8;
const nameMap = {
  kick: "Kick",
  snare: "Snare",
  openHat: "Open Hat",
  closedHat: "Closed Hat"
};

class Sequencer extends React.Component {
  constructor() {
    super();
    
    this.state = {
      bpm: 125,
      playing: false,
      paused: false,
      currentStep: -1,
      totalSteps: 16,
      sequence: {
        kick: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        snare: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        openHat: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        closedHat: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      }
    };
    
    this.timerWorker = new Worker('workers/scheduler');
    this.handleStep = this.handleStep.bind(this);
    this.playSequence = this.playSequence.bind(this);
    this.stopSequence = this.stopSequence.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
    this.renderInstrument = this.renderInstrument.bind(this);
  }


  /**
   * Receives messages from the timer in the service worker
   * Handles advancing steps in the sequencer
   * Updates the component currentStep state and reverts back to the beginning of the sequence
   * @param  {object} event data being received from the service worker
   */
  handleStep(event) {
    if (event.data === 'step') {
      if (this.state.currentStep < this.state.totalSteps - 1) {
        this.setState({ currentStep: this.state.currentStep + 1 })
      } else {
        this.setState({ currentStep: 0 })
      }
    }
  }

  /**
   * Calls the service worker to start the timer
   * Creates listener for receiving messages from the service worker
   */
  playSequence() {
    if (!this.state.playing) {
      const interval = calculateInterval(this.state.bpm);
      this.timerWorker.postMessage({ action: 'start', interval });
      
      this.timerWorker.onmessage = this.handleStep;
      this.setState({playing: true, paused: false});
    }
  }

  /**
   * Creates 
   * @param  {Boolean} [reset=true] [description]
   * @return {[type]}               [description]
   */
  stopSequence(reset = true) {
    if (this.state.playing) {
      this.timerWorker.postMessage('stop');
      this.setState({playing: false, paused: !reset});
      reset && this.setState({ currentStep: -1 });
    }
  }
  
  /**
   * Change the state of a step when button is clicked
   * Update component's state sequence
   * @param  {number} position position of the button clicked
   * @param  {string} key      the instrument key
   */
  onButtonClick(position, key) {
    const { sequence } = this.state;

    sequence[key][position] = (sequence[key][position] === 1) ? 0 : 1;
    this.setState(sequence);
  }

  /**
   * Render's instrument row and attaches click handler to buttons rendered
   *
   * @param  {string} key receives instrument key
   * @return {node}       returns JSX representation of the instrument
   */
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
    
    return (
      <div
        className="instrument"
        key={key}
      >
        <div className="instrument--name">
          <p className="instrument--name-text">{nameMap[key]}</p>
        </div>
        {instrumentButtons}
      </div>  
    );
  }
  
  /**
   * Renders the selector for the sequence
   * Receives data from imported loops
   * Changes the current sequence being played to the sequence selected
   * @return {node} options for sequences
   */
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
  
  /**
   * Renders control buttons
   * Attaches on click handler to buttons
   * Attaches active indicator
   * 
   * @return {[node]} returns buttons 
   */
  renderButtons() {
    const { playing, paused } = this.state;
    const buttons = [
      {
        label: 'play',
        name: '▶︎',
        indicator: playing,
        onClick: this.playSequence
      },
      {
        label: 'stop',
        name: '◼',
        indicator: !playing && !paused,
        onClick: this.stopSequence
      },
      {
        label: 'pause',
        name: '❚❚',
        indicator: paused,
        onClick: () => { this.stopSequence(false) } 
      }
    ];
    
    return buttons.map((btn, i) => (
      <button
        ariaLabel={btn.label} 
        className={classNames('control',
          { ['control--selected']: btn.indicator}
        )}
        key={`control-${i}`}
        onClick={btn.onClick}
      >
        {btn.name}
      </button>
    ));
  }

  render() {
    const { sequence } = this.state;
    const handleChange = (elem) => {
      const value = elem.target.value;

      if (isNaN(value)) {
        return 0;
      }

      const bpm = parseInt(value);
      const interval = calculateInterval(bpm);
      
      this.timerWorker.postMessage({ action: 'change', interval });
      this.setState({ bpm });
    }
    
    return (
      <div>
        {this.renderButtons()}
        <input
          className="control bpm-input"
          maxLength={3}
          onChange={handleChange}
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