<template>
  <div>
    <v-row>
      <v-col class="d-flex" cols="6">
        <h1 class="title text-left ml-5 mr-3"> Ranking </h1>
        <v-progress-circular
          v-if="loading"
          indeterminate
          color="primary"
          class="mt-2"
          size="20"
        ></v-progress-circular>
        <v-icon v-else @click="$emit('refresh')" class="blue--text" size="20" dark>fas fa-sync-alt</v-icon>
      </v-col>
    </v-row>
    <v-simple-table fixed-header height="300px">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">#</th>
            <th class="text-left">Nome</th>
            <th class="text-left">Username</th>
            <th class="text-left">Pontos</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in players" :key="item.username" :class="{activeRow: isLoggedIn && (item.username == username)}">
            <td class="text-left">{{ index+1 }}</td>
            <td class="text-left">{{ item.name }}</td>
            <td class="text-left">{{ item.username }}</td>
            <td class="text-left">{{ item.score }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
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
  },
  computed: {
  }
}
</script>
<style scoped>
  .activeRow {
    background-color: rgb(101, 153, 231);
    color: #ffffff;
  }
</style>