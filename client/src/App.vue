<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="title text-uppercase">
        <span>Tabuadas</span>
        <!-- <span class="font-weight-light">FOLIO</span> -->
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="isLoggedIn">
         <v-avatar color="indigo" size="36">
          <v-icon class="white--text" dark>fa fa-user</v-icon>
        </v-avatar>
        <span class="mr-2 ml-2 text-capitalize">{{ userName }}</span>
        <v-icon  @click="logout" class="red--text ml-4 mr-3 lighten-1" size="20">fas fa-power-off</v-icon>
      </div>
      <v-btn v-else text>
        <!-- play or login -->
        <span class="mr-2 ml-2" @click="showLogin = !showLogin">
          <span v-if="showLogin">
            <v-icon class="mr-2 mb-1">fas fa-gamepad</v-icon> Jogar
          </span>
          <span v-else>
            <v-icon class="mr-2 mb-1">fas fa-sign-in-alt</v-icon> Login
          </span>
        </span>
      </v-btn>
    </v-app-bar>

    <v-container style="height: 570px;">
      <transition name="slide-fade" mode="out-in">
        <!-- Game -->
        <MainCard v-if="!showLogin" @gameOver="gameOver" class="mt-5"/>
        <!-- login/account -->
        <LoginCard v-else @loginIn="loginIn" @invalidLogin="invalidLogin" @createAccount="createAccount" class="mt-5" :players="playersList"/>
      </transition>

      <!-- scroll down button -->
      <!-- <div class="text-center" style="margin-top: 100px;">
        <v-btn @click="scrollToRanking(scrolledToRanking)" class="mx-2" fab dark large color="primary">
          <v-icon v-if="!scrolledToRanking" dark>fas fa-chevron-down</v-icon>
          <v-icon v-else dark>fas fa-chevron-up</v-icon>
        </v-btn>
      </div> -->
    </v-container>
    <!-- Ranking -->
    <Ranking @refresh="getPlayersList" class="mt-12" :players="playersList" :loading="rankingLoading" :isLoggedIn="isLoggedIn" :username="loggedUsernameAccount" />

    <!-- snackbar -->
    <div class="text-center ma-2">
      <v-snackbar
        v-model="snack.show"
        :color="snack.color"
        :timeout="snack.timeout"
      >
        <span v-html="snack.text"></span>
        <v-btn
          :color="snack.closeButtonColor"
          text
          @click="snack.show = false"
        >
          Fechar
        </v-btn>
      </v-snackbar>
    </div>
  </v-app>
</template>
<script>
import MainCard from './components/MainCard'
import Ranking from './components/Ranking'
import LoginCard from './components/LoginCard'
import TabuadasRepository from './repository/TabuadasRepository'

export default {
  components: {
    MainCard,
    Ranking,
    LoginCard
  },
  mounted() {
    this.load()
  },
  data: () => ({
    showLogin: false,
    isLoggedIn: false,
    rankingLoading: true,
    scrolledToRanking: false,
    userName: '',
    loggedUsernameAccount: '',
    playersList: [],
    loggedPlayer: {},
    snack: {
      text: '',
      show: false,
      timeout: 2000,
      color: 'success',
      closeButtonColor: 'pink'
    }
  }),
  methods: {
    async load() {
      // if logged in
      if(localStorage.getItem('username'))
        this.loginIn({alreadyLoggedIn: true})

      await this.getPlayersList()
    },
    async getPlayersList() {
      this.rankingLoading = true
      const players = await TabuadasRepository.getPlayers()
      this.playersList = players
      this.rankingLoading = false
    },
    async createAccount(player) {
      const usernameExists = await TabuadasRepository.checkUsername(player.username).then(d => d.length) > 0

      if(usernameExists) 
        return this.toggleSnack({
          show: true,
          text: 'Este nome de usuário já existe',
          type: 'warning',
          timeout: 3000
        })
      
      const newPlayer = await TabuadasRepository.createPlayer(player)
      
      if('_id' in newPlayer) {
        this.loginIn({player: newPlayer})
        this.getPlayersList()
      }
      else 
        this.toggleSnack({
          show: true,
          text: 'Desculpe, houve um erro ao criar sua conta. Tente mais tarde',
          type: 'error',
          timeout: 4000
        })
    },
    async gameOver(score) {
      this.toggleSnack({
        show: true,
        text: `Você acertou <b>${score} vezes!</b> Parabéns!`,
        color: 'success',
        closeButtonColor: 'white',
        timeout: 5000
      })

      // if logged in, refresh user score
      if(this.isLoggedIn) {
        const player = this.loggedPlayer
        player.score = score

        await TabuadasRepository.updatePlayer(player._id, player)
        return this.getPlayersList()
      }
    },
    loginIn({player, alreadyLoggedIn}) {      
      const { name, username, password, score } = player || {}
      
      this.showLogin = false
      this.isLoggedIn = true
      this.loggedPlayer = player
      this.userName = alreadyLoggedIn ? localStorage.getItem('name') : name
      this.loggedUsernameAccount = username

      // save local storage
      if(!alreadyLoggedIn) {
        localStorage.setItem('name', name)
        localStorage.setItem('username', username)
        localStorage.setItem('password', password)
        localStorage.setItem('score', score)
      }
    },
    logout() {
      // remove local storage
      localStorage.removeItem('name')
      localStorage.removeItem('username')
      localStorage.removeItem('password')
      localStorage.removeItem('score')

      this.isLoggedIn = false
      this.userName = ''


    },
    invalidLogin() {
      this.toggleSnack({
        show: true,
        text: 'Nome de usuário ou senha inválidos',
        type: 'warning',
        timeout: 3000
      })
    },
    scrollToRanking(scrolledToRanking) {
      if(!scrolledToRanking)
        window.scrollTo(0, 500)
      else 
        window.scrollTo(0, 0)

      this.scrolledToRanking = !scrolledToRanking
    },
    toggleSnack(data) {
      this.snack = data
    }
  }  
}
</script>
<style>
  html {
    scroll-behavior: smooth;
    overflow-x: hidden;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

/* Animações de entrada e saída podem utilizar diferentes  */
  /* funções de duração e de tempo.                          */
  .slide-fade-enter-active {
    transition: all .1s ease;
  }
  .slide-fade-leave-active {
    transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active em versões anteriores a 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }
</style>
