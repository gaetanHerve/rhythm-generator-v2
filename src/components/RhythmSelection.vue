<template>

  <div id="timeSignature" class="option-element">
    <label for="numBeats" style="font-weight: bold;display: block; margin-top: 5px">Métrique : </label>
    <input
      type="number"
      id="numBeats"
      min="1"
      max="16"
      v-model="rhythmDataDTO.signature.numBeats"
      @change="changeSignature"
    />
    <label for="beatValue" style="font-weight: bold"> / </label>
    <select
      id="beatValue"
      v-model="rhythmDataDTO.signature.beatValue"
      @change="changeSignature"
      style="margin-left:5px"
    >
      <option
        v-for="beatValue in beatValues"
        :key="beatValue"
        :value="beatValue"
      >
        {{ beatValue }}
      </option>
    </select>
  </div>

  <!-- TERNARY -->
  <div v-show="ternaryByDefault" class="option-element">
    <input
      id="ternary"
      type="checkbox"
      v-model="rhythmDataDTO.options.ternary"
      @change="changeSignature"
    />
    <label for="ternary">ternaire</label>
  </div>
  
  <div class="option-element">
    <div id="numBars">
      <input
        id="numBars"
        v-model="rhythmDataDTO.numBars"
        @change="updateRhytmData"
        type="number"
        min="1"
        max="16"
      />
      <label for="numBars">mesures</label>
    </div>
  </div>

  <div class="option-element">
    <label style="font-weight: bold;display: block" for="minimalValue"> Valeur minimale : </label>
    <select
      id="minimalValue"
      v-model="rhythmDataDTO.options.minimalValue"
      @change="updateRhytmData"
    >
      <option
        v-for="minimalValue in minimalValues"
        :key="minimalValue"
        :value="minimalValue"
      >
      {{ durationsDict[minimalValue] }}
      </option>
    </select>
  </div>

  <hr>

  <div class="option-element">
    <input id="dots" type="checkbox" v-model="rhythmDataDTO.options.dots" />
    <label for="dots">notes pointées</label>
  </div>

  <div class="option-element">
    <input
      id="tuplets"
      type="checkbox"
      v-model="rhythmDataDTO.options.tuplets"
      @change="updateRhytmData"
    />
    <label for="tuplets" style="margin-right:5px"> {{ getTupletsStr }} </label>
    <label for="tupletsRatio"> {{ getTupletsPercentage }} </label>
  </div>

  <div class="option-element">
    <div class="slider-wrapper">
      <input
        id="tupletsRatio"
        type="range"
        class="form-range"
        v-model="rhythmDataDTO.options.tupletsRatio"
        @change="updateRhytmData"
        step="0.05"
        min="0"
        max="1"
      />
    </div>
  </div> 

  <div class="option-element">
    <input
      id="rests"
      type="checkbox"
      v-model="rhythmDataDTO.options.rests"
      @change="updateRhytmData"
    />
    <label for="rests" style="margin-right:5px"> Silences </label>
    <label for="restsRatio"> {{ getRestsPercentage }} </label>
  </div>

  <div class="option-element">
    <div class="slider-wrapper">
      <input
        id="restsRatio"
        type="range"
        class="form-range"
        v-model="rhythmDataDTO.options.restsRatio"
        @change="updateRhytmData"
        step="0.05"
        min="0"
        max="1"
      />
    </div>
  </div>

</template>

<script>
export default {
  name: 'RhythmSelection',
  emits: ["rhythmdatadto"],
  props: {
    rhythmData: Object
  },
  data() {
    return {
      rhythmDataDTO: this.rhythmData,
      beatValues: ['2', '4', '8', '16'],
      minimalValues: ['4', '8', '16', '32'],
      durationsDict : {
        1: 'ronde',
        2: 'blanche',
        4: 'noire',
        8: 'croche',
        16:'double',
        32:'triple',
      },
      ternaryByDefault: false,
    };
  },
  created() {
    this.setDefaultPulse();
  },
  methods: {
    updateRhytmData() {
      this.$emit("rhythmdatadto", this.rhythmDataDTO);
    },
    changeSignature() {
      this.adaptMinimalValue();
      this.setDefaultPulse();
      this.updateRhytmData();
    },
    adaptMinimalValue() {
      let value = this.rhythmDataDTO.signature.beatValue * 4;
      value = this.rhythmDataDTO.options.ternary  ? value / 2 : value;
      this.rhythmDataDTO.options.minimalValue = value <= 32 ? value : 32;
    },
    setDefaultPulse() {
      this.ternaryByDefault = this.isSignatureTernaryByDefault();
      if (!this.ternaryByDefault) {
        this.rhythmDataDTO.options.ternary = false;
      }
    },
    isSignatureTernaryByDefault() {
      return this.rhythmDataDTO.signature.numBeats % 3 == 0 && this.rhythmDataDTO.signature.beatValue == 8;
    },
  },
  computed: {
    getTupletsPercentage() {
      return Math.trunc(this.rhythmDataDTO.options.tupletsRatio * 100) + ' %';
    },
    getTupletsStr() {
      return this.rhythmDataDTO.options.ternary ? 'duolets' : 'triolets';
    },
    getRestsPercentage() {
      return Math.trunc(this.rhythmDataDTO.options.restsRatio * 100) + ' %';
    },
  }
};
</script>

<style scoped>
input[type='number'] {
  margin: 5px 5px 5px 0px;
  width: 50px;
}
input[type='checkbox'] {
  vertical-align: middle;
  align-content: start;
  margin-right: 5px;
}
.slider-wrapper {
  display: inline-block;
  width: 50%;
}
.option-element {
  text-align: left;
  margin-left: 5px;
  width: 180px;
}
.note-icons {
  font-family: "Musisync-KVLZ";
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

</style>
