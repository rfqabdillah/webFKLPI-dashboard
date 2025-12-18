<template>
  <div class="container-fluid user-profile-page">
    <div class="row justify-content-center">
      <div class="col-12">
        <!-- Warning Alert for Incomplete Data -->
        <div
          v-if="isProfileIncomplete"
          class="custom-warning-alert d-flex align-items-center mb-4 shadow-sm"
        >
          <div class="alert-icon-box me-3">
            <i class="fa fa-exclamation text-white"></i>
          </div>
          <div class="alert-content">
            <span class="fw-bold d-block" style="color: #ff5b57">
              Data Profil Belum Lengkap!
            </span>
            <span class="small" style="color: #ff5b57">
              Mohon lengkapi data diri Anda (NIK, Alamat, No. Telepon, Tempat &
              Tanggal Lahir).
            </span>
          </div>
        </div>

        <div class="card profile-card overflow-hidden shadow-sm">
          <!-- Background Banner -->
          <div class="card-header-banner bg-primary"></div>

          <div class="card-body pt-0 relative">
            <!-- Profile Info Header -->
            <div class="text-center profile-header">
              <div class="profile-img-container mx-auto">
                <!-- Loading Spinner -->
                <div
                  v-if="isLoading"
                  class="profile-img rounded-circle border-white d-flex align-items-center justify-content-center bg-white shadow"
                >
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>

                <!-- Initial Avatar (Random Color) -->
                <div
                  v-else-if="!user.foto"
                  class="profile-img rounded-circle border-white d-flex align-items-center justify-content-center text-white fw-bold display-4 shadow"
                  :style="{ backgroundColor: getRandomColor(fullName) }"
                >
                  {{ getInitials(fullName) }}
                </div>

                <!-- Actual Photo -->
                <img
                  v-else
                  :src="user.foto"
                  alt="Profile"
                  class="profile-img rounded-circle border-white"
                  @error="handleImageError"
                />
              </div>
              <h3 class="mt-3 mb-1 fw-bold text-dark">{{ fullName }}</h3>
              <div
                class="d-flex justify-content-center flex-wrap gap-3 text-muted mb-3"
              >
                <div class="d-flex align-items-center">
                  <vue-feather type="mail" size="16" class="me-2"></vue-feather>
                  <span>{{ user.email || "-" }}</span>
                </div>
                <div class="d-flex align-items-center">
                  <vue-feather
                    type="map-pin"
                    size="16"
                    class="me-2"
                  ></vue-feather>
                  <span>{{ user.alamat || "-" }}</span>
                </div>
                <div class="d-flex align-items-center">
                  <vue-feather
                    type="phone"
                    size="16"
                    class="me-2"
                  ></vue-feather>
                  <span>{{ user.telp || "-" }}</span>
                </div>
              </div>
            </div>

            <div class="mt-4 position-relative">
              <div class="position-absolute end-0 me-4" style="top: -150px">
                <button
                  class="btn btn-warning btn-sm px-3 fw-medium"
                  @click="handleEditData"
                >
                  <i class="fa fa-edit me-2"></i>Edit Data
                </button>
              </div>
              <ul
                class="nav nav-tabs justify-content-center"
                id="profileTabs"
                role="tablist"
              >
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    :class="{ active: activeTab === 'pribadi' }"
                    @click="activeTab = 'pribadi'"
                    type="button"
                  >
                    <vue-feather
                      type="user"
                      size="14"
                      class="me-2"
                    ></vue-feather>
                    Biodata
                  </button>
                </li>
                <li v-if="!isNonAsn" class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    :class="{ active: activeTab === 'unit_kerja' }"
                    @click="activeTab = 'unit_kerja'"
                    type="button"
                  >
                    <vue-feather
                      type="briefcase"
                      size="14"
                      class="me-2"
                    ></vue-feather>
                    Unit Kerja
                  </button>
                </li>
                <li v-if="isNonAsn" class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    :class="{ active: activeTab === 'perusahaan' }"
                    @click="activeTab = 'perusahaan'"
                    type="button"
                  >
                    <vue-feather
                      type="briefcase"
                      size="14"
                      class="me-2"
                    ></vue-feather>
                    Perusahaan
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    :class="{ active: activeTab === 'pengalaman_kerja' }"
                    @click="activeTab = 'pengalaman_kerja'"
                    type="button"
                  >
                    <vue-feather
                      type="folder"
                      size="14"
                      class="me-2"
                    ></vue-feather>
                    Pengalaman Kerja
                  </button>
                </li>
                <li v-if="!isNonAsn" class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    :class="{ active: activeTab === 'jabatan' }"
                    @click="activeTab = 'jabatan'"
                    type="button"
                  >
                    <vue-feather
                      type="layers"
                      size="14"
                      class="me-2"
                    ></vue-feather>
                    Jabatan
                  </button>
                </li>
                <li v-if="!isNonAsn" class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    :class="{ active: activeTab === 'pangkat' }"
                    @click="activeTab = 'pangkat'"
                    type="button"
                  >
                    <vue-feather
                      type="chevrons-up"
                      size="14"
                      class="me-2"
                    ></vue-feather>
                    Pangkat
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    :class="{ active: activeTab === 'pendidikan' }"
                    @click="activeTab = 'pendidikan'"
                    type="button"
                  >
                    <vue-feather
                      type="book"
                      size="14"
                      class="me-2"
                    ></vue-feather>
                    Pendidikan
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    :class="{ active: activeTab === 'pelatihan' }"
                    @click="activeTab = 'pelatihan'"
                    type="button"
                  >
                    <vue-feather
                      type="clipboard"
                      size="14"
                      class="me-2"
                    ></vue-feather>
                    Pelatihan
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    :class="{ active: activeTab === 'prestasi' }"
                    @click="activeTab = 'prestasi'"
                    type="button"
                  >
                    <vue-feather
                      type="award"
                      size="14"
                      class="me-2"
                    ></vue-feather>
                    Prestasi
                  </button>
                </li>
              </ul>

              <div class="tab-content p-4" id="profileTabsContent">
                <!-- Tab Detail Pribadi -->
                <div
                  class="tab-pane fade"
                  :class="{ 'show active': activeTab === 'pribadi' }"
                  role="tabpanel"
                >
                  <PersonalDetailsTab :user="user" :isNonAsn="isNonAsn" />
                </div>

                <!-- Tab Unit Kerja (ASN) -->
                <div
                  v-if="!isNonAsn"
                  class="tab-pane fade"
                  :class="{ 'show active': activeTab === 'unit_kerja' }"
                  role="tabpanel"
                >
                  <WorkUnitTab :items="userWorkUnits" :user="user" />
                </div>

                <!-- Tab Perusahaan (Non-ASN) -->
                <div
                  v-if="isNonAsn"
                  class="tab-pane fade"
                  :class="{ 'show active': activeTab === 'perusahaan' }"
                  role="tabpanel"
                >
                  <CompanyTab :items="userCompanies" :user="user" />
                </div>

                <!-- Tab Pengalaman Kerja -->
                <div
                  class="tab-pane fade"
                  :class="{ 'show active': activeTab === 'pengalaman_kerja' }"
                  role="tabpanel"
                >
                  <WorkExperienceTab :items="userWorkExperience" :user="user" />
                </div>

                <!-- Tab Jabatan -->
                <div
                  v-if="!isNonAsn"
                  class="tab-pane fade"
                  :class="{ 'show active': activeTab === 'jabatan' }"
                  role="tabpanel"
                >
                  <PositionTab :items="userLevels" :user="user" />
                </div>

                <!-- Tab Pangkat -->
                <div
                  v-if="!isNonAsn"
                  class="tab-pane fade"
                  :class="{ 'show active': activeTab === 'pangkat' }"
                  role="tabpanel"
                >
                  <RankTab :items="userRanks" :user="user" />
                </div>

                <!-- Tab Pendidikan -->
                <div
                  class="tab-pane fade"
                  :class="{ 'show active': activeTab === 'pendidikan' }"
                  role="tabpanel"
                >
                  <EducationTab :items="userEducations" :user="user" />
                </div>

                <!-- Tab Pelatihan -->
                <div
                  class="tab-pane fade"
                  :class="{ 'show active': activeTab === 'pelatihan' }"
                  role="tabpanel"
                >
                  <TrainingTab :items="userTrainings" />
                </div>

                <!-- Tab Prestasi -->
                <div
                  class="tab-pane fade"
                  :class="{ 'show active': activeTab === 'prestasi' }"
                  role="tabpanel"
                >
                  <AchievementTab :items="userAchievements" :user="user" />
                </div>
              </div>
            </div>

            <hr class="my-4" />
          </div>
        </div>
      </div>
      <!-- Edit Profile Modal -->
      <UserProfileFormModal
        v-if="isEditModalOpen"
        :fieldToEdit="user"
        entityName="Profil"
        @close="closeModal"
        @save-successful="handleSaveSuccessful"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { getDetailUser } from "@/services/referensi/users";
import { getInitials, getRandomColor } from "@/utils/avatarUtils";

// Tab Components
import PersonalDetailsTab from "./tabs/PersonalDetailsTab.vue";
import WorkUnitTab from "./tabs/WorkUnitTab.vue";
import CompanyTab from "./tabs/CompanyTab.vue";
import WorkExperienceTab from "./tabs/WorkExperienceTab.vue";
import PositionTab from "./tabs/PositionTab.vue";
import RankTab from "./tabs/RankTab.vue";
import EducationTab from "./tabs/EducationTab.vue";
import TrainingTab from "./tabs/TrainingTab.vue";
import AchievementTab from "./tabs/AchievementTab.vue";

const user = ref({});
const userWorkUnits = ref([]);
const userCompanies = ref([]);
const userWorkExperience = ref([]);
const userLevels = ref([]);
const userRanks = ref([]);
const userEducations = ref([]);
const userTrainings = ref([]);
const userAchievements = ref([]);

// Modal
import UserProfileFormModal from "./UserProfileFormModal.vue";

const activeTab = ref("pribadi");
const isEditModalOpen = ref(false);
const isLoading = ref(true);

const fullName = computed(() => {
  const parts = [user.value.gelardepan, user.value.nama].filter(Boolean);
  let name = parts.join(" ");
  const gelarBelakang = user.value.gelarbelakang;
  if (gelarBelakang) {
    name += `, ${gelarBelakang}`;
  }
  return name || "Pengguna";
});

const isProfileIncomplete = computed(() => {
  const u = user.value;
  if (!u || Object.keys(u).length === 0) return false;

  const checks = [
    u.nik,
    u.telp,
    u.alamat,
    u.tempat_lahir || u.tempatlahir,
    u.tanggal_lahir || u.tanggallahir,
  ];

  return checks.some((val) => !val || val.toString().trim() === "");
});

// Check if user is Non-ASN based on user-types array
const isNonAsn = computed(() => {
  const userTypeName = user.value["user-types"]?.[0]?.namajenispengguna || "";
  return userTypeName.toLowerCase().includes("non");
});

function handleImageError(e) {
  user.value.foto = null;
}

function handleEditData() {
  isEditModalOpen.value = true;
}

function closeModal() {
  isEditModalOpen.value = false;
}

function handleSaveSuccessful() {
  closeModal();
  fetchUserProfile();
}

async function fetchUserProfile() {
  isLoading.value = true;
  const userDataStr = localStorage.getItem("userData");
  if (userDataStr) {
    try {
      const parsed = JSON.parse(userDataStr);
      if (parsed.data && Array.isArray(parsed.data) && parsed.data.length > 0) {
        const userId = parsed.data[0].id_pengguna || parsed.data[0].idpengguna;
        if (userId) {
          // 1. Fetch Main User Profile (which now includes all related data)
          try {
            const response = await getDetailUser(userId);
            if (response && response.data) {
              let fetchedUser = null;

              if (
                Array.isArray(response.data) &&
                response.data.length > 0 &&
                response.data[0].data &&
                Array.isArray(response.data[0].data)
              ) {
                fetchedUser = response.data[0].data[0];
              } else if (response.data.data) {
                // Handle cases where data might be nested differently or directly an object
                if (Array.isArray(response.data.data)) {
                  fetchedUser = response.data.data[0];
                } else {
                  fetchedUser = response.data.data;
                }
              } else {
                fetchedUser = response.data;
              }

              if (fetchedUser) {
                user.value = fetchedUser;

                // 2. Populate related data states from the nested response

                // Work Units
                userWorkUnits.value = fetchedUser["user-work-units"] || [];

                // Companies (for Non-ASN)
                userCompanies.value = fetchedUser["user-companies"] || [];

                // Work Experience
                userWorkExperience.value =
                  fetchedUser["user-work-experiences"] || [];

                // Position / Levels
                userLevels.value = fetchedUser["user-levels"] || [];

                // Ranks
                userRanks.value = fetchedUser["user-ranks"] || [];

                // Education
                userEducations.value = fetchedUser["user-educations"] || [];

                // Trainings
                userTrainings.value = fetchedUser["user-trainings"] || [];

                // Achievements
                userAchievements.value = fetchedUser["user-achievments"] || []; // Note: spelling matches API

                // 3. ✅ UPDATE localStorage with MINIMAL essential data only
                // Only save what's needed for: menu filtering, layout selection, and header profile
                const essentialUserData = {
                  idpengguna: fetchedUser.idpengguna,
                  id_pengguna: fetchedUser.idpengguna, // Alt key for compatibility
                  id_level: fetchedUser.idlevel,
                  id_jenis_pengguna: fetchedUser.idjenispengguna,
                  nama: fetchedUser.nama,
                  nama_level: fetchedUser.roles?.[0]?.namalevel || "",
                  email: fetchedUser.email,
                  foto: fetchedUser.foto,
                  gelardepan: fetchedUser.gelardepan || "",
                  gelarbelakang: fetchedUser.gelarbelakang || "",
                  nik: fetchedUser.nik || "",
                  telp: fetchedUser.telp || "",
                  alamat: fetchedUser.alamat || "",
                  tempatlahir: fetchedUser.tempatlahir || "",
                  tanggallahir: fetchedUser.tanggallahir || "",
                  // Keep user-types for backward compatibility with profile page
                  "user-types": fetchedUser["user-types"] || [],
                };

                const updatedUserData = {
                  data: [essentialUserData],
                };
                localStorage.setItem(
                  "userData",
                  JSON.stringify(updatedUserData)
                );

                // 4. ✅ Dispatch custom event to notify profile.vue in header
                window.dispatchEvent(new CustomEvent("userDataUpdated"));
              }
            }
          } catch (err) {
            console.error("Error calling getDetailUser:", err);
          }
        } else {
          console.warn("User ID not found in localStorage userData");
        }
      } else {
        console.warn("Invalid userData structure in localStorage");
      }
    } catch (error) {
      console.error("Error parsing user profile from localStorage:", error);
    }
  } else {
    console.warn("No userData found in localStorage");
  }
  isLoading.value = false;
}

onMounted(() => {
  fetchUserProfile();
});
</script>

<style scoped>
.user-profile-page {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.profile-card {
  border: none;
  background: white;
  border-radius: 12px;
}

/* Background Banner */
.card-header-banner {
  height: 200px;
  width: 100%;
  overflow: hidden;
  background-color: #05e8ba;
  background-image: linear-gradient(315deg, #05e8ba 0%, #087ee1 74%);
}

.profile-header {
  margin-top: -75px; /* Pull up to overlap banner */
}

.profile-img-container {
  width: 150px;
  height: 150px;
  position: relative;
  z-index: 2;
}

.profile-img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.custom-warning-alert {
  background-color: #fdecec;
  border-radius: 8px;
  padding: 12px 16px;
  border: 1px solid #fadbd8;
}

.alert-icon-box {
  background-color: #ff5b57;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Tabs Styling */
.nav-tabs {
  border-bottom: 2px solid #e9ecef;
}

.nav-link {
  color: #6c757d;
  font-weight: 500;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 10px 20px;
  margin-bottom: -2px;
}

.nav-link:hover {
  color: #0d6efd;
  border-color: transparent;
}

.nav-link.active {
  color: #0d6efd;
  border-bottom: 2px solid #0d6efd;
  background: transparent;
}
</style>
