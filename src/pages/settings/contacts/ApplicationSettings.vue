<template>
  <div class="container-fluid p-0">
    <div class="row">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-header bg-white py-3">
            <h3 class="card-title mb-0">Pengaturan Kontak & Aplikasi</h3>
          </div>
          <div class="card-body">
            <div v-if="isLoadingFetch" class="text-center py-5">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2 text-muted">Memuat data aplikasi...</p>
            </div>

            <form v-else @submit.prevent="submitForm">
              
              <h6 class="fw-bold mb-3 border-bottom pb-2">Identitas Visual</h6>
              <div class="row mb-4">
                
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Logo Instansi</label>
                  <input
                    type="file"
                    class="form-control"
                    @change="handleLogoUpload"
                    accept="image/png, image/jpeg, image/jpg"
                    ref="logoInput"
                    :disabled="isImageProcessing"
                  />
                  <div class="form-text">
                    Otomatis kompres. Format: .jpg, .jpeg, .png.
                    <span v-if="isEditMode && fieldToEdit.gambarutama" class="d-block">
                      *Kosongkan jika tidak ingin mengubah gambar.
                    </span>
                  </div>
                  
                  <div class="mt-3" v-if="logoPreview || formData.logo">
                    <div class="position-relative d-inline-block">
                        <img
                          :src="logoPreview || formData.logo"
                          alt="Preview Logo"
                          class="img-thumbnail shadow-sm"
                          style="height: 100px; object-fit: contain; background-color: #f8f9fa;"
                        />
                        <button 
                          type="button" 
                          class="btn btn-danger position-absolute top-0 start-100 translate-middle rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                          style="width: 28px; height: 28px; padding: 0; border: 2px solid white;"
                          @click="removeLogo"
                          title="Hapus Logo"
                          :disabled="isImageProcessing"
                        >
                          <i class="fa fa-times" style="font-size: 14px;"></i>
                        </button>
                    </div>
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Favicon</label>
                  <input
                    type="file"
                    class="form-control"
                    @change="handleFaviconUpload"
                    accept="image/png, image/jpeg, image/jpg" 
                    ref="faviconInput"
                    :disabled="isImageProcessing"
                  />
                  <div class="form-text">
                    Otomatis kompres. Format: .jpg, .jpeg, .png (Rasio 1:1).
                    <span v-if="isEditMode && fieldToEdit.gambarutama" class="d-block">
                      *Kosongkan jika tidak ingin mengubah gambar.
                    </span>
                  </div>
                  
                  <div class="mt-3" v-if="faviconPreview || formData.favicon">
                    <div class="position-relative d-inline-block">
                        <img
                          :src="faviconPreview || formData.favicon"
                          alt="Preview Favicon"
                          class="img-thumbnail shadow-sm"
                          style="width: 60px; height: 60px; object-fit: cover;"
                        />
                        <button 
                          type="button" 
                          class="btn btn-danger position-absolute top-0 start-100 translate-middle rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                          style="width: 24px; height: 24px; padding: 0; border: 2px solid white;"
                          @click="removeFavicon"
                          title="Hapus Favicon"
                          :disabled="isImageProcessing"
                        >
                          <i class="fa fa-times" style="font-size: 12px;"></i>
                        </button>
                    </div>
                  </div>
                </div>
              </div>

              <h6 class="fw-bold mb-3 border-bottom pb-2">Informasi Instansi</h6>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Nama Instansi</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="formData.namainstansi"
                    :class="{ 'is-invalid': formErrors.namainstansi }"
                    placeholder="Contoh: Dinas Kominfo"
                  />
                  <div class="invalid-feedback">{{ formErrors.namainstansi }}</div>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Email Resmi</label>
                  <input
                    type="email"
                    class="form-control"
                    v-model="formData.email"
                    :class="{ 'is-invalid': formErrors.email }"
                    placeholder="email@instansi.go.id"
                  />
                  <div class="invalid-feedback">{{ formErrors.email }}</div>
                </div>

                <div class="col-12 mb-3">
                  <label class="form-label fw-semibold">Alamat Lengkap</label>
                  <textarea
                    class="form-control"
                    v-model="formData.alamatinstansi"
                    :class="{ 'is-invalid': formErrors.alamatinstansi }"
                    rows="3"
                    placeholder="Masukkan alamat lengkap instansi"
                  ></textarea>
                  <div class="invalid-feedback">{{ formErrors.alamatinstansi }}</div>
                </div>
              </div>

              <h6 class="fw-bold mb-3 mt-4 border-bottom pb-2">Kontak</h6>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Nomor Telepon</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="fa-solid fa-phone"></i></span>
                    <input
                        type="text"
                        class="form-control"
                        v-model="formData.telepone" 
                        :class="{ 'is-invalid': formErrors.telepone }"
                        placeholder="021-xxxxxx"
                    />
                  </div>
                  <div class="invalid-feedback">{{ formErrors.telepone }}</div>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">WhatsApp</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="fa-brands fa-whatsapp"></i></span>
                    <input
                        type="text"
                        class="form-control"
                        v-model="formData.whatsapp"
                        placeholder="628xxxxxxxx"
                    />
                  </div>
                </div>
              </div>

              <h6 class="fw-bold mb-3 mt-4 border-bottom pb-2">Media Sosial</h6>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Facebook</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="fa-brands fa-facebook"></i></span>
                    <input type="text" class="form-control" v-model="formData.facebook" placeholder="Link Facebook">
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Instagram</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="fa-brands fa-instagram"></i></span>
                    <input type="text" class="form-control" v-model="formData.instagram" placeholder="Link Instagram">
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Twitter (X)</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="fa-brands fa-x-twitter"></i></span>
                    <input type="text" class="form-control" v-model="formData.twitter" placeholder="Link Twitter">
                  </div>
                </div>
                
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Tiktok</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="fa-brands fa-tiktok"></i></span>
                    <input type="text" class="form-control" v-model="formData.tiktok" placeholder="Link Tiktok">
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">YouTube</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="fa-brands fa-youtube"></i></span>
                    <input type="text" class="form-control" v-model="formData.youtube" placeholder="Link YouTube">
                  </div>
                </div>
              </div>

              <div v-if="errorMessage" class="alert alert-danger mt-3">
                {{ errorMessage }}
              </div>

              <div class="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                <button type="button" class="btn btn-secondary" @click="resetForm" :disabled="isSubmitting || isImageProcessing">
                  Reset
                </button>
                <button type="submit" class="btn btn-primary" :disabled="isSubmitting || isImageProcessing">
                  <span v-if="isSubmitting || isImageProcessing" class="spinner-border spinner-border-sm me-1"></span>
                  <span v-if="isImageProcessing">Memproses Gambar...</span>
                  <span v-else>Simpan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";
import Swal from "sweetalert2";
import { getApplication, updateApplication, addApplication } from "@/services/general/website/settings/applications";
import { compressImage } from '@/utils/imageCompressor';

const toast = useToast();

// === State ===
const isLoadingFetch = ref(true);
const isSubmitting = ref(false);
const isImageProcessing = ref(false); 
const errorMessage = ref(null);

const formData = reactive({
  idaplikasi: "",       
  namainstansi: "",
  alamatinstansi: "",
  email: "",
  telepone: "",        
  whatsapp: "",
  instagram: "",
  facebook: "",
  twitter: "",
  tiktok: "",
  youtube: "",
  logo: null,
  favicon: null,
});

const selectedLogoFile = ref(null);
const logoPreview = ref(null);
const logoInput = ref(null);

const selectedFaviconFile = ref(null);
const faviconPreview = ref(null);
const faviconInput = ref(null);

const formErrors = reactive({});

// === Validasi ===
const validationSchema = yup.object().shape({
  namainstansi: yup.string(),
  email: yup.string().email("Format email tidak valid").nullable(),
});

// === Lifecycle ===
onMounted(() => {
  fetchSingletonData();
});

// === Methods ===
async function fetchSingletonData() {
  isLoadingFetch.value = true;
  try {
    const response = await getApplication();
    let sourceData = null;

    if (response.data && Array.isArray(response.data)) {
        if (response.data[0] && response.data[0].data) {
            const innerData = response.data[0].data;
            if (Array.isArray(innerData) && innerData.length > 0) {
                sourceData = innerData[0];
            }
        }
    }

    if (sourceData) {
        formData.idaplikasi = sourceData.idaplikasi;
        formData.namainstansi = sourceData.namainstansi || "";
        formData.alamatinstansi = sourceData.alamatinstansi || "";
        formData.email = sourceData.email || "";
        formData.telepone = sourceData.telepone || "";
        formData.whatsapp = sourceData.whatsapp || "";
        formData.instagram = sourceData.instagram || "";
        formData.facebook = sourceData.facebook || "";
        formData.twitter = sourceData.twitter || "";
        formData.tiktok = sourceData.tiktok || "";
        formData.youtube = sourceData.youtube || "";

        formData.logo = sourceData.logo || null;
        formData.favicon = sourceData.favicon || null;
    } else {
        formData.idaplikasi = "";
    }

  } catch (error) {
    console.error("Fetch Error:", error);
    toast.error("Gagal memuat data aplikasi");
  } finally {
    isLoadingFetch.value = false;
  }
}

async function handleLogoUpload(event) {
  const file = event.target.files[0];
  const input = event.target;

  const resetToOriginal = () => {
    selectedLogoFile.value = null;
    logoPreview.value = formData.logo || null;
    if (input) input.value = null;
  };

  if (!file) {
    resetToOriginal();
    return;
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
      toast.error("Format logo harus JPG atau PNG");
      resetToOriginal();
      return;
  }

  try {
    isImageProcessing.value = true;
    toast.info("Sedang mengompres logo...", { timeout: 1500 });
    
    const compressedFile = await compressImage(file);
    
    selectedLogoFile.value = compressedFile;
    logoPreview.value = URL.createObjectURL(compressedFile);
    
  } catch (error) {
    toast.error("Gagal memproses logo: " + error.message);
    resetToOriginal();
  } finally {
    isImageProcessing.value = false;
  }
}

async function handleFaviconUpload(event) {
  const file = event.target.files[0];
  const input = event.target;

  const resetToOriginal = () => {
    selectedFaviconFile.value = null;
    faviconPreview.value = formData.favicon || null;
    if (input) input.value = null;
  };

  if (!file) {
    resetToOriginal();
    return;
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
      toast.error("Format favicon harus JPG atau PNG");
      resetToOriginal();
      return;
  }

  try {
    isImageProcessing.value = true;
    toast.info("Sedang mengompres favicon...", { timeout: 1500 });

    const compressedFile = await compressImage(file);

    selectedFaviconFile.value = compressedFile;
    faviconPreview.value = URL.createObjectURL(compressedFile);

  } catch (error) {
    toast.error("Gagal memproses favicon: " + error.message);
    resetToOriginal();
  } finally {
    isImageProcessing.value = false;
  }
}

function removeLogo() {
  if (logoPreview.value && logoPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(logoPreview.value);
  }
  
  selectedLogoFile.value = null;
  logoPreview.value = null;
  formData.logo = null; 
  
  if (logoInput.value) logoInput.value.value = null;
}

function removeFavicon() {
  if (faviconPreview.value && faviconPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(faviconPreview.value);
  }
  
  selectedFaviconFile.value = null;
  faviconPreview.value = null;
  formData.favicon = null; 
  
  if (faviconInput.value) faviconInput.value.value = null;
}

function handleError(error) {
  errorMessage.value = error.response?.data?.message || "Gagal menyimpan data.";
  toast.error(errorMessage.value);
}

async function validateForm() {
  Object.keys(formErrors).forEach((key) => delete formErrors[key]);
  try {
    await validationSchema.validate(formData, { abortEarly: false });
    return true;
  } catch (err) {
    err.inner.forEach((e) => {
      formErrors[e.path] = e.message;
    });
    toast.warning("Periksa kembali isian form");
    return false;
  }
}

function resetForm() {
  Swal.fire({
    title: 'Reset Input',
    text: "Kosongkan semua kolom isian?",
    icon: "warning",
    showCancelButton: true,
    cancelButtonColor: "#efefef",
    confirmButtonColor: "#d33",
    cancelButtonText: 'Batal',
    confirmButtonText: 'Kosongkan',
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      
      formData.namainstansi = "";
      formData.alamatinstansi = "";
      formData.email = "";
      formData.telepone = "";
      formData.whatsapp = "";
      formData.instagram = "";
      formData.facebook = "";
      formData.twitter = "";
      formData.tiktok = "";
      formData.youtube = "";
      formData.logo = null;
      formData.favicon = null;

      removeLogo();
      removeFavicon();

      Object.keys(formErrors).forEach((key) => delete formErrors[key]);

      toast.info("Isian form dikosongkan.");
    }
  });
}

async function submitForm() {
  const isValid = await validateForm();
  if (!isValid) return;

  isSubmitting.value = true;
  errorMessage.value = null;

  const data = new FormData();
  data.append("record[namainstansi]", formData.namainstansi || "");
  data.append("record[alamatinstansi]", formData.alamatinstansi || "");
  data.append("record[email]", formData.email || "");
  data.append("record[telepone]", formData.telepone || "");
  data.append("record[whatsapp]", formData.whatsapp || "");
  data.append("record[instagram]", formData.instagram || "");
  data.append("record[facebook]", formData.facebook || "");
  data.append("record[twitter]", formData.twitter || "");
  data.append("record[tiktok]", formData.tiktok || "");
  data.append("record[youtube]", formData.youtube || "");

  if (selectedLogoFile.value) {
    data.append("upload_logo", selectedLogoFile.value, selectedLogoFile.value.name); 
  } else if (!formData.logo) {
    data.append("record[logo]", ""); 
  }

  if (selectedFaviconFile.value) {
    data.append("upload_favicon", selectedFaviconFile.value, selectedFaviconFile.value.name);
  } else if (!formData.favicon) {
    data.append("record[favicon]", ""); 
  }

  try {
    if (formData.idaplikasi) {
        data.append("_method", "PUT"); 
        await updateApplication(formData.idaplikasi, data);
        toast.success("Pengaturan berhasil diperbarui");
    } else {
        await addApplication(data);
        toast.success("Pengaturan awal berhasil dibuat");
    }

    selectedLogoFile.value = null;
    selectedFaviconFile.value = null;
    
    await fetchSingletonData(); 
    window.dispatchEvent(new Event('app-settings-updated'));

  } catch (error) {
    handleError(error);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.invalid-feedback {
  display: block;
  font-size: 0.875em;
}
</style>