<template>
  <v-card width="400" class="mx-auto">
    <v-card-title>
      <v-badge class="mx-auto" color="purple" left>
        <template v-slot:badge>
          <span>{{score}}</span>
        </template>
        <span color="grey lighten-1">Acertos</span>
      </v-badge>
    </v-card-title>
    <v-card-text>
      <v-divider></v-divider>
      <!-- numbers -->
      <div class="mx-auto my-10">
        <span class="display-3">{{number1}}</span>
        <span class="mx-2 headline">x</span>
        <span class="display-3">{{number2}}</span>
      </div>
      <!-- timer -->
      <timer :barWidth="timerWidth" :color="timerColor" />
      <!-- options -->
      <options-list @selectedAnswer="setSelectedAnswer" :items="optionsItems" :optionColor="optionColor" />
    </v-card-text>
    <!-- actions -->
    <v-card-actions>
      <v-row class="mx-1">
        <v-col class="d-flex" cols="6" sm="6">
          <v-select :items="roundsOptions" v-model="selectedRounds" label="Rodadas" solo></v-select>
        </v-col>
        <v-col class="d-flex" cols="6" sm="6">
          <v-btn
            height="48px"
            block
            color="green"
            class="white--text font-weight-bold"
            :disabled="gameIsRunnig"
            @click="startGame"
          >
            {{gameIsRunnig ? countDown : 'Jogar'}}
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
import Timer from './Timer'
import OptionsList from './OptionsList'

export default {
  props: {
    loggedPlayer: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    this.load()
  },
  data: () => ({
    number1: 0,
    number2: 0,
    score: 0,
    currentRound: 0,
    timer: null,
    correctAnswer: 0,
    selectedRounds: 0,
    timerWidth: 100,
    gameIsRunnig: false,
    timerColor: 'deep-purple accent-4',
    optionColor: 'secondary',
    optionsItems: [],
    roundsOptions: [5, 10, 20, 40],
    gameSettings: {
      timerSpeed: 800,
      positions: [1, 2],
      range1: 1,
      range2: 10  
    }
  }),
  methods: {
    load() {
      // set game settings according to user difficult
      const gameSettings = {...this.gameSettings}

      switch (this.loggedPlayer.difficult) {
        case 'Fácil':
          gameSettings.timerSpeed = 800
          gameSettings.positions = [1,2]
          break;
        case 'Médio':
          gameSettings.timerSpeed = 800
          gameSettings.positions = [1,2,3]
          break;
        case 'Difícil':
          gameSettings.timerSpeed = 500
          gameSettings.positions = [1,2,3]
          gameSettings.range1 = 2
          gameSettings.range2 = 15
          break;
        case 'Jedi':
          gameSettings.timerSpeed = 500
          gameSettings.positions = [1,2,3,4]
          gameSettings.range1 = 2
          gameSettings.range2 = 20
          break;
        case 'Super Jedi':
          gameSettings.timerSpeed = 300
          gameSettings.positions = [1,2,3,4]
          gameSettings.range1 = 2
          gameSettings.range2 = 30
          break;
      }

      this.gameSettings = gameSettings
    },
    setSelectedAnswer(answer) {
      const { correctAnswer, timer } = this

      if(answer == correctAnswer) {
        this.score++
        this.refreshAll()
      } else {
        // reset timeout
        clearTimeout(timer)
        this.optionColor = 'error'

        setTimeout(() => {
          // remove red color from wrong answer
          this.optionColor = 'secondary'
          this.refreshAll()
        }, 1500)
        
      }
    },

    refreshAll() {
      const {selectedRounds, generateRandomNumber, generateOtherOptions, refreshTable, gameSettings: { positions } } = this

      if(this.currentRound == selectedRounds) return this.gameOver()

      // reset timer
      this.resetTimer()

      const product = refreshTable()
      const randomPosition = generateRandomNumber(1, positions.length)
      let optionsItems = []
      
      this.correctAnswer = product

      // set result into random position
      optionsItems[randomPosition] = product
      // table: 4x3. Other options get 4x2 and 4x4 to show approximate values
      let signal = -1
      // set other options into their positions
      positions.forEach((i, index) => {
        if (i !== randomPosition) {
          const option = generateOtherOptions(signal*1)
          // prevent same option twice
          optionsItems[i] = !optionsItems.includes(option) 
            ? option 
            : generateOtherOptions(signal*2)

          signal = signal < 0 ? +1 : -1
          
          // console.log('signal', signal);
          // console.log('signal*1', signal*1);
          // console.log('signal*2', signal*2);
          
        }
      })
      // remove null options
      optionsItems = optionsItems.filter(i => i != null)
      
      this.optionsItems = optionsItems
      
      // increment rounds
      this.currentRound++
    },

    generateOtherOptions(index) {
      return this.number1 * (this.number2 + ( index ))
    },

    refreshTable() {
      var { generateRandomNumber } = this

      this.number1 = generateRandomNumber()
      this.number2 = generateRandomNumber()
      const product = this.number1 * this.number2

      return product

    },

    startGame() {
      // reset
      this.score = 0
      this.gameIsRunnig = true
      // refresh
      this.refreshAll()
    },

    gameOver() {
      this.resetAll()
      
      //show final result and refresh score
      this.$emit('gameOver', this.score)

    },

    generateRandomNumber(init = this.gameSettings.range1, limit = this.gameSettings.range2) {
      return Math.floor(Math.random() * limit + init)
    },

    resetProgressBar(timeleft, timetotal) {

      if (timeleft == 0) {
        clearTimeout(this.timer)

        window.clearTimeout()

        setTimeout(() => {
          this.timerWidth = 100
          this.refreshAll()
        }, 100)
      }

      const progressBarWidth = (timeleft * 100) / timetotal
      // console.log(progressBarWidth);

      this.timerWidth = progressBarWidth

      // .html((timeleft % 60))
      if (timeleft > 0) {
        this.timerColor = 'deep-purple accent-4'

        this.timer = setTimeout(() => {
          this.resetProgressBar(timeleft - 1, timetotal)
        }, this.gameSettings.timerSpeed)
      }

      if (progressBarWidth <= 30)
        this.timerColor = 'red lighten-1'
    },

    resetTimer() {
      clearTimeout(this.timer)
      window.clearTimeout()

      this.resetProgressBar(10, 10)
    },

    resetAll() {
      const { timer, selectedRounds } = this
      
      // resets
      clearTimeout(timer)
      this.currentRound = 0
      this.number1 = 0
      this.number2 = 0
      // score = 0
      this.gameIsRunnig = false
      this.selectedRounds = 0
      this.optionsItems = []
      this.highlightItem = -1

      // reset timer
      this.timerColor = 'deep-purple accent-4'   
      this.timerWidth = 100 
    }
  },
  computed: {
    countDown() {
      return (this.selectedRounds - this.currentRound) + 1
    }
  },
  components: {
    Timer,
    OptionsList
  }
};
</script>