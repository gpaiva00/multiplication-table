<template>
  <v-card width="400" class="mx-auto my-12" :raised="true" elevation="15">
    <v-card-title>Perfil</v-card-title>
    <v-card-text>
      <v-divider></v-divider>
      <v-row>
        <v-col cols="6">
          <p class="subtitle-2">Username</p>
        </v-col>
        <v-col cols="6">
          <span class="d-flex">{{data.username}}</span>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <p class="subtitle-2 my-4">Seu nome</p>
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
          <p class="subtitle-2 my-4">Dificuldade</p>
        </v-col>
        <v-col cols="6">
          <v-select :items="difficultLevels" v-model="selectedDiffiultLevel" label="Níveis" solo></v-select>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-row class="mx-1">
        <v-col class="d-flex" cols="6" sm="6">
          <v-btn
            block
            height="48px"
            color="secondary lighten-2"
            class="white--text font-weight-bold"
            @click="$emit('hideProfile')"
          >Voltar</v-btn>
        </v-col>
        <v-col class="d-flex" cols="6" sm="6">
          <v-btn
            :disabled="!valid || isLoading"
            block
            height="48px"
            color="#7fc677"
            class="white--text font-weight-bold"
            @click="handleSaveProfile"
          >
            <span v-if="!isLoading">Salvar</span>
            <v-progress-circular v-else indeterminate color="secondary" class="my-auto" size="20"></v-progress-circular>
          </v-btn>
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
    },
    cardElevation: String,
    isLoading: Boolean
  },
  mounted() {
    this.load();
  },
  data: () => ({
    name: "",
    selectedDiffiultLevel: "",
    valid: false,
    difficultLevels: ["Fácil", "Médio", "Difícil", "Jedi"],
    nameRules: [v => !!v || "Digite seu nome"]
  }),

  methods: {
    load() {
      this.name = this.data.name;
      this.selectedDiffiultLevel = this.data.difficult || "";
    },
    handleSaveProfile() {
      this.$emit("saveProfile", {
        _id: this.data._id,
        name: this.name
      });

      localStorage.setItem("difficult", this.selectedDiffiultLevel);
    }
  },

  computed: {}
};
</script>