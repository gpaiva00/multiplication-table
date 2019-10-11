import axios from 'axios'
const route = 'http://gpaiva00.pythonanywhere.com'

export default {
  checkApi: async () => axios.get(route+'/ping').then(res => res.data),
  checkUsername: async (username) => axios.get(route+`/player?username=${username}`).then(res => res.data),
  createPlayer: async (player) => axios.post(route+'/player', player).then(res => res.data),
  updatePlayer: async (id, player) => axios.put(route+`/player?id=${id}`, player).then(res => res.data),
  deletePlayer: async (id) => axios.delete(route+`?id=${id}`).then(res => res.data),
  getPlayers: async () => axios.get(route+'/player').then(res => res.data)
}