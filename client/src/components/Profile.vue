<template>
  <v-card width="400" class="mx-auto">
    <v-card-title>Perfil</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="3">
          <p class="subtitle-2 d-flex justify-start">Username</p> 
        </v-col>
        <v-col cols="9">{{data.username}}</v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <p class="subtitle-2 d-flex my-5 justify-start">Nome</p> 
        </v-col>
        <v-col cols="6">
          <v-form ref="form" v-model="valid" :lazy-validation="true">
            <v-text-field v-model="name" :rules="nameRules" required></v-text-field>
          </v-form>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <div class="overline my-2 mb-4">Jogo</div>
      <!-- game settings -->
      <v-row>
        <v-col cols="6">
          <p class="subtitle-2 d-flex my-5 justify-start">Dificuldade</p> 
        </v-col>
        <v-col cols="6">
          <v-select :items="difficultLevels" v-model="selectedDiffiultLevel" label="Níveis" solo></v-select>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-row class="mx-1">
        <v-col class="d-flex" cols="6" sm="6">
          <v-btn block height="48px" color="secondary lighten-2" class="white--text font-weight-bold" @click="$emit('hideProfile')">Voltar</v-btn>
        </v-col>
        <v-col class="d-flex" cols="6" sm="6">
          <v-btn :disabled="!valid" block height="48px" color="green" class="white--text font-weight-bold" @click="handleSaveProfile">Salvar</v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    this.load()
  },
  data: () => ({
    name: '',
    selectedDiffiultLevel: '',
    valid: false,
    difficultLevels: ['Fácil', 'Médio', 'Difícil', 'Jedi'],
    nameRules: [v => !!v || "Digite seu nome"],
  }),

  methods: {
    load() {
      this.name = this.data.name
      this.selectedDiffiultLevel = this.data.difficult || ''
    },
    handleSaveProfile() {
      this.$emit('saveProfile', {
        _id: this.data._id,
        name: this.name,
        difficult: this.selectedDiffiultLevel
      })
    }
  },

  computed: {}
}
</script>