import axios from 'axios'
const route = process.env.VUE_APP_API_URL

export default {
  // checkApi: async () => axios.get(route+'/ping').then(res => res.data),
  checkUsername: async (username) => axios.get(route+`?q=username:${username}`).then(res => res.data),
  createPlayer: async (player) => axios.post(route, player).then(res => res.data),
  updatePlayer: async (id, player) => axios.put(route+`/${id}`, player).then(res => res.data),
  deletePlayer: async (id) => axios.delete(route+`/${id}`).then(res => res.data),
  getPlayers: async () => axios.get(route).then(res => res.data)
}