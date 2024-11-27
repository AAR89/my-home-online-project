<template>
  <div v-if="isVisible" class="modal">
    <div v-if="localAppeal">
      <form @submit.prevent="saveAppeal">
        <h2>{{ isEditMode ? "Редактировать заявку" : "Создать заявку" }}</h2>
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
        </div>
      </form>
    </div>
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
      // Локальная копия данных, чтобы не изменять пропс напрямую
      localAppeal: { ...this.appealToEdit },
    };
  },
  computed: {
    // Вычисляемые свойства для каждого поля
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
      // Если данные в пропсе изменяются, обновляем локальную копию
      this.localAppeal = { ...newAppeal };
    },
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    saveAppeal() {
      // Передаем обновленные данные родительскому компоненту
      this.$emit("save-appeal", this.localAppeal);
    },
  },
};
</script>

<style scoped>
.modal {
  /* Пример стилей для модального окна */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 50px;
  background: white;
  border-radius: 8px;
}

input,
textarea {
  width: 100%;
  padding: 8px;
  margin: 10px 0px 10px 0px;
  border-radius: 4px;
}

button {
  background: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
}

button:hover {
  background: #0056b3;
}
</style>
