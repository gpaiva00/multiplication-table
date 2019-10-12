import TabuadasAPI from '../API/Tabuadas'

export default {
  checkApi: () => TabuadasAPI.checkApi(),
  checkUsername: (username) => TabuadasAPI.checkUsername(username),
  createPlayer: (player) => TabuadasAPI.createPlayer(player),
  updatePlayer: (id, player) => TabuadasAPI.updatePlayer(id, player),
  deletePlayer: (id) => TabuadasAPI.deletePlayer(id),
  getPlayers: () => TabuadasAPI.getPlayers()
}