<template>
  <div class="text-center">
    <v-menu
      v-model="menu"
      :nudge-width="200"
      offset-x
    >
    <!-- bars -->
      <template v-slot:activator="{ on }">
        <v-btn
          text
          icon
          v-on="on"
        >
          <v-icon>fas fa-bars</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-list v-if="isLoggedIn">
          <v-list-item>
            <v-list-item-avatar>
              <v-avatar color="secondary" size="36">
                <v-icon class="white--text" dark>fa fa-user</v-icon>
              </v-avatar>
            </v-list-item-avatar>

            <v-list-item-content @click="$emit('showProfile')">
              <v-list-item-title>{{getFirstName}}</v-list-item-title>
              <v-list-item-subtitle>Perfil</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
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
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-list v-else>
        <!-- play -->
         <v-list-item v-if="showLogin" @click="$emit('showLogin')">
           <v-list-item-action>
             <v-icon class="mr-2 mb-1">fas fa-gamepad</v-icon>
           </v-list-item-action>
           <v-list-item-title>Jogar</v-list-item-title>
         </v-list-item>
        <!-- login/create -->
        <v-list-item v-else  @click="$emit('showLogin')">
          <v-list-item-action>
            <v-icon class="mr-2 mb-1">fas fa-sign-in-alt</v-icon>
          </v-list-item-action>
          <v-list-item-title>Login</v-list-item-title>
        </v-list-item>
           
        </v-list>

        <v-divider></v-divider>

        <!-- <v-list>
          <v-list-item>
            <v-list-item-action>
              <v-switch v-model="message" color="purple"></v-switch>
            </v-list-item-action>
            <v-list-item-title>Enable messages</v-list-item-title>
          </v-list-item>
        </v-list> -->

        <!-- <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="menu = false">Cancel</v-btn>
          <v-btn color="red lighten-1" text >Sair</v-btn>
        </v-card-actions> -->
      </v-card>
    </v-menu>
  </div>
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
  data: () => ({
    fav: true,
    menu: false,
    message: false,
    hints: true,
  }),

  computed: {
    getFirstName() {
      if(this.isLoggedIn == true)  
        return this.playerName.name.split(' ')[0]
    }
  }
}
</script>