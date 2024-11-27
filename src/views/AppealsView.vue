<template>
  <div class="appeals">
    <h1 class="appeals-title">Список заявок</h1>
    <section class="table-section">
      <section class="create-section">
        <button class="create-appeal-button" @click="openModal(null)">
          СОЗДАТЬ
        </button>
      </section>
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
            <td>{{ formatDate(appeal.created_at) }}</td>
            <td>
              {{
                appeal.apartment?.label
                  ? appeal.apartment.label
                  : "нет информации"
              }}
            </td>
            <td>{{ appeal.applicant ? appeal.applicant?.username : "" }}</td>
            <td>{{ truncateText(appeal.description, 30) }}</td>
            <td>{{ formatDate(appeal.due_date) }}</td>
            <td :class="{ 'red-status': appeal.status.is_red_details }">
              {{ appeal.status.name }}
              {{
                appeal.status.is_red_details ? appeal.status.short_details : ""
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
    <appeal-modal
      :is-visible="isModalVisible"
      :is-edit-mode="isEditMode"
      :appeal-to-edit="appealToEdit"
      @close="closeModal"
      @save="handleSave"
      @refresh="fetchAppeals"
    />
  </div>
</template>

<script>
import AppealModal from "@/components/AppealModal.vue";
import { mapState, mapActions } from "vuex";
import { format } from "date-fns";

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
    ...mapActions(["fetchAppeals", "createAppeal", "updateAppeal"]),
    truncateText(text, maxLength) {
      if (!text) return "нет информации";
      return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    },
    formatDate(dateString) {
      if (!dateString) return "нет информации";
      return format(new Date(dateString), "dd.MM.yyyy");
    },
    openModal(appeal) {
      if (appeal) {
        this.isEditMode = true;
        this.appealToEdit = appeal; // Передаем только объект заявки
      } else {
        this.isEditMode = false;
        this.appealToEdit = {
          number: null,
          created_at: new Date().toLocaleString(),
          premise: "",
          apartment: "",
          applicant: "",
          description: "",
          due_date: "",
          status: "Новый",
        }; // Новый пустой объект для создания
      }
      this.isModalVisible = true;
    },
    closeModal() {
      this.isEditMode = false;
      this.isModalVisible = false;
    },
    async handleSave(updatedAppeal) {
      if (this.isEditMode) {
        // Обновление существующей заявки
        await this.updateAppeal(updatedAppeal);
      } else {
        // Создание новой заявки
        await this.createAppeal(updatedAppeal);
      }
      this.closeModal();
      this.fetchAppeals(); // Обновляем список заявок после сохранения
    },
  },
  created() {
    this.fetchAppeals(); // Загружаем список заявок при монтировании компонента
  },
};
</script>

<style scoped lang="scss">
.appeals {
  background-color: #eeeeee;
  width: 1350px;
  padding: 23px 15px 0px 15px;

  .appeals-title {
    margin: 0px 0px 40px 32px;
    font-family: Roboto;
    font-size: 20px;
    font-weight: 400;
    line-height: 24px;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
    color: #454545;
  }

  .table-section,
  table {
    padding: 10px 20px 10px 20px;
    border-radius: 8px;
    background-color: #ffffff;

    .create-section {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      margin-bottom: 32px;
      .create-appeal-button {
        width: 78px;
        height: 26px;
        border-radius: 2px;
        background: #50b053;
        border: #50b053;
        font-family: Roboto;
        font-size: 10px;
        font-weight: 400;
        text-align: center;
        text-underline-position: from-font;
        color: #ffffff;
      }
    }
  }

  th {
    font-family: Roboto;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
    color: #50b053;
  }

  td {
    padding: 10px 8px 10px 8px;
  }

  .red-status {
    color: red;
  }
}
</style>
