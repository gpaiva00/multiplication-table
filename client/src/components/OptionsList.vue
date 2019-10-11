<template>
  <v-list shaped>
      <v-subheader v-show="items.length">ALTERNATIVAS</v-subheader>
      <v-list-item-group v-model="item" :color="optionColor">
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
        >
          <v-list-item-icon>
            <v-icon>fas fa-caret-right</v-icon>
          </v-list-item-icon>
          <v-list-item-content @click="$emit('selectedAnswer', item)">
            <v-list-item-title v-text="item"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
</template>

<script>
export default {
  props: {
    items: { type: Array, default: () => [] },
    optionColor: { type: String, default: "secondary" }
  },

  data: () => ({
    item: -1
  }),
}
</script>