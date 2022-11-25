<template>
  <div class="w3-display-container">

    <div id="optSection" class="w3-display-topleft">
      <div>
        <button
          class="w3-btn w3-round w3-white w3-border w3-border-teal"
          @click="displayOptions"
        >
          {{ optBtnTxt }}
        </button>
      </div>

      <div v-show="optVisible" id="optPanelSection" class="w3-animate-left">
        <RhythmSelection
          :rhythmData="rhythmData"
          @rhythm-data-dto="(data) => rhythmData = data"
        /> 
      </div>
    </div>

    <div id="scoreSection" class="w3-middle">
      <Score :rhythmData="rhythmData" />
    </div>

  </div>
</template>

<script>
import Score from '@/components/Score.vue';
import RhythmSelection from '@/components/RhythmSelection.vue';

export default {
  name: 'Rhythm',
  components: {
    RhythmSelection,
    Score,
  },
  props: {
    tupletsTest: Boolean,
  },
  data() {
    return {
      rhythmData: {
        signature: {
          numBeats: 4,
          beatValue: 4,
        },
        options: {
          dots: true,
          tuplets: true,
          tupletsRatio: '0.1',
          minimalValue: 16,
          ternary: false,
          rests: true,
          restsRatio: '0.1',
        },
        numBars: '16',
      },
      optVisible: false,
      optBtnTxt: 'Options',
    };
  },
  methods: {
    displayOptions() {
      this.optVisible = !this.optVisible;
      this.optBtnTxt = this.optVisible ? 'Masquer' : 'Options';
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
#optPanelSection {
  max-width: 225px;
  margin-top: 5px;
}

#optSection {
  margin-left: 15px;
  text-align: left;
}

.inlineDisplay {
  display: inline-block;
}
input[type='number'] {
  margin: 5px;
  width: 50px;
}
input[type='checkbox'] {
  margin-right: 5px;
}
input[type='checkbox'] {
  vertical-align: middle;
}
.slider-wrapper {
  display: inline-block;
  width: 50%;
  height: 150px;
  padding: 0;
}
</style>
