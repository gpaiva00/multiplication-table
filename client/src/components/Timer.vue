<template>
  <v-progress-linear
    v-model="barWidth"
    :color="color"
  ></v-progress-linear>
</template>

<script>
export default {
  props: {
    barWidth: {
      type: Number,
      default: 60
    },
    color: { type: String, default: 'deep-purple accent-4' }
  }
}
</script>