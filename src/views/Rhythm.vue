<template>
  <div class="w3-container">
    <div>
      <div class="w3-half" style="width:225px">
        <img alt="logo" src="@/assets/logo_small2.png" class="img-fluid" />
      </div>
      <div>
        <button
          class="w3-btn w3-round w3-white w3-border w3-border-teal"
          @click="displayOptions"
        >
          {{ optBtnTxt }}
        </button>
      </div>
      
    </div>
    
      <div
        id="rythmSelectionSection"
        :class="optBtnClass"
        v-if="optVisible"
        style="width:225px"
      >
        <RhythmSelection
          :rhythmData="rhythmData"
          @rhythm-data-dto="(data) => rhythmData = data"
        /> 
      </div>

      <!-- <div
        id="displayComponent"
        v-bind:class="displayComponentWidth"
        style="margin:0px"
        v-bind:style="{ left:leftPos }"
      >
      v-bind:class="[optVisible ? 'col-9' : 'col-12']"
        <Score :rhythmData="rhythmData" />
      </div> -->

    </div>
</template>

<script>
// import Score from '@/components/Score.vue';
import RhythmSelection from '@/components/RhythmSelection.vue';

export default {
  name: 'Rhythm',
  components: {
    RhythmSelection,
    // Score,
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
      optBtnClass: 'w3-animate-top',
      displayComponentWidth: 'col-9',
      leftPos: '250px',
    };
  },
  methods: {
    //TODO : manage to get animation on sequence display
    displayOptions: function() {
      setTimeout(this.optionManager, 0);
    },
    optionManager: function() {
      this.optVisible = !this.optVisible;
      this.optBtnTxt = this.optVisible ? 'Masquer' : 'Options';
      this.optBtnClass = this.optVisible ? 'w3-animate-top' : 'w3-animate-right';
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

.option-element {
  min-width: 225px;
}
</style>
