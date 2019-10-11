<template>
  <v-card width="400" class="mx-auto">
    <v-card-title>
      <span color="grey lighten-1">Entrar</span>
    </v-card-title>
    <v-card-text>
      <v-divider></v-divider>
      <v-row align="center" justify="space-around">
        <v-form ref="form" v-model="valid" :lazy-validation="lazy">
          <v-text-field v-model="userName" :counter="10" :rules="nameRules" label="Nome de usuário" required></v-text-field>

          <v-text-field type="password" v-model="password" :rules="passwordRules" label="Senha" required></v-text-field>
        </v-form>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-row class="mx-1">
        <v-col class="d-flex" cols="6" sm="6">
          <v-btn block height="48px" color="primary lighten-2" class="white--text font-weight-bold" @click="$emit('showAccount')">Criar conta</v-btn>
        </v-col>
        <v-col class="d-flex" cols="6" sm="6">
          <v-btn block height="48px" :disabled="!valid" color="green" class="white--text font-weight-bold" @click="handleLoginIn">Entrar</v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
    data: () => ({
      userName: "",
      password: "",
      valid: true,
      lazy: true,
      nameRules: [v => !!v || "Digite seu nome"],
      passwordRules: [
        v => (v && v.length > 5) || "A senha deve ter pelo menos 5 caracteres"
      ]
    }),
    methods: {
      handleLoginIn() {
        this.$emit('loginIn', {
          userName: this.userName,
          password: this.password
        })
      }
    }
}
</script>