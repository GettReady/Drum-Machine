const pads = [
  {
    key: "Q",
    name: "Heater-1",
    audioSource: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3"
  },
  {
    key: "W",
    name: "Heater-2",
    audioSource: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3"
  },
  {
    key: "E",
    name: "Heater-3",
    audioSource: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3"
  },
  {
    key: "A",
    name: "Heater-4",
    audioSource: "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3"
  },
  {
    key: "S",
    name: "Clap",
    audioSource: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3"
  },
  {
    key: "D",
    name: "Open-HH",
    audioSource: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3"
  },
  {
    key: "Z",
    name: "Kick-n-Hat",
    audioSource: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3"
  },
  {
    key: "X",
    name: "Kick",
    audioSource: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3"
  },
  {
    key: "C",
    name: "Closed-HH",
    audioSource: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3"
  }
]

const keySequence = ["Q", "W", "E", "A", "S", "D", "Z", "X", "C"];

// const angleUnit = 180 / 200;
const angleUnit = 270 / 200;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {mode: false, activePad: 'Pad Display', knobMousePos: 0, audioVolume: 0.5, playbackRate: 1};
  }

  componentDidMount() {    
    document.addEventListener('keydown', this.checkKeyPressed);
    // document.addEventListener('keyup', this.checkKeyPressed);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.checkKeyPressed);
    // document.removeEventListener('keyup', this.checkKeyPressed);
  }  

  playAudioByIndex = (index) => {    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    //    Large performance issues might appear here
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    let audio = new Audio(pads[index].audioSource);
    audio.volume = this.state.audioVolume;
    audio.playbackRate = this.state.playbackRate;
    // let audio = new Audio({ loop: false, volume: this.state.audioVolume, src: pads[index].audioSource });
    audio.play();    

    let element = document.getElementById('display').children[0];    
    element.style.animation = 'none';
    setTimeout(() => {element.style.animation = '';}, 50);
  }

  playAudioByKey = (key) => { 
    document.getElementById(String.fromCharCode(key)).play();
  }
  
  playTrack = () => {

  }

  keyAction = () => {

  }

  checkKeyPressed = (event) => {    
    if (event.repeat) return;
    let keyIndex = keySequence.indexOf(String.fromCharCode(event.keyCode));
    if (keyIndex >= 0) {
      this.playAudioByIndex(keyIndex);
      document.querySelector("#" + pads[keyIndex].name).classList.add("drum-pad-active");
      setTimeout(() => { document.querySelector("#" + pads[keyIndex].name).classList.remove("drum-pad-active"); }, 100)
      this.setState({ activePad: pads[keyIndex].name });
    }
  }

  checkPadClicked = (index) => {    
    this.playAudioByIndex(index);
    this.setState({activePad: pads[index].name});
  }

  volumeChange = (value) => {    
    let volume = Math.abs((value+100) / 200);
    volume = (Math.round(volume * 100) / 100).toFixed(2);
    this.setState({ audioVolume: volume,  activePad: 'Volume: ' + volume});
  }

  playbackChange = (value) => {
    let playbackRate = Math.abs((value+100) / 200) * 2;
    playbackRate = (Math.round(playbackRate * 100) / 100).toFixed(2);
    this.setState({ playbackRate: playbackRate,  activePad: 'Rate: ' + playbackRate});    
  }

  render() {    
    if (this.state.mode) {
      
    } else {
      return (
        <div id="drum-machine">
          <div id="pad">            
            {pads.map((item, i) => {
              return (
                <div className="drum-pad" id={item.name} key={i} onClick={() => this.checkPadClicked(i)}>
                  <span>{item.key}</span>
                  <audio id={item.key} className="clip" src={item.audioSource}></audio>
                </div>
              );
            })}
          </div>
          <div id="controls">   
            <div className="v-section">
              {/* <h2>Active pad display</h2> */}
              <div id="display">
                <span>{this.state.activePad}</span>              
              </div>              
            </div>
            <div className="h-section">
              <ControlKnob id="volume" callback = {this.volumeChange} />
              <ControlKnob id="rate" callback = {this.playbackChange} />
            </div>
            <h1>Drum Machine DS-12 <span title="V.2 (not)coming soon">V.1</span></h1>
          </div>
        </div>
      );
    }
  }
}

class ControlKnob extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mouseClickPos: 0,
      value: 0,
      rotation: 0
    };
  }

  knobDownHandler = (event) => {    
    let element = event.target;
    if (element.className == "knob") {      
      document.addEventListener('mousemove', this.knobRotation);
      document.addEventListener('mouseup', this.knobUpHandler);
      this.setState({ mouseClickPos: event.clientX });
    }    
    console.log('d');
  }  

  knobRotation = (event, element) => {
    let length = event.clientX - this.state.mouseClickPos;
    let value = Math.min(100, Math.max(-100, length + this.state.value));
    this.setState({ rotation: value * angleUnit });
    this.props.callback(value);
  }

  knobUpHandler = (event, func) => {
    let length = event.clientX - this.state.mouseClickPos;    
    let value = Math.min(100, Math.max(-100, length + this.state.value));    
    this.setState({ value: value });

    console.log('w');
    document.removeEventListener('mousemove', this.knobRotation);
    document.removeEventListener('mouseup', this.knobUpHandler);
  }

  render() {
    return (
      <div id={this.props.id} className="knob-wrapper">
        <div className="scale">
          <div className="knob-shadow"></div>          
          <div className="knob" onMouseDown={this.knobDownHandler} style={{ transform: 'rotate(' + this.state.rotation + 'deg)'}}>
            <div className="pointer"></div>
          </div>
          <div className="knob-header">{this.props.id}</div>
        </div>
      </div>
    );
  }
}


const container = document.getElementById("page-wrapper");
const root = ReactDOM.createRoot(container);
root.render(<App />);
