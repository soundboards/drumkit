export default {
  fouronfloor: {
    label: "Four on the floor",
    sequence: {
      kick: [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
      snare: [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
      openHat: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      closedHat: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    }
  },
  notfouronfloor: {
    label: "Not four on the floor",
    sequence: {
      kick: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      snare: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      openHat: [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
      closedHat: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0]
    }
  },
  wowmusic: {
    label: "Wow Music",
    sequence: {
      kick: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      snare: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      openHat: [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
      closedHat: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0]
    }
  }
};