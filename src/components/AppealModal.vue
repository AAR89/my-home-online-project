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
      <div class="editMode-container">
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
              min="1"
              v-model="apartment"
            />
          </div>
          <div class="input-block">
            <p class="input-block-title">Срок</p>
            <!-- <input
              class="modal-fields-inputs"
              type="datetime-local"
              :v-model="formatDate(due_date, 'due-date')"
              :value="formatDate(due_date, 'due-date')"
            /> -->
            <!-- <input
              class="modal-fields-inputs"
              type="datetime-local"
              v-model="due_date"
            /> -->
            <date-picker
              type="datetime"
              :format="'DD.MM.YYYY HH:mm'"
              lang="ru"
              v-model="due_date"
              value="due_date"
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
              id="description"
              class="modal-fields-inputs-description"
              type="text"
            />
          </div>
        </section>
        <section class="modal-button-block">
          <button type="submit" class="modal-button-block-save">
            {{ isEditMode ? "Сохранить" : "Создать" }}
          </button>
        </section>
      </div>
    </form>
  </div>
</template>

<script>
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/locale/ru";
import "vue2-datepicker/index.css";
import { mapActions } from "vuex";
import { format } from "date-fns";

export default {
  components: {
    DatePicker,
  },
  props: {
    isVisible: Boolean,
    isEditMode: Boolean,
    appealToEdit: Object,
  },
  data() {
    return {
      localAppeal: { ...this.appealToEdit },
      applicant: this.appealToEdit?.applicant || {
        first_name: "",
        last_name: "",
        patronymic_name: "",
        phone: "",
      },
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
        return this.localAppeal.created_at || "";
      },
      set(value) {
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
        return this.localAppeal.premise?.address || "";
      },
      set(value) {
        if (!this.localAppeal.premise)
          this.localAppeal.premise = { address: value };
        else this.localAppeal.premise.address = value;
      },
    },
    apartment: {
      get() {
        return this.localAppeal.apartment?.number || "";
      },
      set(value) {
        if (!this.localAppeal.apartment) {
          this.localAppeal.apartment = { number: value };
        } else {
          this.localAppeal.apartment.number = value;
        }
      },
    },
    due_date: {
      get() {
        return this.localAppeal.due_date || "";
      },
      set(value) {
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
        return this.localAppeal.description || "";
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
    ...mapActions(["createAppeal", "updateAppeal"]),
    closeModal() {
      this.$emit("close");
    },
    saveAppeal() {
      const appeal = {
        apartment: this.localAppeal.apartment || null,
        applicant: {
          first_name: this.localAppeal.applicant.first_name || "",
          last_name: this.localAppeal.applicant.last_name || "",
          patronymic_name: this.localAppeal.applicant.patronymic_name || "",
          phone: this.localAppeal.applicant.phone || "",
        },
        created_at: new Date().toISOString(),
        description: this.localAppeal.description || "",
        due_date: this.localAppeal.due_date
          ? new Date(this.localAppeal.due_date).toISOString()
          : null,
        premise: this.localAppeal.premise.address || "",
        status: this.localAppeal.status || "Новый",
      };

      this.$store
        .dispatch("createAppeal", appeal)
        .then(() => {
          console.log("Заявка успешно создана");
          this.closeModal();
        })
        .catch((error) => {
          console.error("Ошибка при создании заявки", error);
        });
    },

    formatDate(dateString, type) {
      if (type === "due-date") {
        console.log(dateString);
        return dateString;
        // return format(new Date(dateString), "DD.MM.YYYY HH:mm");
      }
      if (!dateString) return "нет информации";
      return format(new Date(dateString), "dd.MM.yyyy");
    },

    async handleSave() {
      try {
        if (this.isEditMode) {
          await this.updateAppeal(this.localAppeal);
        } else {
          await this.createAppeal(this.localAppeal);
        }
        this.$emit("close");
      } catch (error) {
        console.error("Ошибка при сохранении заявки", error);
      }
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
        .modal-fields-inputs-description,
        ::v-deep .mx-input {
          width: 215px;
          height: 28px;
          padding: 0px;
          border: none !important;
          border-bottom: 1px solid #cccccc !important;
          font-family: Roboto;
          font-size: 14px;
          font-weight: 400;
          color: #333333;
        }

        ::v-deep .mx-input {
          box-shadow: none;
        }

        ::v-deep .mx-icon-calendar {
          display: none;
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
