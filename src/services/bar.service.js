import Bar from '@/models/Bar.model.js';
import cellSrvc from '@/services/cell.service.js';

export default {
  generateBar(acceptedValues, largerValues, signature, options) {
    // console.log('_GENERATING BAR_');
    // Amount of cells as large as 2 pulses (binary) or 3 pulses (ternary)
    let largerCellsRatio = 0.2; // to be set to 0.2 by default ?

    let bar = new Bar(acceptedValues, signature);
    let cellsList = [];
    let newCell;
    let nbBeats = options.ternary
      ? signature.numBeats / 3
      : signature.numBeats;

    let largeCellThreshold = options.ternary
      ? nbBeats - 3
      : nbBeats - 1

    for (let i = 0; i < nbBeats; i++) {
      if (largerCellsRatio && Math.random() <= largerCellsRatio && i < largeCellThreshold) {
        options.isLargeCell = true;
        // large cell
        const largeSignature = {
          numBeats: signature.numBeats,
          beatValue: signature.beatValue / 2
        };
        newCell = cellSrvc.generateCell(largerValues, largeSignature, options);
        i++;
      } else {
        options.isLargeCell = false;
        newCell = cellSrvc.generateCell(acceptedValues, signature, options);
      }
      newCell.values.forEach(note => {
        note.duration = acceptedValues.get(note.duration);
        // Randomly add rests
        if (options.rests && Math.random() <= options.restsRatio)
          note.duration = note.duration + 'r';
      });
      cellsList.push(newCell);
    }
    bar.cellsList = cellsList;
    return bar;
  },
};
