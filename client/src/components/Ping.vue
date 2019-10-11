<template>
  <div>
    <p>{{ msg }}</p>
  </div>
</template>

<script>
import TabuadasRepository from '../repository/TabuadasRepository'
export default {
  name: 'Ping',
  data: () => {
    return {
      msg: 'Hello'
    }
  },
  methods: {
    async checkRoute() {
      const response = await TabuadasRepository.checkApi()

      this.msg = response
      
    }
  },
  created() {
    this.checkRoute()
  }
}
</script>