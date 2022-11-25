import { Dot } from "vexflow";

export default {
  simpleValues: [1, 2, 4, 8, 16, 32, 64],
  dottedValues: [0.6666666666666666, 1.3333333333333333, 2.6666666666666665, 5.333333333333333, 10.666666666666666, 21.333333333333332, 42.666666666666664],
  getConfiguredStave(VexFlowInstance, signature, position, barWidth, barIndex, displaySignature) {
    // Create a stave at position position, 0 of width barWidth on the canvas.
    var stave = new VexFlowInstance.Stave(position, 0, barWidth);
    // Add time signature.
    if (displaySignature)
      stave.addTimeSignature(signature.toString());

    stave.options.right_bar = false;
    stave.options.left_bar = false;

    // Mask all lines except the one in the middle
    stave.options.line_config.forEach((item, index) => {
      index === 2 ? (item.visible = true) : (item.visible = false);
    });
    return stave;
  },

  getFormattedNotes(VexFlowInstance, bar, options) {
    let beams = [];
    let tuplets = [];
    let cellNotes = [];
    let allNotes = [];
    let restsConcatenationResult;
    bar.cellsList.forEach((cell, cellIndex) => {
      cellNotes = [];
      let noteToAdd;
      let duration;
      cell.values.forEach(cellValue => {
        duration = cellValue.duration.toString();
        noteToAdd = new VexFlowInstance.StaveNote({
          clef: 'treble',
          keys: [cellValue.key],
          duration: duration,
        });
        if (duration.includes('d'))
          Dot.buildAndAttach([noteToAdd], {all: true})
          // noteToAdd.addDot(0);

        cellNotes.push(noteToAdd);
      });
     
      restsConcatenationResult = this.concatenateRests(cellNotes, VexFlowInstance, cell.isTuplet, bar.signature, options.ternary);
      if (cell.isTuplet) {
        cell.isTuplet = restsConcatenationResult.options.isTuplet;
      }
      cellNotes = restsConcatenationResult.cellNotes;
      let noteGroupsToBeam = this.getElemsToBeam(cellNotes);
      noteGroupsToBeam.forEach(noteGroup => {
        beams.push(new VexFlowInstance.Beam(noteGroup));
      });

      cellIndex === 0
        ? allNotes.push(cellNotes)
        : (allNotes = allNotes.concat(cellNotes));
      if (cell.isTuplet) {
        tuplets.push(new VexFlowInstance.Tuplet(cellNotes, {num_notes: cell.tupletNbNotes}));
      }
    });
    allNotes = allNotes.flat();
    return {tuplets: tuplets, allNotes: allNotes, beams: beams};
  },

  getElemsToBeam(vfNotes) {
    let beamedGroupsList = [];
    let beamedGroup = [];
    
    vfNotes.forEach( (vfNote, index) => {
      let surroundedByBeams = (
        (vfNotes[index - 1] && vfNotes[index + 1])
          && ((vfNotes[index - 1].intrinsicTicks < 4096) && !vfNotes[index - 1].isRest())
          && ((vfNotes[index + 1].intrinsicTicks < 4096) && !vfNotes[index - 1].isRest())
        )
          ? true
          : false;

      // check if both previous and next notes are to be beamed. In this case, rest has to be beamed either 
      if(vfNote.intrinsicTicks < 4096 && (!vfNote.isRest() || surroundedByBeams )) {
        beamedGroup.push(vfNote);
      } else {
        beamedGroup.length > 1 ? beamedGroupsList.push(beamedGroup) : null;
        beamedGroup = [];
      }
    });
    beamedGroup.length > 1 ? beamedGroupsList.push(beamedGroup) : null;
    return beamedGroupsList;
  },

  concatenateRests(vfNotesArray, VF, isTuplet, signature, ternary) {
    let i = 0;
    let restsIndexes = [];
    let options = {isTuplet: isTuplet, numNotes: 0};
    while(vfNotesArray[i]) {
      let totalRestDuration = 0;
      // inverser if et else ?
      if (vfNotesArray[i] && vfNotesArray[i].isRest()) {
        // It's a rest, let's check how many there are in a row
        restsIndexes = [];
        while(vfNotesArray[i] && vfNotesArray[i].isRest()) {
          restsIndexes.push(i);
          totalRestDuration += vfNotesArray[i].intrinsicTicks;
          i++;
        }
        
        // if nbElemsTomodify > 1, create note with totalRestDuration to replace original notes
        if (restsIndexes.length > 1) {
          // Modify first rest with totalRestDuration
          let durationFromTicks = this.ticksToDuration(totalRestDuration);
          totalRestDuration = durationFromTicks.value;

          //DEBUG
          let restDurationArray = [];
          if (!durationFromTicks.referenced) {
            restDurationArray = this.breakDownDuration(totalRestDuration);
            console.log('restDurationArray: ', restDurationArray);
          } else {
            restDurationArray.push(totalRestDuration);
          }
          restDurationArray.forEach( (duration, index) => {
            // TODO: Check if this works and if this is usefull
            if (this.dottedValues.includes(duration/*.toString()*/)) {
              console.error('in dottedValues');
              duration += 'd';
            }
            duration += 'r';
            vfNotesArray[restsIndexes[index]].duration = duration;
            let newNote = new VF.StaveNote({
              clef: 'treble',
              keys: ['B/4'],
              duration: duration,
            });

            // ICI => semble être appliqué parfois pas pour les bons cas
            if (!isTuplet && durationFromTicks.dotted) {
              console.error('adding dot');
              console.log(newNote.duration);
              // newNote.addDot(0);
              Dot.buildAndAttach([newNote], {all: true})
              console.log('newNote.duration: ', newNote.duration);
            }
            
            // delete next restNotes
            //ICI => OK on dirait. Pas sûr
            // si not a referenced value, nTodelete += 1 ?
            
            let nbElemsToDelete = (index === restDurationArray.length - 1)
              ? restsIndexes.length - index
              : 0;

            /* if (!durationFromTicks.referenced && vfNotesArray[vfNotesArray.length - 1].isRest()) {
              // seulement si dernier élément isRest()
              nbElemsToDelete += 1;
            } */
            
            // Remplacer l'ensemble de taille nbElemsToDelete des notes à partir de l'index du premier silence dans vfNotesArray par la nouvelle note
            // DEBUG SECTION
            if (!durationFromTicks.referenced) {
              let notesBeforeSplice = vfNotesArray.map( note => {
                return {duration: note.intrinsicTicks, isRest: note.isRest()};
              });
              console.log('vfNotesArray durations before splice: ');
              notesBeforeSplice.forEach( note => {
                console.log(note);
              });
            }
            /////

            vfNotesArray.splice(restsIndexes[index], nbElemsToDelete, newNote);
            console.log('vfNotesArray: ', vfNotesArray);

            // TODO: ajout fonction pour remplir la mesure et retirer éléments en trop
            let newVfNotesArray = [];
            let isComplete = false;
            let sumDurations = 0;
            let actualDuration;

            let barDuration = ternary
              ? this.durationToTicks(signature.beatValue) * 3
              : this.durationToTicks(signature.beatValue);

              // POSE PROBLEME DANS LE CAS D'UN SOUPIR ENTIER EN TERNAIRE
            if(isTuplet) {
              barDuration *= 2/3;
            }

            let i = 0;
            while(!isComplete && i < vfNotesArray.length) {
              newVfNotesArray.push(vfNotesArray[i]);
              actualDuration = vfNotesArray[i].isDotted()
                ? vfNotesArray[i].intrinsicTicks * 3/2
                : vfNotesArray[i].intrinsicTicks
              sumDurations += actualDuration;
              console.log('barDuration: ', sumDurations , ' / ', barDuration);
              if (sumDurations === barDuration) {
                isComplete = true;
              }
              i++;
            }
            
            if(sumDurations < barDuration) {
              let noteDuration = this.ticksToDuration(barDuration - sumDurations).value;
              console.error('adding note of duration ', noteDuration);
              newVfNotesArray.push(
                new VF.StaveNote({
                  clef: 'treble',
                  keys: ['B/4'],
                  duration: noteDuration.toString(),
                })
              )
            }

            vfNotesArray = newVfNotesArray;
            


            // DEBUG SECTION
            if (!durationFromTicks.referenced) {
              let notesAfterSplice = vfNotesArray.map( note => {
                let duration = note.isDotted()
                  ? note.intrinsicTicks * 3 / 2
                  : note.intrinsicTicks;
  
                return {duration: duration, isRest: note.isRest()};
              });
              console.log('vfNotesArray durations after splice: ');
              notesAfterSplice.forEach( note => {
                console.log(note);
              });
            }
            /////
          });
        }

      } else {
        // not a rest, continue
        i ++;
      }
    }
    let allRests = true;
    vfNotesArray.forEach( vfNote => {
      if (!vfNote.isRest()) {
        allRests = false;
      }
    });

    if (allRests && ternary && vfNotesArray.length === 1 && !vfNotesArray[0].isDotted()) {
      console.log(vfNotesArray[0]);
      vfNotesArray[0].addDot(0);
    }


    options.isTuplet = isTuplet && !allRests;
    return {cellNotes: vfNotesArray, options: options};
  },

  sumDurations(array) {
    let result;
    result = array.reduce(function(accumulator, currentValue) {
      return accumulator + currentValue;
    });
    return result;
  },
  
  getTotalDuration(notesSequence) {
    let result = 0;
    notesSequence.forEach( note => {
        result += note.intrinsicTicks;
      });
      return result;
  },

  ticksToDuration(ticksValue) {
    let result;
    let referenced = true;
    let dotted = false;
    let duration = (1 / ticksValue) * 16384;
    if (this.simpleValues.includes(duration)) {
      // regular duration => line to be removed
      duration = duration * 1;
    } else if (this.dottedValues.includes(duration)) {
      // dotted duration
      // rounded to avoid artefacts
      duration = Math.round(duration * (3 / 2) * 100) / 100;
      dotted = true;

    } else {
      // Gérer le cas des durées cumulées ne correspondant pas à une valeur existante (ex: 3072ticks (croche pointée) + 6144ticks (noire pointée))
      console.error(duration, ' is not a referenced value');
      referenced = false;
    }
    result = {value: duration, referenced: referenced, dotted: dotted};
    return result;
  },

  durationToTicks(duration) {
    let result = 1 / (duration / 16384);
    return result;
  },

  breakDownDuration(duration) {
    let result = [];
    let ticks = this.durationToTicks(duration);
    console.log('ticks for duration ', duration, ': ', ticks);
    let simpleTicksValues = this.simpleValues.map( value => this.durationToTicks(value));
    // let dottedTicksValues = this.dottedValues.map( value => this.durationToTicks(value));
    // console.log('simpleTicksValues: ', simpleTicksValues, ' / dottedTicksValues: ', dottedTicksValues);
    let closestSimplevalue = this.getClosestNumberInArray(ticks, simpleTicksValues);
    result.push(this.ticksToDuration(closestSimplevalue).value);
    let lastingValue = ticks - closestSimplevalue;
    result.push(this.ticksToDuration(lastingValue).value);
    console.log('closestNb: ', closestSimplevalue, ' / lastingValue: ', lastingValue);
    return result;
  },

  getClosestNumberInArray(number, array) {
    return array.filter( elem => elem <= number).reduce((a, b) => {
      return Math.abs(b - number) < Math.abs(a - number) ? b : a;
    });
  },
};
