<template>

  <div id="displaySection" style="margin: 15px"></div>

</template>

<script>
import { Vex } from 'vexflow';
import vexSrvc from '@/services/vex.service.js';
import TimeSignature from '@/models/TimeSignature.model.js';
import sequenceSrvc from '@/services/sequence.service.js';

const { Renderer } = Vex.Flow;

export default {
  name: 'Score',
  props: {
    rhythmData: Object,
    newSequence: Boolean,
    windowDims: Object,
  },
  data() {
    return {
      barWidth: 400,
      nbBarsPerLine: 1,
      sizeReduction: 20,
      sequence: null,
      signature: null,
    };
  },
  watch: {
    newSequence() {
      this.generateSequence();
      this.display(this.sequence);
    },
    windowDims() {
      if (this.sequence) {
        this.clearBox("displaySection");
        this.display(this.sequence);
      }
    },
  },
  methods: {
    generateSequence() {
      this.signature = new TimeSignature();
      this.signature.numBeats = this.rhythmData.signature.numBeats;
      this.signature.beatValue = this.rhythmData.signature.beatValue;
      let minimalValue = this.rhythmData.options.minimalValue;
      this.sequence = sequenceSrvc.generateSequence(
        minimalValue,
        this.signature,
        this.rhythmData.numBars,
        this.rhythmData.options
      );
    },
    display(sequence) {
      this.clearBox('displaySection');
      this.adaptBarWidth(this.windowDims, this.sizeReduction);
      this.setDisplaySection();
      
      const displayDivs = document.getElementsByClassName("displayLine");
      let div;
      let renderer;
      let context;
      let position;
      let displayIndex = 0;
      let displaySignature;
      sequence.barsList.forEach((bar, index) => {
        index === 0 ? (position = 0) : (position += this.barWidth);
        div = displayDivs[displayIndex];
        if (index % this.nbBarsPerLine === 0) {
          position = 0;
          displaySignature = true;
          // Create an SVG renderer and attach it to a DIV element
          renderer = new Renderer(div, Renderer.Backends.SVG);
          // Size our SVG:
          renderer.resize(this.windowDims.width, 100); // initial value: 200
          // And get a drawing context:
          context = renderer.getContext();
          displayIndex++;
        }

        // change rendrer div to display in new lines
        renderer.element = displayDivs[displayIndex];
        
        var stave = vexSrvc.getConfiguredStave(
          Vex.Flow,
          this.signature,
          position,
          this.barWidth,
          index,
          displaySignature
        );
        
        displaySignature = false;
        let formattedNotes = vexSrvc.getFormattedNotes(Vex.Flow, bar, this.rhythmData.options);
        // Connect it to the rendering context and draw!
        stave.setContext(context).draw();
        // Render the notes followed by the beams and tuplets
        Vex.Flow.Formatter.FormatAndDraw(
          context,
          stave,
          formattedNotes.allNotes
        );
        formattedNotes.beams.forEach(beam => {
          beam.setContext(context).draw();
        });
        if (formattedNotes.tuplets.length > 0) {
          formattedNotes.tuplets.forEach(tuplet => {
            tuplet.setContext(context).draw();
          });
        }
      });
      this.$emit('sequenceGenerated', true);
    },
    setDisplaySection() {
      // Generating divs for displaying sequence
      let parentDiv = document.getElementById("displaySection");
      let nbLines = this.rhythmData.numBars / this.nbBarsPerLine;
      for(let i = 0; i < nbLines; i++) {
        let newDiv = document.createElement('div');
        newDiv.className = 'displayLine';
        newDiv.style = "align-content:start";
        parentDiv.appendChild(newDiv);
      }
    },
    adaptBarWidth(wDims, sizeReduction) {
      let options = this.rhythmData.options; 
      let signature = this.rhythmData.signature;
      let signatureFactor = Math.sqrt(((1 / signature.beatValue) * signature.numBeats * (options.minimalValue / 4)) / 4);
      let sizeRange = wDims.width < 600 ? 1 : wDims.width < 1200 ? 2 : 4;
      let reducedWidth = wDims.width - (wDims.width * sizeReduction/100);
      this.barWidth = reducedWidth / sizeRange * signatureFactor;
      this.nbBarsPerLine = Math.trunc(reducedWidth / this.barWidth);
      this.nbBarsPerLine < 1 ? this.nbBarsPerLine = 1 : null;
    },
    clearBox(elementID) {
      document.getElementById(elementID).innerHTML = '';
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

/* @font-face {
  font-family: "Musisync-KVLZ";
  src: local("Musisync-KVLZ"),   url(./fonts/Musisync/Musisync-KVLZ.ttf) format("truetype");
} */
</style>
