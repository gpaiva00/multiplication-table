<template>
  <div class="text-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="200"
      offset-x
    >
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
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <v-avatar color="secondary" size="36">
                <v-icon class="white--text" dark>fa fa-user</v-icon>
              </v-avatar>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{getFirstName}}</v-list-item-title>
              <!-- <v-list-item-subtitle>Founder of Vuetify.js</v-list-item-subtitle> -->
            </v-list-item-content>

            <v-list-item-action>
              <v-btn
                :class="fav ? 'red--text' : ''"
                icon
                @click="fav = !fav"
              >
                <v-icon>mdi-heart</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list>
          <v-list-item>
            <v-list-item-action>
              <v-switch v-model="message" color="purple"></v-switch>
            </v-list-item-action>
            <v-list-item-title>Enable messages</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-action>
              <v-switch v-model="hints" color="purple"></v-switch>
            </v-list-item-action>
            <v-list-item-title>Enable hints</v-list-item-title>
          </v-list-item>
        </v-list>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text @click="menu = false">Cancel</v-btn>
          <v-btn color="primary" text @click="menu = false">Save</v-btn>
        </v-card-actions>
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
      return this.playerName.name.split(' ')[0]
    }
  }
}
</script>