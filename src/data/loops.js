export default {
  fouronfloor: {
    label: "four on the floor",
    sequence: {
      kick: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
      snare: [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
      openHat: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      closedHat: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    }
  },
  notfouronfloor: {
    label: "not four on the floor",
    sequence: {
      kick: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      snare: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      openHat: [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
      closedHat: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0]
    }
  }
};