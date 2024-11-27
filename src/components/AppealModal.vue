<!-- eslint-disable prettier/prettier -->
<template>
  <div v-if="isVisible" class="modal">
    <div v-if="localAppeal">
      <h2>{{ isEditMode ? "Редактировать заявку" : "Создать заявку" }}</h2>
      <form @submit.prevent="saveAppeal">
        <div>
          <label for="lastName">Фамилия</label>
          <input
            v-model="localAppeal.applicant.last_name"
            id="lastName"
            type="text"
          />
        </div>
        <div>
          <label for="firstName">Имя</label>
          <input
            v-model="localAppeal.applicant.first_name"
            id="firstName"
            type="text"
          />
        </div>
        <div>
          <label for="patronymicName">Отчество</label>
          <input
            v-model="localAppeal.applicant.patronymic_name"
            id="patronymicName"
            type="text"
          />
        </div>
        <div>
          <label for="phone">Телефон</label>
          <input
            v-model="localAppeal.applicant.username"
            id="phone"
            type="text"
          />
        </div>
        <div>
          <label for="description">Описание</label>
          <textarea
            v-model="localAppeal.description"
            id="description"
          ></textarea>
        </div>
        <div>
          <label for="dueDate">Срок</label>
          <input
            v-model="localAppeal.due_date"
            id="dueDate"
            type="datetime-local"
          />
        </div>
        <div>
          <button type="submit">Сохранить</button>
        </div>
      </form>
    </div>
    <button @click="closeModal">Закрыть</button>
  </div>
</template>
<!-- eslint-disable prettier/prettier -->

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
