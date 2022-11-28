<template>
  <div class="w3-row">
    <div id="showOptions" class="w3-col m2">
        <button
          class="w3-btn w3-round w3-white w3-border w3-border-teal"
          @click="displayOptions"
        > {{ optBtnTxt }} </button>
    </div>

    <div id="logoSection" class="w3-col m6">
      <img alt="logo" src="@/assets/logo_small2.png" style="width:200px" />
    </div>

    <div id="generate" class="w3-col m2">
      <button
        class="w3-btn w3-round w3-teal"
        @click="newSequence=true"
      > Générer </button>
    </div>
  </div>

  <div class="w3-row">
    <div v-show="optVisible" id="optPanelSection" class="w3-sidebar w3-card-2 w3-bar-block w3-animate-left">
      <RhythmSelection :rhythmData="rhythmData" @rhythmdatadto="(data) => rhythmData = data" />
    </div>

    <div id="scoreSection">
      <Score
        :rhythmData="rhythmData"
        :newSequence="newSequence"
        :windowDims="windowDims"
        @sequence-generated="newSequence = false"
      />
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
      newSequence: false,
      windowDims: null,
    };
  },
  created() {
    this.windowDims = this.getWindowDims();
    window.addEventListener('resize', () => {
      this.windowDims = this.getWindowDims();
    });
  },
  methods: {
    displayOptions() {
      this.optVisible = !this.optVisible;
      this.optBtnTxt = this.optVisible ? 'Masquer' : 'Options';
    },
    getWindowDims() {
      const width =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      const height =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
      return {width: width, height: height};
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#optPanelSection {
  width: 200px;
  height: 350px;
  margin-left: 15px;
}
#showOptions, #logoSection #generate #scoreSection {
  margin: 15px;
}
#logoSection {
  text-align: center;
}
#showOptions {
  text-align: left;
  margin-top: 0px;
}
#generate {
  text-align: right;
}
</style>
