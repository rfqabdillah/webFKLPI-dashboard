<template>
  <div class="step-biodata">
    <!-- Show User Type Selection if idjenispengguna is empty -->
    <UserTypeSelectionCards
      v-if="!formData.idjenispengguna"
      @select-user-type="selectUserType"
    />

    <!-- Show Biodata Form after user type is selected -->
    <BiodataFormFields
      v-if="formData.idjenispengguna"
      ref="formRef"
      v-model="formData"
      :isEditMode="isEditMode"
      :isLoading="isLoadingUserData"
      :isNonAsn="isNonAsn"
      @back="resetUserType"
      @photo-change="handlePhotoChange"
    />
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
import UserTypeSelectionCards from "./components/UserTypeSelectionCards.vue";
import BiodataFormFields from "./components/BiodataFormFields.vue";

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  fieldToEdit: { type: Object, default: null },
});

const emit = defineEmits([
  "update:modelValue",
  "validation-change",
  "user-type-changed",
  "photo-change",
]);

const toast = useToast();
const { t } = useI18n();
const formRef = ref(null);

// === State ===
const isLoadingUserData = ref(false);
const selectedPhotoFile = ref(null);
const isPhotoRemoved = ref(false);
const selectedUserTypeName = ref("");

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
  status: "Aktif",
  minat: "",
});

// === Computed ===
const isEditMode = computed(() => !!props.fieldToEdit);

const isNonAsn = computed(() => {
  const name = selectedUserTypeName.value?.toLowerCase() || "";
  return name.includes("non");
});

// === Watchers ===
watch(
  () => props.fieldToEdit,
  (newData) => {
    if (newData) {
      populateFormData(newData);
      // Determine user type name from the data
      if (newData["user-types"]?.[0]?.namajenispengguna) {
        selectedUserTypeName.value = newData["user-types"][0].namajenispengguna;
      }
    }
  },
  { immediate: true }
);

watch(
  formData,
  () => {
    const data = {
      mode: isEditMode.value ? "edit" : "profile",
      userId: isEditMode.value
        ? props.fieldToEdit.idpengguna
        : formData.idpengguna,
      userData: { ...formData },
      photoFile: selectedPhotoFile.value,
      isPhotoRemoved: isPhotoRemoved.value,
      isNonAsn: isNonAsn.value,
    };
    emit("update:modelValue", data);
  },
  { deep: true }
);

// Lifecycle
onMounted(() => {
  if (props.fieldToEdit) {
    populateFormData(props.fieldToEdit);
  }
});

// === Methods ===
function selectUserType(userType) {
  formData.idjenispengguna = userType.idjenispengguna;
  selectedUserTypeName.value = userType.namajenispengguna;
  emit("user-type-changed", userType);
}

function resetUserType() {
  formData.idjenispengguna = "";
  selectedUserTypeName.value = "";
}

function populateFormData(data) {
  if (!data) return;

  formData.idpengguna = data.idpengguna || data.id_pengguna || null;
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
  formData.status = data.status || "Aktif";
  formData.minat = data.minat || "";
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

  // Get user type name from nested data
  if (data["user-types"]?.[0]?.namajenispengguna) {
    selectedUserTypeName.value = data["user-types"][0].namajenispengguna;
  }
}

function handlePhotoChange(file) {
  selectedPhotoFile.value = file;
  isPhotoRemoved.value = !file && formData.foto;
  emit("photo-change", file);
}

async function validate() {
  if (!formData.idjenispengguna && !isEditMode.value) {
    toast.error(t("ProfileSteps.Biodata.Validation.UserTypeRequired"));
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
