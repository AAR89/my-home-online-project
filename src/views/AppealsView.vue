<template>
  <div class="appeals">
    <h1 class="appeals-title">Список заявок</h1>
    <div class="table-pagination-wrapper">
      <section class="table-section">
        <section class="create-section">
          <button class="create-appeal-button" @click="openModal(null)">
            СОЗДАТЬ
          </button>
        </section>
        <table>
          <thead>
            <tr>
              <th class="th-sort" @click="sortTable('number')">
                №
                <span v-if="currentSort === 'number'">{{ sortDirection }}</span>
              </th>
              <th class="th-sort" @click="sortTable('created_at')">
                Создана
                <span v-if="currentSort === 'created_at'">{{
                  sortDirection
                }}</span>
              </th>
              <th>Адрес</th>
              <th>Заявитель</th>
              <th>Описание</th>
              <th>Срок</th>
              <th class="th-sort" @click="sortTable('status')">
                Статус
                <span v-if="currentSort === 'status'">{{ sortDirection }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="appeal in paginatedAppeals"
              :key="appeal.id"
              @click="openModal(appeal)"
            >
              <section class="td-number-section">
                <button class="number-button">{{ appeal.number }}</button>
              </section>
              <td>{{ formatDate(appeal.created_at) }}</td>
              <td>
                {{ "нет информации" || appeal.apartment?.label }}
              </td>
              <td>{{ appeal.applicant ? appeal.applicant?.username : "" }}</td>
              <td class="description">
                {{ truncateText(appeal.description, 30) }}
                <span
                  v-if="appeal.description.length > 30"
                  class="description-text"
                >
                  {{ appeal.description }}
                </span>
              </td>
              <td>{{ formatDate(appeal.due_date) }}</td>
              <td
                :class="{
                  'red-status': appeal.status.is_red_details,
                  'green-status': !appeal.status.is_red_details,
                }"
                class="status-cell"
              >
                {{
                  appeal.status.is_red_details
                    ? "Просрочено"
                    : appeal.status.name
                }}
                <span v-if="appeal.status.is_red_details" class="tooltip">
                  {{ appeal.status.short_details }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <nav class="pagination-container">
          <div class="pages-container">
            <div class="pagination-info">
              {{ (currentPage - 1) * perPage + 1 }}
              <div class="info-small">–</div>
              {{ paginatedAppeals.length }}
              <div class="info-small">из</div>
              {{ appeals.length }}
              <div class="info-small">записей</div>
            </div>
            <select
              v-model="perPage"
              @change="handlePerPageChange"
              class="per-page-selector"
            >
              <option
                v-for="option in appeals.length / 10"
                :key="option"
                :value="option * 10"
              >
                {{ option * 10 }}
              </option>
            </select>
          </div>
          <b-pagination
            class="pagination"
            v-model="currentPage"
            :total-rows="appeals.length"
            :per-page="perPage"
            aria-controls="appeals-table"
            pills
            size="sm"
          />
        </nav>
      </section>
    </div>
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
import { mapState, mapActions } from "vuex";
import { format } from "date-fns";
// import Pagination from "vue-pagination-2";
import AppealModal from "@/components/AppealModal.vue";

export default {
  components: {
    AppealModal,
  },
  data() {
    return {
      isModalVisible: false,
      isEditMode: false,
      appealToEdit: null,
      currentPage: 1,
      perPage: 10,
      sortDirection: "asc",
      currentSort: "",
    };
  },
  computed: {
    ...mapState(["appeals"]),
    totalPages() {
      return Math.ceil(this.appeals.length / this.perPage);
    },
    paginatedAppeals() {
      const sortedAppeals = [...this.appeal].sort((a, b) => {
        let statusA = "";
        let statusB = "";

        if (a.status && typeof a.status.name === "string") {
          statusA = a.status.name.trim().toLowerCase();
        }
        if (b.status && typeof b.status.name === "string") {
          statusB = b.status.name.trim().toLowerCase();
        }

        console.log("statusA:", statusA, "statusB:", statusB);

        if (this.currentSort === "status") {
          const compareResult = statusA.localeCompare(statusB);
          console.log("compareResult for status:", compareResult);
          return this.sortDirection === "asc" ? compareResult : -compareResult;
        }

        const fieldA = this.getField(a, this.currentSort);
        const fieldB = this.getField(b, this.currentSort);

        return this.sortDirection === "asc"
          ? String(fieldA).localeCompare(String(fieldB))
          : String(fieldB).localeCompare(String(fieldA));
      });

      console.log("Sorted Appeals:", sortedAppeals); // Выводим отсортированные данные

      const start = (this.currentPage - 1) * this.perPage;
      return sortedAppeals.slice(start, start + this.perPage);
    },
  },
  methods: {
    ...mapActions(["fetchAppeals", "createAppeal", "updateAppeal"]),
    getField(appeal, field) {
      if (field === "status") {
        return appeal.status?.name || "";
      }
      return appeal[field] || "";
    },
    sortTable(column) {
      if (this.currentSort === column) {
        this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      } else {
        this.currentSort = column;
        this.sortDirection = "asc";
      }
    },
    handlePerPageChange() {
      this.currentPage = 1; // Сбрасываем на первую страницу при изменении количества записей
    },
    changePage(page) {
      this.currentPage = page;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

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
        this.appealToEdit = appeal;
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
        };
      }
      this.isModalVisible = true;
    },

    closeModal() {
      this.isEditMode = false;
      this.isModalVisible = false;
    },

    async handleSave(updatedAppeal) {
      if (this.isEditMode) {
        await this.updateAppeal(updatedAppeal);
      } else {
        await this.createAppeal(updatedAppeal);
      }
      this.closeModal();
      this.fetchAppeals();
    },
  },
  created() {
    this.fetchAppeals();
  },
};
</script>

<style scoped lang="scss">
.appeals {
  background-color: #eeeeee;
  width: 100vw;
  padding: 23px 15px 15px 15px;
  position: relative;
  box-sizing: border-box;

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

  .table-pagination-wrapper {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  .table-section {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: space-between;

    box-shadow: 0 -2px 5px rgba(105, 103, 103, 0.1);
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

  th,
  .th-sort {
    font-family: Roboto;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
    color: #50b053;
    padding: 12px 8px 12px 8px;
    cursor: pointer;
  }

  .th-sort {
    background: url("../../public/arrow_upward_alt.png") no-repeat right;
  }

  td,
  .td-number {
    padding: 10px 8px 10px 8px;
    font-family: "Inter";
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    text-align: left;
    text-underline-position: from-font;
    color: #333333;
    cursor: pointer;
  }

  .td-number-section {
    width: Fill (100px) px;
    height: Fixed (58px) px;
    padding: 15px 40px 15px 4px;
    gap: 8px;
    opacity: 0px;

    .number-button {
      padding: 12px 16px 12px 16px;
      gap: 8px;
      border-radius: 4px;
      opacity: 0px;
      background: #50b053;
      color: #ffffff;
      text-align: center;
      cursor: pointer;
      border: #ffffff;
    }

    .number-button:hover {
      background-color: #44a248;
      color: #ffffff;
      transition: background-color 0.3s ease, border-color 0.3s ease,
        color 0.3s ease;
    }
  }

  .status-cell {
    position: relative;
    cursor: default;
  }

  .red-status {
    color: red;
  }

  .green-status {
    color: green;
  }

  .description {
    position: relative;
    display: inline-block;
    cursor: pointer;
  }

  .description-text {
    visibility: hidden;
    width: 200px;
    background-color: #eeeeee;
    color: #333333;
    text-align: center;
    border-radius: 5px;
    padding: 5px;
    position: absolute;
    z-index: 1;
    bottom: -125%;
    left: 50%;
    margin-left: -100px;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .tooltip {
    position: relative;
    display: inline-block;
    cursor: pointer;
    visibility: hidden;
    opacity: 0;
    background-color: red;
    color: white;
    text-align: center;
    border-radius: 4px;
    padding: 5px 10px;
    position: absolute;
    z-index: 10;
    bottom: -25%;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    font-size: 12px;
    transition: opacity 0.3s ease;
  }

  .tooltip2 {
    position: relative;
    display: inline-block;
    cursor: pointer;
    visibility: hidden;
    opacity: 0;
    background-color: #50b053;
    color: white;
    text-align: center;
    border-radius: 4px;
    padding: 5px 10px;
    position: absolute;
    z-index: 10;
    bottom: -25%;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    font-size: 12px;
    transition: opacity 0.3s ease;
  }

  .tooltip-text {
    visibility: hidden;
    font-family: "Inter";
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    width: 200px;
    background-color: #50b053;
    color: #ffffff;
    text-align: left;
    border-radius: 5px;
    padding: 5px;
    position: absolute;
    z-index: 1;
    bottom: -125%;
    left: 50%;
    margin-left: -100px;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .tooltip::after,
  .description-text:after {
    content: "";
    position: absolute;
    bottom: 100%;
    left: 50%;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent red transparent;
  }
  .tooltip::after {
    transform: translateX(-150%);
    border-color: transparent transparent red transparent;
  }

  .description-text::after {
    transform: translateX(-50%);
    border-color: transparent transparent #eeeeee transparent;
  }

  .status-cell:hover .tooltip,
  .description:hover .description-text {
    visibility: visible;
    opacity: 1;
  }

  .pagination-container {
    position: sticky;
    bottom: 0;
    background-color: white;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .pages-container {
      display: flex;
      gap: 16px;
      padding-bottom: 10px;
      .pagination-info {
        display: flex;
        align-items: center;
        gap: 3px;
        padding-left: 5px;
        font-family: Roboto;
        font-size: 14px;
        font-weight: 700;
        line-height: 16.41px;
        text-underline-position: from-font;
        color: #333333;

        .info-small {
          font-family: Roboto;
          font-size: 12px;
          font-weight: 400;
          line-height: 18px;
          text-underline-position: from-font;
          color: #333333;
        }
      }

      .per-page-selector {
        width: 90px;
        padding: 4px 8px;
        font-family: Roboto;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        text-align: left;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;
        border: white;
        border-bottom: 1px solid #cccccc;
        color: #333333;
        appearance: none;
        overflow: hidden;
        background: url("../../public/Rectangle.png") no-repeat right;

        option {
          font-family: Roboto;
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          color: #333333;
        }

        option:hover {
          background-color: #50b053;
        }
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: space-between;
    // box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
    width: 40%;
  }

  ::v-deep .pagination > li > button,
  ::v-deep .pagination > li.disabled > span {
    background-color: white;
    border-color: white;
    color: #6c757d;
    font-family: Roboto;
  }

  ::v-deep .pagination > li > button:focus {
    background: #50b053;
    color: #ffffff;
    box-shadow: 0 0 0 0.25rem white;
  }

  ::v-deep .pagination > li > button:hover {
    border-color: #50b053;
    color: #50b053;
  }

  ::v-deep .pagination > li.active > button {
    color: white;
    background-color: #50b053 !important;
    border: solid 1px #50b053 !important;
  }

  ::v-deep .pagination > .page-item:disabled {
    background-color: #ffffff !important;
  }
}
</style>
