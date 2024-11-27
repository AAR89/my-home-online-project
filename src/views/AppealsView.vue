<!-- eslint-disable prettier/prettier -->
<template>
  <div class="appeals">
    <h1>Список заявок</h1>
    <button @click="openModal">Создать заявку</button>
    <table>
      <thead>
        <tr>
          <th>№</th>
          <th>Создана</th>
          <th>Адрес</th>
          <th>Заявитель</th>
          <th>Описание</th>
          <th>Срок</th>
          <th>Статус</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="appeal in appeals"
          :key="appeal.id"
          @click="openModal(appeal)"
        >
          <td>{{ appeal.number }}</td>
          <td>{{ appeal.created_at }}</td>
          <td>{{ appeal.premise }} {{ appeal.apartment }}</td>
          <td>{{ appeal.applicant }}</td>
          <td>{{ appeal.description }}</td>
          <td>{{ appeal.due_date }}</td>
          <td>{{ appeal.status }}</td>
        </tr>
      </tbody>
    </table>
    <appeal-modal
      :is-visible="isModalVisible"
      :is-edit-mode="isEditMode"
      :appeal-to-edit="appealToEdit"
      @close="closeModal"
      @refresh="fetchAppeals"
    />
  </div>
</template>
<!-- eslint-disable prettier/prettier -->

<script>
import AppealModal from "@/components/AppealModal.vue";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    AppealModal,
  },
  data() {
    return {
      isModalVisible: false,
      isEditMode: false,
      appealToEdit: null,
    };
  },
  computed: {
    ...mapState(["appeals"]),
  },
  methods: {
    ...mapActions(["fetchAppeals"]),
    openModal(appeal = null) {
      if (appeal) {
        this.isEditMode = true;
        this.appealToEdit = appeal; // Убедитесь, что передаете объект заявки
      } else {
        this.isEditMode = false;
        this.appealToEdit = null;
      }
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
  },
  created() {
    this.fetchAppeals();
  },
};
</script>
