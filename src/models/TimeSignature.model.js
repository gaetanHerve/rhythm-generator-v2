export default class TimeSignature {
  constructor(numBeats, beatValue) {
    this.numBeats = numBeats;
    this.beatValue = beatValue;
  }
  toString() {
    return this.numBeats + '/' + this.beatValue;
  }
}
