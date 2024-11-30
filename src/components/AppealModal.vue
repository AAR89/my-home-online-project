<template>
  <div v-if="isVisible" class="modal">
    <form class="modal-form" v-if="localAppeal" @submit.prevent="saveAppeal">
      <div class="modal-close">
        <!-- <p class="modal-close-button" @click="closeModal()">Закрыть</p> -->
        <img
          @click="closeModal()"
          class="modal-close-button"
          src="../../public/close.png"
          alt="Close icon"
        />
      </div>
      <header class="modal-header">
        <h2 class="modal-header-title">
          {{ !isEditMode ? "Создание заявки" : "Переменная с номером заявки" }}
        </h2>
        <h1 class="modal-header-status">
          {{ !isEditMode ? "Новая" : "Переменная со статусом заявки" }}
        </h1>
      </header>
      <section v-show="!isEditMode" class="modal-fields">
        <div class="input-block">
          <p class="input-block-title">Дом</p>
          <input class="modal-fields-inputs" type="text" />
        </div>
        <div class="input-block">
          <p class="input-block-title">Квартира</p>
          <input class="modal-fields-inputs" type="number" min="1" />
        </div>
        <div class="input-block">
          <p class="input-block-title">Срок</p>
          <input class="modal-fields-inputs" type="datetime-local" />
        </div>
      </section>
      <section v-show="!isEditMode" class="modal-fields">
        <div class="input-block">
          <p class="input-block-title">Фамилия</p>
          <input class="modal-fields-inputs-contact" type="text" />
        </div>
        <div class="input-block">
          <p class="input-block-title">Имя</p>
          <input class="modal-fields-inputs-contact" type="text" />
        </div>
        <div class="input-block">
          <p class="input-block-title">Отчество</p>
          <input class="modal-fields-inputs-contact" type="text" />
        </div>
        <div class="input-block">
          <p class="input-block-title">Телефон</p>
          <input class="modal-fields-inputs-contact" type="tel" />
        </div>
      </section>
      <section v-show="!isEditMode" class="modal-fields-description">
        <div class="input-block">
          <p class="input-block-title">Описание заявки</p>
          <textarea class="modal-fields-inputs-description" type="text" />
        </div>
      </section>
      <section class="modal-button-block">
        <button class="modal-button-block-save">Сохранить</button>
      </section>

      <!-- <h2>{{ isEditMode ? "Редактировать заявку" : "Создать заявку" }}</h2>
        <div>
          <label for="lastName">Фамилия</label>
          <input v-model="lastName" id="lastName" type="text" />
        </div>
        <div>
          <label for="firstName">Имя</label>
          <input v-model="firstName" id="firstName" type="text" />
        </div>
        <div>
          <label for="patronymicName">Отчество</label>
          <input v-model="patronymicName" id="patronymicName" type="text" />
        </div>
        <div>
          <label for="phone">Телефон</label>
          <input v-model="phone" id="phone" type="text" />
        </div>
        <div>
          <label for="description">Описание</label>
          <textarea v-model="description" id="description"></textarea>
        </div>
        <div>
          <label for="dueDate">Срок</label>
          <input v-model="dueDate" id="dueDate" type="datetime-local" />
        </div>
        <div>
          <button type="submit">Сохранить</button>
          <button @click="closeModal">Закрыть</button>
        </div> -->
    </form>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: Boolean,
    isEditMode: Boolean,
    appealToEdit: Object,
  },
  data() {
    return {
      localAppeal: { ...this.appealToEdit },
    };
  },
  computed: {
    lastName: {
      get() {
        return this.localAppeal.applicant
          ? this.localAppeal.applicant.last_name
          : "";
      },
      set(value) {
        if (!this.localAppeal.applicant) this.localAppeal.applicant = {};
        this.localAppeal.applicant.last_name = value;
      },
    },
    firstName: {
      get() {
        return this.localAppeal.applicant
          ? this.localAppeal.applicant.first_name
          : "";
      },
      set(value) {
        if (!this.localAppeal.applicant) this.localAppeal.applicant = {};
        this.localAppeal.applicant.first_name = value;
      },
    },
    patronymicName: {
      get() {
        return this.localAppeal.applicant
          ? this.localAppeal.applicant.patronymic_name
          : "";
      },
      set(value) {
        if (!this.localAppeal.applicant) this.localAppeal.applicant = {};
        this.localAppeal.applicant.patronymic_name = value;
      },
    },
    phone: {
      get() {
        return this.localAppeal.applicant
          ? this.localAppeal.applicant.username
          : "";
      },
      set(value) {
        if (!this.localAppeal.applicant) this.localAppeal.applicant = {};
        this.localAppeal.applicant.username = value;
      },
    },
    description: {
      get() {
        return this.localAppeal.description || "";
      },
      set(value) {
        this.localAppeal.description = value;
      },
    },
    dueDate: {
      get() {
        return this.localAppeal.due_date || "";
      },
      set(value) {
        this.localAppeal.due_date = value;
      },
    },
  },
  watch: {
    appealToEdit(newAppeal) {
      this.localAppeal = { ...newAppeal };
    },
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    saveAppeal() {
      this.$emit("save-appeal", this.localAppeal);
    },
  },
};
</script>

<style scoped lang="scss">
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;

  .modal-form {
    position: absolute;
    width: 738px;
    padding: 24px 32px 24px 32px;
    gap: 24px;
    border-radius: 8px;
    background-color: #ffffff;

    .modal-close {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 10px;

      .modal-close-button {
        width: 18px;
        height: 18px;
        cursor: pointer;
        opacity: 0.6;
        transition: 0.3s;
      }

      .modal-close-button:hover {
        opacity: 1;
      }
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: none;
      padding: 0px;
      margin-bottom: 24px;

      .modal-header-title {
        font-family: Roboto;
        font-size: 16px;
        font-weight: 500;
        line-height: 24px;
        text-underline-position: from-font;
        color: #333333;
      }

      .modal-header-status {
        font-family: Inter;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        text-underline-position: from-font;
      }
    }

    .modal-fields,
    .modal-fields-description {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2px;
      margin-bottom: 32px;

      .input-block {
        .input-block-title {
          font-family: Roboto;
          font-size: 12px;
          font-weight: 400;
          color: #50b053;
          margin: 0px;
        }

        .modal-fields-inputs,
        .modal-fields-inputs-contact,
        .modal-fields-inputs-description {
          width: 215px;
          height: 28px;
          padding: 0px;
          border: none;
          border-bottom: 1px solid #cccccc;
          font-family: Roboto;
          font-size: 14px;
          font-weight: 400;
          color: #333333;
        }

        .modal-fields-inputs:focus,
        .modal-fields-inputs-contact:focus,
        .modal-fields-inputs-description:focus {
          border-bottom: 1px solid #cccccc;
          outline: none;
        }

        .modal-fields-inputs-contact {
          width: 157px;
        }

        .modal-fields-inputs-description {
          width: 674px;
          height: 132px;
          padding: 8px 12px 8px 0px;
          opacity: 0px;
          resize: none;
        }
      }
    }

    .modal-fields-description {
      margin-bottom: 24px;
    }

    .modal-button-block {
      display: flex;
      justify-content: flex-end;
      .modal-button-block-save {
        width: 102px;
        height: 36px;
        border-radius: 2px;
        color: #ffffff;
        background: #50b053;
        border: none;
        font-family: Roboto;
        font-size: 14px;
        font-weight: 400;
        text-align: center;
        opacity: 0.6;
        transition: 0.3s;
      }

      .modal-button-block-save:hover {
        background-color: #44a248;
        color: #ffffff;
        opacity: 1;
      }
    }
  }
}
</style>
