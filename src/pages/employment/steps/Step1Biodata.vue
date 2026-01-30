<template>
  <div class="step-biodata">
    <ModeSelectionCards v-if="!mode && !isEditMode" @select-mode="selectMode" />

    <UserSelectionTable
      v-if="mode === 'existing' && !selectedUser && !isEditMode"
      :show="mode === 'existing'"
      @back="resetSelection"
      @select-user="selectUser"
    />

    <BiodataFormFields
      v-if="selectedUser || mode === 'new' || isEditMode"
      ref="formRef"
      :modelValue="formData"
      :mode="mode"
      :isEditMode="isEditMode"
      :isLoading="isLoadingUserData"
      @back="resetSelection"
      @photo-change="handlePhotoChange"
    />
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted, nextTick } from "vue";
import { useToast } from "vue-toastification";
import ModeSelectionCards from "./components/ModeSelectionCards.vue";
import UserSelectionTable from "./components/UserSelectionTable.vue";
import BiodataFormFields from "./components/BiodataFormFields.vue";

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  fieldToEdit: { type: Object, default: null },
});

const emit = defineEmits([
  "update:modelValue",
  "validation-change",
  "user-selected",
  "user-data-loaded",
  "photo-change",
]);

const toast = useToast();
const formRef = ref(null);

// === State ===
const mode = ref("");
const selectionMade = ref(false);
const selectedUser = ref(null);
const selectedUserId = ref("");
const isLoadingUserData = ref(false);
const selectedPhotoFile = ref(null);
const isPhotoRemoved = ref(false);

const formData = reactive({
  idpengguna: null,
  idlevel: "",
  idjeniskelamin: "",
  idjenispengguna: "",
  idjenispegawai: "",
  email: "",
  nama: "",
  telp: "",
  nik: "",
  gelardepan: "",
  gelarbelakang: "",
  alamat: "",
  kodekabupaten: "",
  kodepropinsi: "",
  nip: "",
  no_karpeg: "",
  tempatlahir: "",
  tanggallahir: "",
  foto: null,
  status: "Tidak Aktif",
  minat: "",
  keahlian: "",
});

// === Computed ===
const isEditMode = computed(() => !!props.fieldToEdit);

// === Watchers ===
watch(
  () => props.fieldToEdit,
  (newData) => {
    if (newData) {
      populateFormData(newData);
      selectionMade.value = true;
    }
  },
  { immediate: true },
);

watch(
  formData,
  () => {
    const data = {
      mode: isEditMode.value ? "edit" : mode.value,
      isExisting: mode.value === "existing" && !isEditMode.value,
      userId: isEditMode.value
        ? props.fieldToEdit.idpengguna
        : selectedUserId.value,
      userData: { ...formData },
      photoFile: selectedPhotoFile.value,
      isPhotoRemoved: isPhotoRemoved.value,
    };
    emit("update:modelValue", data);
  },
  { deep: true },
);

// Lifecycle
onMounted(() => {
  if (props.fieldToEdit) {
    populateFormData(props.fieldToEdit);
  }
});

// === Methods ===
function selectMode(selectedMode) {
  mode.value = selectedMode;
  if (selectedMode === "new") {
    selectionMade.value = true;
  }
}

function resetSelection() {
  selectionMade.value = false;
  mode.value = "";
  selectedUserId.value = "";
  selectedUser.value = null;

  // Reset Form
  Object.keys(formData).forEach((key) => (formData[key] = ""));
  formData.status = "Tidak Aktif";
  formData.foto = null;
  selectedPhotoFile.value = null;
  isPhotoRemoved.value = false;
}

async function selectUser(user) {
  selectedUser.value = user;
  selectedUserId.value = user.idpengguna || user.email;
  selectionMade.value = true;
  isLoadingUserData.value = true;

  await nextTick();

  populateFormData(user);

  emit("user-selected", user.idpengguna);
  emit("user-data-loaded", user);

  setTimeout(async () => {
    if (formRef.value) {
      const isValid = await formRef.value.validate();
      emit("validation-change", isValid);
    }
    isLoadingUserData.value = false;
  }, 300);
}

function populateFormData(data) {
  if (!data) return;

  formData.idpengguna = data.idpengguna;
  formData.nama = data.nama || "";
  formData.gelardepan = data.gelardepan || data.gelar_depan || "";
  formData.gelarbelakang = data.gelarbelakang || data.gelar_belakang || "";
  formData.nik = data.nik || "";
  formData.email = data.email || "";
  formData.telp = data.telp || "";
  formData.nip = data.nip || "";
  formData.no_karpeg = data.no_karpeg || "";
  formData.tempatlahir = data.tempatlahir || data.tempat_lahir || "";
  formData.tanggallahir = data.tanggallahir || data.tanggal_lahir || "";
  formData.alamat = data.alamat || "";
  formData.foto = data.foto || null;
  formData.status = data.status || "Tidak Aktif";
  formData.minat = data.minat || "";
  formData.keahlian = data.keahlian || "";
  formData.idjeniskelamin = data.idjeniskelamin || data.id_jenis_kelamin || "";
  formData.idjenispengguna =
    data.idjenispengguna || data.id_jenis_pengguna || "";
  formData.idjenispegawai = data.idjenispegawai || data.id_jenis_pegawai || "";

  if (data.roles && data.roles.idlevel) {
    formData.idlevel = String(data.roles.idlevel);
  } else if (data.idlevel) {
    formData.idlevel = String(data.idlevel);
  } else if (data.id_level) {
    formData.idlevel = String(data.id_level);
  }

  const kodeKab = data.kodekabupaten || data.kode_kabupaten;
  if (kodeKab) {
    formData.kodekabupaten = kodeKab;
    const kode = String(kodeKab);
    if (kode.includes(".")) {
      formData.kodepropinsi = kode.split(".")[0];
    } else if (kode.length >= 2) {
      formData.kodepropinsi = kode.substring(0, 2);
    }
  }
}

function handlePhotoChange(file) {
  selectedPhotoFile.value = file;
  isPhotoRemoved.value = !file && formData.foto;
  emit("photo-change", file);
}

function handleFormUpdate(data) {
  Object.keys(data).forEach((key) => {
    formData[key] = data[key];
  });
}

async function validate() {
  if (!selectionMade.value && !isEditMode.value) {
    toast.error(
      "Silakan pilih apakah Anda ingin menggunakan data yang ada atau membuat data baru",
    );
    return false;
  }

  if (mode.value === "existing" && !selectedUser.value && !isEditMode.value) {
    toast.error("Silakan pilih pengguna dari daftar yang tersedia");
    return false;
  }

  if (formRef.value) {
    const isValid = await formRef.value.validate();
    emit("validation-change", isValid);
    return isValid;
  }

  return false;
}

defineExpose({ validate });
</script>
