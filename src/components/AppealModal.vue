<template>
  <div v-if="isVisible" class="modal">
    <form
      id="modal-form"
      class="modal-form"
      v-if="localAppeal"
      @submit.prevent="saveAppeal"
    >
      <div class="modal-close">
        <img
          @click="closeModal()"
          class="modal-close-button"
          src="../../public/close.png"
          alt="Close icon"
        />
      </div>
      <header class="modal-header">
        <h2 class="modal-header-title">
          {{
            !isEditMode
              ? "Создание заявки"
              : `Заявка № ${number} (от ${formatDate(created_at, "create")})`
          }}
        </h2>
        <h1
          v-show="isEditMode"
          class="modal-header-status"
          :class="{
            'red-status': this.localAppeal.status.is_red_details,
            'green-status': !this.localAppeal.status.is_red_details,
          }"
        >
          {{ status }}
        </h1>
        <h1 v-show="!isEditMode" class="modal-header-status">
          {{ "Новая" }}
        </h1>
      </header>
      <div v-show="!isEditMode" class="editMode-container">
        <section class="modal-fields">
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
        <section class="modal-fields">
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
        <section class="modal-fields-description">
          <div class="input-block">
            <p class="input-block-title">Описание заявки</p>
            <textarea
              :v-model="description"
              id="dueDate"
              class="modal-fields-inputs-description"
              type="text"
            />
          </div>
        </section>
        <section class="modal-button-block">
          <button type="submit" class="modal-button-block-save">
            {{ "Создать" }}
          </button>
        </section>
      </div>

      <div v-show="isEditMode" class="editMode-container">
        <section class="modal-fields">
          <div class="input-block">
            <p class="input-block-title">Дом</p>
            <input class="modal-fields-inputs" type="text" v-model="address" />
          </div>
          <div class="input-block">
            <p class="input-block-title">Квартира</p>
            <input
              class="modal-fields-inputs"
              type="number"
              v-model="apartment"
              min="1"
            />
          </div>
          <div class="input-block">
            <p class="input-block-title">Срок</p>
            <input
              class="modal-fields-inputs"
              type="datetime-local"
              :v-model="formatDate(due_date, 'due-date')"
              :value="formatDate(due_date, 'due-date')"
            />
          </div>
        </section>
        <section class="modal-fields">
          <div class="input-block">
            <p class="input-block-title">Фамилия</p>
            <input
              class="modal-fields-inputs-contact"
              type="text"
              v-model="lastName"
            />
          </div>
          <div class="input-block">
            <p class="input-block-title">Имя</p>
            <input
              class="modal-fields-inputs-contact"
              type="text"
              v-model="firstName"
            />
          </div>
          <div class="input-block">
            <p class="input-block-title">Отчество</p>

            <input
              class="modal-fields-inputs-contact"
              type="text"
              v-model="patronymicName"
            />
          </div>
          <div class="input-block">
            <p class="input-block-title">Телефон</p>
            <input
              class="modal-fields-inputs-contact"
              type="tel"
              v-model="phone"
            />
          </div>
        </section>
        <section class="modal-fields-description">
          <div class="input-block">
            <p class="input-block-title">Описание заявки</p>
            <textarea
              v-model="description"
              id="dueDate"
              class="modal-fields-inputs-description"
              type="text"
            />
          </div>
        </section>
        <section class="modal-button-block">
          <button type="submit" class="modal-button-block-save">
            {{ "Сохранить" }}
          </button>
        </section>
      </div>
    </form>
  </div>
</template>

<script>
import { format } from "date-fns";

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
    number: {
      get() {
        return this.localAppeal.number ? this.localAppeal.number : "";
      },
    },
    created_at: {
      get() {
        return this.localAppeal.created_at ? this.localAppeal.created_at : "";
      },
      set(value) {
        if (!this.localAppeal.created_at) this.created_at.applicant = {};
        this.localAppeal.created_at = value;
      },
    },
    status: {
      get() {
        return this.localAppeal.status.name;
      },
    },
    address: {
      get() {
        return this.localAppeal.premise?.address
          ? this.localAppeal.premise?.address
          : "";
      },
      set(value) {
        if (!this.localAppeal.premise?.address)
          this.localAppeal.premise.address = {};
        this.localAppeal.premise.address = value;
      },
    },
    apartment: {
      get() {
        return this.localAppeal.apartment?.number
          ? this.localAppeal.apartment?.number
          : "";
      },
      set(value) {
        if (!this.localAppeal.apartment?.number)
          this.localAppeal.apartment.number = {};
        this.localAppeal.apartment.number = value;
      },
    },
    due_date: {
      get() {
        return this.localAppeal.due_date ? this.localAppeal.due_date : "";
      },
      set(value) {
        if (!this.localAppeal.due_date) this.created_at.due_date = {};
        this.localAppeal.due_date = value;
      },
    },
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
        return this.localAppeal.description ? this.localAppeal.description : "";
      },
      set(value) {
        this.localAppeal.description = value;
      },
    },
    dueDate: {
      get() {
        return this.localAppeal.due_date ? this.localAppeal.due_date : "";
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
      console.log("save");
      this.closeModal();
    },
    formatDate(dateString, type) {
      if (type === "due-date") {
        return format(new Date(dateString), "yyyy-MM-dd'T'hh:mm");
      }
      if (!dateString) return "нет информации";
      return format(new Date(dateString), "dd.MM.yyyy");
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

      .red-status {
        color: red;
      }

      .green-status {
        color: green;
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
