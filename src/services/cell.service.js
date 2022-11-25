import Cell from '@/models/Cell.model.js';
import Note from '@/models/Note.model.js';

export default {
  tmpValues: [],
  generateCell(acceptedValues, signature, options) {
    // console.log('__GENERATING CELL');
    let cell = new Cell();
    let cellDuration;
    let beatValue = signature.beatValue;

    if (options.ternary) {
      cellDuration = 1.5;
      beatValue = beatValue / 2;
    } else {
      cellDuration = 1;
    }
    let tuplet = (options.tuplets && Math.random() <= options.tupletsRatio)
    cell.values = [];

    if (tuplet) {
      cell.isTuplet = true;
      cell.tupletNbNotes = options.ternary
        ? 2
        : 3;
      let tupletElemDuration = options.ternary
        ? parseInt(signature.beatValue)
        : parseInt(signature.beatValue) * 2;
      for (let i = 0; i < cell.tupletNbNotes; i++) {
        cell.values.push(new Note('B/4', tupletElemDuration));
      }
    } else {
      this.tmpValues = [...acceptedValues.keys()];
      let tmpDuration;
      while (!this.isCellComplete(cell.values, beatValue, cellDuration)) {
        tmpDuration = this.getNewValue(this.tmpValues);
        let note = new Note('B/4', tmpDuration);
        cell.values.push(note);
        // console.log('newNote: ', note);
      }
      this.tmpValues = [...acceptedValues.keys()];
    }
    let filteredValues = cell.values.filter(
      values => values.duration != undefined
    );
    cell.values = filteredValues;
    // console.log('cell.values: ', cell.values);
    return cell;
  },

  getNewValue() {
    let randomDuration = this.tmpValues[
      Math.trunc(Math.random() * this.tmpValues.length)
    ];
    return randomDuration;
  },

  isCellComplete(values, beatValue, cellDuration) {
    let result = false;
    let sum = 0;
    values.forEach((element, index) => {
      sum += (1 / element.duration) * beatValue;
      if (sum >= cellDuration || index > 12) {
        result = true;
      }
    });
    // console.log('sum in isCellComplete: ', sum, ' / ', cellDuration);
    this.tmpValues = this.tmpValues.filter(
      value => (1 / value) * beatValue <= cellDuration - sum
    );
    return result;
  },
};
