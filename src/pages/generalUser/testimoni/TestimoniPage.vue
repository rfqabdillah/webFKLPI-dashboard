<template>
  <div class="col-12">
    <div class="card testimonial-card">
      <div class="card-header testimonial-header">
        <div class="header-content">
          <div class="header-icon">
            <i class="fa fa-star"></i>
          </div>
          <div class="header-text">
            <h5 class="card-title mb-1">Berikan Testimoni Anda</h5>
            <p class="card-subtitle mb-0">Bagikan pengalaman Anda disini</p>
          </div>
        </div>
      </div>

      <div class="card-body">
        <!-- Success Message -->
        <div v-if="isSubmitted" class="success-container text-center py-5">
          <div class="success-icon mb-4">
            <i class="fa fa-check-circle"></i>
          </div>
          <h4 class="text-success mb-3">Terima Kasih!</h4>
          <p class="text-muted mb-4">
            Testimoni Anda telah berhasil dikirim dan sedang menunggu
            persetujuan admin.
          </p>
          <button class="btn btn-primary" @click="resetForm">
            <i class="fa fa-plus me-2"></i>Kirim Testimoni Lagi
          </button>
        </div>

        <!-- Testimonial Form -->
        <form v-else @submit.prevent="submitTestimoni">
          <!-- Star Rating -->
          <div class="mb-4">
            <label class="form-label fw-semibold">
              <i class="fa fa-star text-warning me-2"></i>Rating Kepuasan
            </label>
            <div class="star-rating-container">
              <div class="star-rating">
                <span
                  v-for="star in 5"
                  :key="star"
                  class="star"
                  :class="{
                    active: star <= formData.nilai,
                    hovered: star <= hoveredStar,
                  }"
                  @click="setRating(star)"
                  @mouseenter="hoveredStar = star"
                  @mouseleave="hoveredStar = 0"
                >
                  <i class="fa fa-star"></i>
                </span>
              </div>
              <span class="rating-text">{{ ratingText }}</span>
            </div>
            <small v-if="errors.nilai" class="text-danger">
              {{ errors.nilai }}
            </small>
          </div>

          <!-- Testimonial Content -->
          <div class="mb-4">
            <label class="form-label fw-semibold">
              <i class="fa fa-comment text-primary me-2"></i>Isi Testimoni
            </label>
            <textarea
              v-model="formData.konten"
              class="form-control testimonial-textarea"
              :class="{ 'is-invalid': errors.konten }"
              rows="5"
              placeholder="Apa pengalaman Anda menggunakan layanan kami?"
              maxlength="1000"
            ></textarea>
            <div class="d-flex justify-content-between mt-2">
              <small v-if="errors.konten" class="text-danger">
                {{ errors.konten }}
              </small>
              <small class="text-muted ms-auto">
                {{ formData.konten.length }}/1000 karakter
              </small>
            </div>
          </div>

          <!-- User Info Display -->
          <div class="user-info-card mb-4">
            <div class="d-flex align-items-center">
              <div class="user-avatar me-3">
                <img
                  v-if="currentUser.foto"
                  :src="currentUser.foto"
                  :alt="currentUser.nama"
                  class="avatar-img"
                  @error="handleAvatarError"
                />
                <div v-else class="avatar-placeholder">
                  {{ getInitials(currentUser.nama) }}
                </div>
              </div>
              <div class="user-details">
                <h6 class="mb-0">{{ currentUser.nama || "Pengguna" }}</h6>
                <small class="text-muted">{{
                  currentUser.email || "email@example.com"
                }}</small>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="d-grid">
            <button
              type="submit"
              class="btn btn-primary btn-submit"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting">
                <i class="fa fa-spinner fa-spin me-2"></i>Mengirim...
              </span>
              <span v-else>
                <i class="fa fa-paper-plane me-2"></i>Kirim Testimoni
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Previous Testimonials -->
    <div v-if="userTestimonials.length > 0" class="card mt-4">
      <div class="card-header">
        <h6 class="mb-0">
          <i class="fa fa-history me-2"></i>Testimoni Anda Sebelumnya
        </h6>
      </div>
      <div class="card-body p-0">
        <div class="testimonial-list">
          <div
            v-for="testimoni in userTestimonials"
            :key="testimoni.id_testimoni"
            class="testimonial-item"
          >
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div class="stars">
                <i
                  v-for="star in 5"
                  :key="star"
                  class="fa fa-star"
                  :class="
                    star <= testimoni.nilai ? 'text-warning' : 'text-muted'
                  "
                ></i>
              </div>
            </div>
            <p class="mb-2 testimonial-content">{{ testimoni.konten }}</p>
            <small class="text-muted">
              <i class="fa fa-calendar me-1"></i>
              {{ formatDate(testimoni.created_at) }}
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { addTestimoni, getTestimoni } from "@/services/general/testimoni";
import * as yup from "yup";

const toast = useToast();

// State
const isSubmitting = ref(false);
const isSubmitted = ref(false);
const hoveredStar = ref(0);
const userTestimonials = ref([]);
const currentUser = reactive({
  id_pengguna: "",
  nama: "",
  email: "",
  foto: null,
});

// Form Data
const formData = reactive({
  konten: "",
  nilai: 0,
});

// Errors
const errors = reactive({
  konten: "",
  nilai: "",
});

// Computed
const ratingText = computed(() => {
  const texts = [
    "Pilih rating",
    "Sangat Buruk",
    "Buruk",
    "Cukup",
    "Baik",
    "Sangat Baik",
  ];
  return texts[formData.nilai] || texts[0];
});

// Methods
const loadUserFromStorage = () => {
  try {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      const user = userData?.data?.[0];
      if (user) {
        currentUser.id_pengguna = user.id_pengguna || user.idpengguna || "";
        currentUser.nama = user.nama || "Pengguna";
        currentUser.email = user.email || "";
        currentUser.foto = user.foto || null;
      }
    }
  } catch (error) {
    console.error("Error loading user data:", error);
  }
};

const loadUserTestimonials = async () => {
  if (!currentUser.id_pengguna) return;

  try {
    const response = await getTestimoni({
      filter: `idpengguna=${currentUser.id_pengguna}`,
    });

    let data = [];
    if (Array.isArray(response.data)) {
      if (response.data[0]?.data) {
        data = response.data[0].data;
      } else {
        data = response.data;
      }
    } else if (response.data?.data) {
      data = response.data.data;
    }

    userTestimonials.value = data.filter(
      (t) =>
        t.idpengguna === currentUser.id_pengguna ||
        t.id_pengguna === currentUser.id_pengguna
    );
  } catch (error) {
    console.error("Error loading testimonials:", error);
  }
};

const setRating = (rating) => {
  formData.nilai = rating;
  errors.nilai = "";
};

const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

const handleAvatarError = (event) => {
  event.target.style.display = "none";
};

// Yup Validation Schema
const validationSchema = yup.object().shape({
  konten: yup
    .string()
    .required("Isi testimoni tidak boleh kosong")
    .min(20, "Testimoni minimal 20 karakter"),
  nilai: yup
    .number()
    .min(1, "Silakan pilih rating bintang")
    .required("Silakan pilih rating bintang"),
});

const validateForm = async () => {
  // Reset errors
  errors.konten = "";
  errors.nilai = "";

  try {
    await validationSchema.validate(
      {
        konten: formData.konten.trim(),
        nilai: formData.nilai,
      },
      { abortEarly: false }
    );
    return true;
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      err.inner.forEach((error) => {
        if (error.path && errors.hasOwnProperty(error.path)) {
          errors[error.path] = error.message;
        }
      });
    }
    return false;
  }
};

const submitTestimoni = async () => {
  const isValid = await validateForm();
  if (!isValid) return;

  if (!currentUser.id_pengguna) {
    toast.error("Anda harus login terlebih dahulu");
    return;
  }

  isSubmitting.value = true;

  try {
    const data = new FormData();
    data.append("record[id_pengguna]", currentUser.id_pengguna);
    data.append("record[konten]", formData.konten.trim());
    data.append("record[nilai]", formData.nilai);
    data.append("record[status]", "Draft"); // Default: pending/not published

    await addTestimoni(data);

    toast.success("Testimoni berhasil dikirim!");
    isSubmitted.value = true;

    // Reload testimonials
    await loadUserTestimonials();
  } catch (error) {
    console.error("Error submitting testimonial:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Gagal mengirim testimoni";
    toast.error(errorMessage);
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  formData.konten = "";
  formData.nilai = 0;
  errors.konten = "";
  errors.nilai = "";
  isSubmitted.value = false;
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Lifecycle
onMounted(() => {
  loadUserFromStorage();
  loadUserTestimonials();
});
</script>

<style scoped>
.testimonial-card {
  border: none;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(115, 102, 255, 0.1);
  overflow: hidden;
}

.testimonial-header {
  background: linear-gradient(135deg, #7366ff 0%, #a855f7 100%);
  border: none;
  padding: 24px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon i {
  font-size: 24px;
  color: #ffd700;
}

.header-text .card-title {
  color: #fff;
  font-weight: 600;
}

.header-text .card-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

/* Star Rating */
.star-rating-container {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #fef9e7 0%, #fef3c7 100%);
  border-radius: 12px;
}

.star-rating {
  display: flex;
  gap: 8px;
}

.star {
  font-size: 32px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #d1d5db;
}

.star:hover,
.star.hovered {
  color: #fbbf24;
  transform: scale(1.15);
}

.star.active {
  color: #f59e0b;
}

.star.active:hover {
  color: #fbbf24;
}

.rating-text {
  font-weight: 600;
  color: #92400e;
  font-size: 14px;
}

/* Textarea */
.testimonial-textarea {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  resize: none;
  transition: all 0.3s ease;
  font-size: 15px;
}

.testimonial-textarea:focus {
  border-color: #7366ff;
  box-shadow: 0 0 0 4px rgba(115, 102, 255, 0.1);
}

.testimonial-textarea.is-invalid {
  border-color: #dc3545;
}

/* User Info Card */
.user-info-card {
  background: linear-gradient(135deg, #f0f4ff 0%, #e8e6ff 100%);
  padding: 16px;
  border-radius: 12px;
}

.user-avatar {
  width: 48px;
  height: 48px;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #7366ff;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #7366ff 0%, #a855f7 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
}

.user-details h6 {
  color: #1f2937;
  font-weight: 600;
}

/* Submit Button */
.btn-submit {
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #7366ff 0%, #a855f7 100%);
  border: none;
  transition: all 0.3s ease;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(115, 102, 255, 0.35);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Success Container */
.success-container {
  animation: fadeInUp 0.5s ease;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.success-icon i {
  font-size: 40px;
  color: #fff;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Previous Testimonials */
.testimonial-list {
  max-height: 400px;
  overflow-y: auto;
}

.testimonial-item {
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  transition: background 0.2s ease;
}

.testimonial-item:last-child {
  border-bottom: none;
}

.testimonial-item:hover {
  background: #f9fafb;
}

.testimonial-item .stars i {
  font-size: 14px;
  margin-right: 2px;
}

.testimonial-content {
  color: #4b5563;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 576px) {
  .star-rating-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .star {
    font-size: 28px;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>
