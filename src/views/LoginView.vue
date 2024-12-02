<!-- eslint-disable prettier/prettier -->
<template>
  <div class="login-container">
    <div class="login">
      <div>
        <div class="login-title">Авторизация</div>
        <form @submit.prevent="submitForm">
          <div class="login-main-section">
            <div class="login-phone">
              <img
                class="login-phone_image"
                src="../../public/call.png"
                alt="phone icon"
              />
              <div class="login-phone-container">
                <label class="login-phone-container_title" for="username"
                  >Логин или Телефон</label
                >
                <input
                  id="username"
                  type="text"
                  v-model="phone"
                  @input="formatPhone"
                  maxlength="12"
                  required
                />
              </div>
            </div>
            <div class="login-password">
              <img src="../../public/pass_img.png" alt="Password icon" />
              <div>
                <input
                  id="password"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  v-model="password"
                  required
                  placeholder="Пароль"
                />

                <img
                  v-if="isPasswordVisible"
                  class="login-password-no-vision"
                  src="../../public/vision.png"
                  alt="Toggle password visibility"
                  @click="togglePasswordVisibility"
                />
                <img
                  v-else
                  class="login-password-no-vision"
                  src="../../public/no-vision.png"
                  alt="Toggle password visibility"
                  @click="togglePasswordVisibility"
                />
              </div>
            </div>
            <button class="login-botton" type="submit">Войти</button>
          </div>
          <p v-show="errorMessage" class="error">{{ errorMessage }}</p>
        </form>
      </div>
    </div>
  </div>
</template>
<!-- eslint-disable prettier/prettier -->

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      username: "",
      phone: "+7",
      password: "",
      errorMessage: "",
      isPasswordVisible: false,
    };
  },
  methods: {
    ...mapActions(["login"]),
    async submitForm() {
      try {
        await this.login({ username: this.username, password: this.password });
        this.$router.push("/");
      } catch (error) {
        this.errorMessage = "Неверные логин или пароль";
      }
    },
    formatPhone() {
      if (this.phone.startsWith("8")) {
        this.phone = "+7";
      }
      const cleaned = this.phone.replace(/[^0-9]/g, "").slice(1);
      this.phone = `+7${cleaned.slice(0, 10)}`;
      this.username = `7${cleaned.slice(0, 10)}`;
    },
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
    },
  },
};
</script>
<!-- eslint-disable prettier/prettier -->

<style scoped lang="scss">
.main {
  width: 100%;
}

.login-containerground {
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("../../public/login_background.jpg") center center no-repeat
    fixed;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  margin: 0;
  padding: 0;
}

.login {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .login-title {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #44a248;
    border-radius: 5px;
    width: 308px;
    height: 56px;
    color: #ffffff;
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    text-decoration-skip-ink: none;
    font-optical-sizing: auto;
    margin: -15px 16px;
    font-family: "Inter", sans-serif;
    font-optical-sizing: auto;
  }

  form {
    width: 340px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 52px 0px 20px 0px;
    gap: 28px;
    border-radius: 5px;
    opacity: 0px;

    .login-main-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
      position: relative;
      padding-top: 32px;
      align-items: center;
    }

    .login-phone,
    .login-password {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-direction: row;
      align-items: flex-end;
      border-bottom: 1px solid #cccccc;
      padding-bottom: 8px;
      position: relative;
      width: 100%;

      .login-phone_image {
        width: 18px;
        height: 18px;
      }

      .login-password-no-vision {
        width: 22px;
        height: 19px;
        position: absolute;
        gap: 0px;
        opacity: 0px;
        right: 5px;
        top: 8px;
      }

      .login-phone-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        .login-phone-container_title {
          display: flex;
          flex-direction: column;
          color: #50b053;
          font-family: "Roboto", sans-serif;
          font-weight: 400;
          font-style: normal;
          font-family: Roboto;
          font-size: 12px;
          line-height: 18px;
          text-decoration-skip-ink: none;
        }
      }
    }

    .login-botton {
      width: 110px;
      height: 36px;
      gap: 8px;
      border-radius: 4px;
      opacity: 0px;
      background-color: #50b053;
      border: 1px solid #50b053;
      color: #ffffff;
      font-family: Roboto;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      text-align: center;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;
      cursor: pointer;
    }

    .login-botton:hover {
      background-color: #44a248;
      border: 1px solid #44a248;
      color: #ffffff;
      transition: background-color 0.3s ease, border-color 0.3s ease,
        color 0.3s ease;
    }
  }

  #password,
  #username {
    -webkit-box-shadow: 0 0 0px 1000px white inset;
    box-shadow: 0 0 0px 1000px white inset;
    background-color: white;
    color: #8c8c8c;
    border: 0px solid #ffffff;
    padding: 5px 0px 0px 0px;
    font-family: "Roboto";
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    text-align: left;
    text-decoration-skip-ink: none;
    width: 248px;
  }
  #password {
    padding-left: 5px;
  }
  input:focus {
    outline: none;
    border: 1px solid #4caf50;
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
  }
}

.error {
  color: red;
  margin-top: 8px;
  font-family: "Roboto";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}
</style>
