<template>
  <v-app>
    <v-app-bar app elevate-on-scroll>
      <v-toolbar-title class="title text-uppercase">
        <span class="mx-12">Aprenda</span>
        <!-- <span class="font-weight-light">FOLIO</span> -->
      </v-toolbar-title>
      <v-spacer></v-spacer>
      
      <Menu 
        id="menuBar"
        @showProfile="() => { showProfile = true; showLogin = false }"
        @showLogin="showLogin = !showLogin"
        @logout="logout"
        :showLogin="showLogin"
        :isLoggedIn="isLoggedIn"
        :playerName="loggedPlayer"
      />
      <ResponsiveMenu 
        id="responsiveMenu" 
        @showProfile="() => { showProfile = true; showLogin = false }"
        @showLogin="showLogin = !showLogin"
        @logout="logout"
        :showLogin="showLogin"
        :isLoggedIn="isLoggedIn"
        :playerName="loggedPlayer"
      />
    </v-app-bar>
    
    <!-- <div id="main" class="scroll-container"> -->
      <v-container style="height: 570px; background-color: #FFFFFF;">
        <!-- <section> -->
          <transition name="slide-fade" mode="out-in">
            <!-- Game -->
            <MainCard 
              v-if="!showLogin && !showProfile" 
              id="mainCard"
              @gameOver="gameOver" 
              :loggedPlayer="loggedPlayer"
              :isLoggedIn="isLoggedIn" />
            <!-- login/account -->
            <LoginCard 
              v-else-if="showLogin" 
              @loginIn="loginIn" 
              @invalidLogin="invalidLogin" 
              @createAccount="createAccount" 
              :players="playersList" />
            <!-- Profile -->
            <Profile 
              v-if="showProfile" 
              @saveProfile="saveProfile" 
              @hideProfile="() => { showProfile = false; showLogin = false;}" 
              :data="loggedPlayer" />
          </transition>
        <!-- </section> -->
        <!-- scroll down button -->
        <!-- <div class="text-center" style="margin-top: 100px;">
          <v-btn @click="scrollToRanking(scrolledToRanking)" class="mx-2" fab dark large color="primary">
            <v-icon v-if="!scrolledToRanking" dark>fas fa-chevron-down</v-icon>
            <v-icon v-else dark>fas fa-chevron-up</v-icon>
          </v-btn>
        </div> -->
      </v-container>
      
      <v-container>
        <!-- <section> -->
          <!-- Ranking -->
          <Ranking
          @refresh="getPlayersList" 
          id="ranking"
          class="mt-12" 
          :players="playersList" 
          :loading="rankingLoading" 
          :isLoggedIn="isLoggedIn" 
          :username="loggedUsernameAccount" />
        <!-- </section> -->
      </v-container>
    <!-- </div> -->
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

    <Footer />
  </v-app>
</template>
<script>
import MainCard from './components/MainCard'
import Ranking from './components/Ranking'
import LoginCard from './components/LoginCard'
import TabuadasRepository from './repository/TabuadasRepository'
import Profile from './components/Profile'
import Footer from './components/Footer'
import ResponsiveMenu from './components/ResponsiveMenu'
import Menu from './components/Menu'
// import fullScroll from './assets/full-page-scroll.js'
// var fullScroll = require('./assets/full-page-scroll.js')

export default {
  components: {
    MainCard,
    Ranking,
    LoginCard,
    Profile,
    Footer,
    ResponsiveMenu,
    Menu
  },
  mounted() {
    this.load()

  },
  data: () => ({
    showLogin: false,
    showProfile: false,
    isLoggedIn: false,
    rankingLoading: true,
    scrolledToRanking: false,
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

      await this.getPlayersList()

      // if logged in
      if(localStorage.getItem('username')) {
        const player = this.playersList.find(p => p.username == localStorage.getItem('username'))

        this.loginIn({ player, alreadyLoggedIn: true })
      }
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
        player.difficult = localStorage.getItem('difficult')

        await TabuadasRepository.updatePlayer(player._id, player)
        return this.getPlayersList()
      }
    },
    async saveProfile(data) {
      const player = this.playersList.find(p => p._id == data._id)

      try {
        // update only necessary keys 
        Object.keys(data).forEach(key => player[key] = data[key])
        // update username
        this.loggedPlayer = player
        
        await TabuadasRepository.updatePlayer(player._id, player)
        
        this.toggleSnack({
          show: true,
          text: 'Perfil atualizado com sucesso!',
          timeout: 3000,
          color: 'success'
        })
        
      } catch (error) {
        this.toggleSnack({
          show: true,
          text: 'Desculpe, deu erro ao tentar salvar :(',
          timeout: 3000,
          color: 'error'
        })
      }
    },
    loginIn({player, alreadyLoggedIn}) {      
      const { _id, name, username, password, score, difficult = '' } = player || {}
      
      this.showLogin = false
      this.isLoggedIn = true
      this.loggedPlayer = player
      this.loggedUsernameAccount = username

      // save local storage
      if(!alreadyLoggedIn) {
        localStorage.setItem('_id', _id)
        localStorage.setItem('name', name)
        localStorage.setItem('username', username)
        localStorage.setItem('password', password)
        localStorage.setItem('difficult', difficult)
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
      this.loggedPlayer = {}

      this.showLogin = true
      this.showProfile = false
    },
    invalidLogin() {
      this.toggleSnack({
        show: true,
        text: 'Nome de usuário ou senha inválidos',
        type: 'warning',
        // color: '#5D534E',
        timeout: 3000
      })
    },
    toggleSnack(data) {
      this.snack = data
    }
  }
}
</script>
<style>
/* @import url('./assets/full-page-scroll.css'); */
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* background-color:  */
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
    background-color: #FFFFFF;
  }

  html {
    scroll-behavior: smooth;
    overflow-x: hidden;
  }

  #responsiveMenu {
    display: none;
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

  @media (max-width: 600px) {
    #menuBar {
      display: none;
    }

    #responsiveMenu {
      display: inherit;
    }
  }
</style>
