<template>
  <div v-if="isLoggedIn" class="mx-12">
    <v-avatar color="secondary" size="36">
      <v-icon class="white--text" dark>fa fa-user</v-icon>
    </v-avatar>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <span
          v-on="on"
          @click="$emit('showProfile')"
          class="mr-8 ml-2 text-capitalize"
        >{{ getFirstName }}</span>
      </template>
      <span>Perfil</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{on}">
        <v-icon
          v-on="on"
          @click="$emit('logout')"
          class="red--text ml-4 mr-3 lighten-1"
          size="20"
        >fas fa-power-off</v-icon>
      </template>
      <span>Sair</span>
    </v-tooltip>
  </div>
  <v-btn v-else text class="mx-12">
    <!-- play or login -->
    <span class="mr-2 ml-2" @click="$emit('showLogin')">
      <span v-if="showLogin">
        <v-icon class="mr-2 mb-1">fas fa-gamepad</v-icon>Jogar
      </span>
      <span v-else>
        <v-icon class="mr-2 mb-1">fas fa-sign-in-alt</v-icon>Login
      </span>
    </span>
  </v-btn>
</template>

<script>
export default {
  props: {
    isLoggedIn: {
      type: Boolean,
      default: false
    },
    showLogin: {
      type: Boolean,
      default: false
    },
    playerName: {
      type: Object,
      default: () => {}
    }
  },

  data: () => ({}),

  methods: {},

  computed: {
    getFirstName() {
      return this.playerName.name.split(' ')[0]
    }
  }
};
</script>

<style>

</style>