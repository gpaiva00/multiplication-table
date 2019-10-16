<template>
<v-container class="my-12">
  <transition name="slide-fade" mode="out-in">
    <Login v-if="!showCreateAccount" @showAccount="showCreateAccount = true" @loginIn="validateLogin"/>
    <CreateAccount v-else @showLogin="showCreateAccount = false" @createAccount="player => $emit('createAccount', player)"/>
  </transition>
</v-container>
</template>
<script>
import CreateAccount from './CreateAccount'
import Login from './Login'
export default {
  props: {
    players: {
      type: Array,
      default: () => []
    }
  },
  components: {
    Login,
    CreateAccount
  },
  data: () => ({
    showCreateAccount: false
  }),
  methods: {
    validateLogin({userName, password}) {
      const findPlayer = this.players.find(p => p.username === userName && p.password === password)

      if(findPlayer) 
        this.$emit('loginIn', {player: findPlayer})
      else 
        this.$emit('invalidLogin')
      
    }
  }
};
</script>
<style scoped>
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