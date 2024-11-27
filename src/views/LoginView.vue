<!-- eslint-disable prettier/prettier -->
<template>
  <div class="login">
    <h1>Вход</h1>
    <form @submit.prevent="submitForm">
      <div>
        <label>Логин или Телефон</label>
        <input type="text" v-model="username" required />
      </div>
      <div>
        <label>Пароль</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">Войти</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>
<!-- eslint-disable prettier/prettier -->

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    ...mapActions(["login"]),
    async submitForm() {
      try {
        await this.login({ username: this.username, password: this.password });
        this.$router.push("/");
      } catch (error) {
        this.errorMessage = "Неправильные данные";
      }
    },
  },
};
</script>
<!-- eslint-disable prettier/prettier -->

<style scoped lang="scss">
.login {
  max-width: 400px;
  margin: 100px auto;
  text-align: center;
}

.error {
  color: red;
}
</style>
