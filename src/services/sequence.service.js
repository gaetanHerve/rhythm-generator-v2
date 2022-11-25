import Sequence from '@/models/Sequence.model.js';
import barSrvc from '@/services/bar.service.js';

export default {
  simpleValues: [1, 2, 4, 8, 16, 32, 64],
  generateSequence(minimalValue, signature, numBars, options) {
    console.log('GENERATING SEQUENCE__');
    let sequence = new Sequence(minimalValue, signature, numBars, options);
    let barsList = [];
    let newBar;
    let acceptedValues = this.getAcceptedValues(minimalValue, signature);
    let largerValues = new Map(
      [...acceptedValues]
      .filter(([key]) => key <= signature.beatValue * 2)
    );
    // console.log('largerValues: ', largerValues);
    if (options.dots) {
      acceptedValues = this.generateDottedDurations(acceptedValues);
      largerValues = this.generateDottedDurations(largerValues);
    }
    // console.log('largerValues: ', largerValues);
    for (let i = 0; i < numBars; i++) {
      newBar = barSrvc.generateBar(acceptedValues, largerValues, signature, options);
      // console.log('__GENERATING BAR', i+1, ': ', newBar);
      barsList.push(newBar);
    }
    sequence.barsList = barsList;
    // console.log(barsList);
    return sequence;
  },

  getAcceptedValues(minimalValue, signature) {
    let result = new Map();
    this.simpleValues.forEach(value => {
      if (value <= minimalValue && value >= signature.beatValue) {
        result.set(value, value.toString());
      }
    });
    return result;
  },

  generateDottedDurations(values) {
    let maxValue = Math.max(...values.values());
    values.forEach((value, index) => {
      if (index !== 0) values.set(value * (2 / 3), value + 'd');
    });
    values.delete(maxValue * (2 / 3));
    values.delete(NaN);
    return values;
  },
};
