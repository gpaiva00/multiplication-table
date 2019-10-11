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
  data: () => ({
    number1: 0,
    number2: 0,
    score: 0,
    currentRound: 0,
    timer: null,
    correctAnswer: 0,
    selectedRounds: 0,
    timerWidth: 100,
    maxOptionsAnswers: 3,
    gameIsRunnig: false,
    timerColor: 'deep-purple accent-4',
    optionColor: 'secondary',
    optionsItems: [],
    positions: [1, 2, 3],
    roundsOptions: [5, 10, 20, 40]
  }),
  methods: {

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
      const {selectedRounds, maxOptionsAnswers, generateRandomNumber, refreshTable, positions } = this

      if(this.currentRound == selectedRounds) return this.gameOver()

      // reset timer
      this.resetTimer()

      const product = refreshTable()
      const randomPosition = generateRandomNumber(1, maxOptionsAnswers)
      let optionsItems = []
      
      this.correctAnswer = product

      // set result into random position
      optionsItems[randomPosition] = product
      // set other options into their positions
      positions.forEach(i => {
        if (i === randomPosition) return
        const random = generateRandomNumber(1, 30)
        // prevent same option twice
        optionsItems[i] = !optionsItems.includes(random) 
          ? random 
          : generateRandomNumber(1, 30) // or 1, 100
      })
      // remove null options
      optionsItems = optionsItems.filter(i => i != null)
      
      this.optionsItems = optionsItems
      
      // increment rounds
      this.currentRound++
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

    generateRandomNumber(init = 1, limit = 10) {
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
        }, 500)
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