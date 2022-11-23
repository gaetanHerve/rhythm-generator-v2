<template>
  <div class="Rhythm container">
    <button @click="logRhythmData">log rhythmData</button>
    <div class="row">
      <div class="col-2 option-element mb-2 mt-2" style="width:225px">
        <img alt="logo" src="../assets/logo_small2.png" class="img-fluid" />
      </div>
      <div class="col-2">
        <button
          class="btn btn-light btn-circle btn-lg"
          v-on:click="displayOptions"
          style="margin:10px"
        >
        <span class="glyphicon glyphicon-cog"></span>
          <!-- {{ optBtnTxt }} -->
        </button>
      </div>
      
    </div>
    
    <div class="row">
      <transition name="fade">
        <div
          id="selectionComponent"
          class="col-3"
          v-if="optVisible"
          style="width:225px"
        >
          <RhythmSelection
            :rhythmData="rhythmData"
            @rhythm-data-dto="(data) => rhythmData = data"
          /> 
        </div>
      </transition>
      <transition name="fade">
        <div
          id="displayComponent"
          v-bind:class="displayComponentWidth"
          style="margin:0px"
          v-bind:style="{ left:leftPos }"
        >
        <!-- v-bind:class="[optVisible ? 'col-9' : 'col-12']" -->
          <Score :rhythmData="rhythmData" />
        </div>
      </transition>
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
      displayComponentWidth: 'col-9',
      leftPos: '250px',
    };
  },
  methods: {
    logRhythmData() {
      console.log('receiving: ', this.rhythmData);
    },
    //TODO : manage to get animation on sequence display
    displayOptions: function() {
      setTimeout(this.optionManager, 0);
      console.log(this.rhythmData)
    },
    optionManager: function() {
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

.fade-enter-active, .fade-leave-active {
  transition: transform .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateX(-225px);
}

.fade-enter-to,
.fade-leave {
  transform: translateX(0);
}

.btn-circle.btn-lg { 
  width: 50px; 
  height: 50px; 
  padding: 10px 16px; 
  border-radius: 25px; 
  font-size: 12px; 
  text-align: center; 
}

.btn:hover {
  background-color: RoyalBlue;
}

</style>
