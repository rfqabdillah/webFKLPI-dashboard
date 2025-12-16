<template>
  <div>
    <div v-if="items.length > 0" class="table-responsive">
      <table class="table table-bordered table-hover">
        <thead class="table-light">
          <tr>
            <th width="5%">No</th>
            <th
              v-for="col in columns"
              :key="col.key"
              :width="col.width || 'auto'"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="getItemKey(item, index)">
            <td class="text-center">{{ index + 1 }}</td>
            <td v-for="col in columns" :key="col.key" :class="col.class || ''">
              <!-- Slot untuk custom cell rendering -->
              <slot
                :name="`cell(${col.key})`"
                :item="item"
                :value="getCellValue(item, col)"
              >
                <!-- Default rendering -->
                <template v-if="col.type === 'date'">
                  {{ formatValue(getCellValue(item, col), "date") }}
                </template>
                <template v-else-if="col.type === 'status'">
                  <span
                    class="badge"
                    :class="{
                      'bg-success': getCellValue(item, col) === 'Aktif',
                      'bg-secondary': getCellValue(item, col) !== 'Aktif',
                    }"
                  >
                    {{ getCellValue(item, col) || "-" }}
                  </span>
                </template>
                <template v-else-if="col.type === 'file'">
                  <a
                    v-if="getCellValue(item, col)"
                    :href="getCellValue(item, col)"
                    target="_blank"
                    class="btn btn-sm btn-outline-primary file-btn"
                    :title="col.fileLabel || 'Lihat File'"
                  >
                    <i class="fa fa-file-text-o"></i>
                  </a>
                  <span v-else>-</span>
                </template>
                <template v-else>
                  {{ getCellValue(item, col) || "-" }}
                </template>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <i :class="`fa ${emptyIcon} fa-3x text-muted mb-3`"></i>
      <p class="text-muted mb-0">{{ emptyMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { formatDate } from "@/utils/formatDate";

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Array,
    required: true,
    // Format: [{ key: 'fieldName', label: 'Column Label', width: '15%', type: 'text|date|status|file', class: 'text-center', fileLabel: 'Lihat File' }]
  },
  itemKey: {
    type: String,
    default: "id",
  },
  emptyIcon: {
    type: String,
    default: "fa-inbox",
  },
  emptyMessage: {
    type: String,
    default: "Belum ada data",
  },
});

function getItemKey(item, index) {
  return item[props.itemKey] || index;
}

function getNestedValue(obj, path) {
  if (!obj || !path) return null;
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}

function getCellValue(item, col) {
  // Jika ada getValue function, gunakan itu
  if (typeof col.getValue === "function") {
    return col.getValue(item);
  }

  // Jika key mengandung titik, akses nested property
  if (col.key.includes(".")) {
    return getNestedValue(item, col.key);
  }

  // Akses property langsung
  return item[col.key];
}

function formatValue(value, type) {
  if (!value) return "-";
  if (type === "date") {
    return formatDate(value);
  }
  return value;
}
</script>

<style scoped>
.table {
  font-size: 0.9rem;
  margin-bottom: 0;
}

.table thead th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
  border-color: #dee2e6;
  vertical-align: middle;
}

.table tbody td {
  vertical-align: middle;
}

.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}

.empty-state {
  text-align: center;
  padding: 3rem 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 2px dashed #dee2e6;
}

.empty-state i {
  opacity: 0.5;
}

.empty-state p {
  margin: 0;
  font-size: 1rem;
}

.file-btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.file-btn:hover {
  background-color: #7366ff;
  border-color: #7366ff;
  color: white;
}
</style>
