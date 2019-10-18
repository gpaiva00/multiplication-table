<template>
  <v-card>
    <v-card-title>
      <!-- <v-row> -->
        <v-col class="d-flex" cols="10">
          <h1 class="title text-uppercase text-left ml-5 mr-3"> Placar </h1>
        </v-col>
        <v-col cols="2">
          <!-- refresh -->
          <v-progress-circular
            v-if="loading"
            indeterminate
            color="primary"
            class="mt-2"
            size="20"
          ></v-progress-circular>
          <v-btn v-else @click="$emit('refresh')" text icon color="blue" class="justify-end">
            <v-icon class="blue--text" size="22" dark>fas fa-sync-alt</v-icon>
          </v-btn>
        </v-col>
      <!-- </v-row> -->
    </v-card-title>
    <v-card-text>
      <v-simple-table fixed-header height="400">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">#</th>
              <th class="text-left">Nome</th>
              <th class="text-left">Username</th>
              <th class="text-left">Pontos</th>
              <th class="text-left">Nível</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in players" :key="item.username+index" :class="{activeRow: isLoggedIn && (item.username == username)}">
              <td class="text-left">{{ index+1 }}</td>
              <td class="text-left">{{ item.name }}</td>
              <td class="text-left">{{ item.username }}</td>
              <td class="text-left">{{ `${item.score} / ${item.rounds}` }}</td>
              <td class="text-left">{{ item.difficult }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    players: {
      type: Array,
      default: () => []
    },
    loading: { type: Boolean, default: true },
    isLoggedIn: {type: Boolean},
    username: {type: String}
  }
}
</script>
<style scoped>
  .activeRow {
    background-color: rgb(101, 153, 231);
    color: #ffffff;
  }
</style>