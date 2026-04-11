<template>
  <div class="search-select-container" ref="containerRef">
    <div
      class="search-select-input form-control d-flex align-items-center"
      :class="{
        'is-invalid': isInvalid,
        disabled: disabled,
        shake: shake,
        focus: isOpen,
      }"
      @click="toggleDropdown"
    >
      <span
        v-if="selectedLabel"
        class="selected-label text-truncate flex-grow-1"
      >
        {{ selectedLabel }}
      </span>
      <span v-else class="placeholder-text text-muted flex-grow-1">
        {{ disabled ? loadingPlaceholder : placeholder }}
      </span>
      <span class="d-flex align-items-center gap-1">
        <button
          v-if="modelValue && clearable"
          type="button"
          class="btn-clear"
          @click.stop="clearSelection"
          title="Hapus pilihan"
        >
          <i class="fa fa-times"></i>
        </button>
        <i
          class="fa fa-chevron-down chevron-icon"
          :class="{ rotated: isOpen }"
        ></i>
      </span>
    </div>

    <Transition name="dropdown-fade">
      <div v-if="isOpen" class="search-select-dropdown shadow-sm">
        <div class="search-input-wrapper">
          <i class="fa fa-search search-icon"></i>
          <input
            ref="searchInputRef"
            type="text"
            class="form-control search-input"
            v-model="searchQuery"
            :placeholder="searchPlaceholder"
            @input="onSearchInput"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="btn-clear-search"
            @click="
              searchQuery = '';
              onSearchInput();
            "
          >
            <i class="fa fa-times"></i>
          </button>
        </div>

        <div class="options-list" ref="optionsListRef">
          <div
            v-if="isSearching"
            class="option-item text-center text-muted py-3"
          >
            <i class="fa fa-spinner fa-spin me-2"></i>Mencari...
          </div>
          <div
            v-else-if="filteredOptions.length === 0"
            class="option-item text-center text-muted py-3"
          >
            {{ searchQuery ? "Tidak ditemukan" : "Tidak ada data" }}
          </div>
          <template v-else>
            <div
              v-for="item in filteredOptions"
              :key="item[valueKey]"
              class="option-item"
              :class="{ active: modelValue === item[valueKey] }"
              @click="selectOption(item)"
            >
              {{ item[labelKey] }}
            </div>
          </template>
        </div>

        <div v-if="totalItems > 0" class="dropdown-footer text-muted">
          Menampilkan {{ filteredOptions.length }} dari {{ totalItems }} data
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from "vue";

const props = defineProps({
  modelValue: { type: [String, Number], default: "" },
  apiFn: { type: Function, required: true },
  valueKey: { type: String, default: "id" },
  labelKey: { type: String, default: "nama" },
  filterKey: { type: String, default: "nama" },
  initialLabel: { type: String, default: "" },
  placeholder: { type: String, default: "Pilih..." },
  searchPlaceholder: { type: String, default: "Ketik untuk mencari" },
  loadingPlaceholder: { type: String, default: "Memuat..." },
  perPage: { type: Number, default: 20 },
  disabled: { type: Boolean, default: false },
  isInvalid: { type: Boolean, default: false },
  shake: { type: Boolean, default: false },
  clearable: { type: Boolean, default: true },
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);
const searchQuery = ref("");
const isSearching = ref(false);
const options = ref([]);
const totalItems = ref(0);
const containerRef = ref(null);
const searchInputRef = ref(null);
const optionsListRef = ref(null);

let debounceTimer = null;
const selectedCache = reactive({});

const filteredOptions = computed(() => options.value);

const selectedLabel = computed(() => {
  if (!props.modelValue) return "";
  const found = options.value.find(
    (item) => item[props.valueKey] === props.modelValue,
  );
  if (found) return found[props.labelKey];
  if (selectedCache[props.modelValue]) return selectedCache[props.modelValue];
  if (props.initialLabel) return props.initialLabel;
  return "";
});

async function fetchOptions(query = "") {
  isSearching.value = true;
  try {
    const params = { per_page: props.perPage };
    if (query) {
      params.filter = `${props.filterKey}=${query}`;
    }
    const res = await props.apiFn(params);
    const responseBody = res.data?.[0] || {};
    options.value = responseBody.data || [];
    totalItems.value =
      responseBody.meta?.pagination?.total || options.value.length;

    options.value.forEach((item) => {
      selectedCache[item[props.valueKey]] = item[props.labelKey];
    });
  } catch (err) {
    console.error("Gagal memuat data:", err);
    options.value = [];
  } finally {
    isSearching.value = false;
  }
}

function onSearchInput() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    fetchOptions(searchQuery.value);
  }, 350);
}

function toggleDropdown() {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    searchQuery.value = "";
    fetchOptions();
    nextTick(() => {
      searchInputRef.value?.focus();
    });
  }
}

function selectOption(item) {
  emit("update:modelValue", item[props.valueKey]);
  selectedCache[item[props.valueKey]] = item[props.labelKey];
  isOpen.value = false;
}

function clearSelection() {
  emit("update:modelValue", "");
}

function handleClickOutside(e) {
  if (containerRef.value && !containerRef.value.contains(e.target)) {
    isOpen.value = false;
  }
}

// Fetch initial selected label if modelValue is set but not in options
watch(
  () => props.modelValue,
  async (newVal) => {
    if (newVal && !selectedCache[newVal]) {
      try {
        const res = await props.apiFn({
          per_page: 1,
          filter: `${props.valueKey}=${newVal}`,
        });
        const responseBody = res.data?.[0] || {};
        const data = responseBody.data || [];
        if (data.length > 0) {
          selectedCache[data[0][props.valueKey]] = data[0][props.labelKey];
        }
      } catch {
        // Silently fail
      }
    }
  },
  { immediate: true },
);

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
  clearTimeout(debounceTimer);
});
</script>

<style scoped>
.search-select-container {
  position: relative;
}

.search-select-input {
  cursor: pointer;
  min-height: 38px;
  padding: 0.375rem 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  background-color: #fff;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.search-select-input.focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.search-select-input.disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
  opacity: 0.65;
}

.search-select-input.is-invalid {
  border-color: #dc3545;
  background-image: none;
}

.selected-label {
  font-size: 0.95rem;
}

.placeholder-text {
  font-size: 0.95rem;
}

.chevron-icon {
  font-size: 0.7rem;
  color: #6c757d;
  transition: transform 0.2s ease;
}

.chevron-icon.rotated {
  transform: rotate(180deg);
}

.btn-clear {
  background: none;
  border: none;
  color: #6c757d;
  padding: 0 4px;
  font-size: 0.8rem;
  cursor: pointer;
  line-height: 1;
}

.btn-clear:hover {
  color: #dc3545;
}

.search-select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1050;
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  margin-top: 4px;
  overflow: hidden;
}

.search-input-wrapper {
  position: relative;
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.search-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #adb5bd;
  font-size: 0.85rem;
}

.search-input {
  padding-left: 32px;
  padding-right: 28px;
  font-size: 0.9rem;
  border-color: #dee2e6;
}

.search-input:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
}

.btn-clear-search {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #adb5bd;
  cursor: pointer;
  font-size: 0.8rem;
  padding: 2px;
}

.btn-clear-search:hover {
  color: #6c757d;
}

.options-list {
  max-height: 220px;
  overflow-y: auto;
}

.option-item {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.1s;
}

.option-item:hover {
  background-color: #f0f4ff;
}

.option-item.active {
  background-color: #e7f1ff;
  color: #0d6efd;
  font-weight: 500;
}

.dropdown-footer {
  padding: 6px 12px;
  font-size: 0.78rem;
  border-top: 1px solid #eee;
  background-color: #fafafa;
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.shake {
  animation: shake 0.3s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
