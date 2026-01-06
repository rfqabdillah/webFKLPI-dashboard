<template>
  <div class="col-lg-8">
    <!-- Horizontal Scroll -->
    <div class="chip-tabs-container-wrapper">
      <button
        v-show="canScrollLeft"
        class="scroll-btn left-btn"
        @click="scroll('left')"
      >
        <i class="fa fa-chevron-left"></i>
      </button>

      <div
        ref="scrollContainer"
        class="chip-tabs-container"
        @scroll="checkScroll"
      >
        <div class="chip-tabs">
          <button
            v-for="tab in visibleTabs"
            :key="tab.key"
            class="chip-tab"
            :class="{ active: activeTab === tab.key }"
            @click="$emit('update:activeTab', tab.key)"
          >
            <i :class="['fa', tab.icon]"></i>
            <span>{{ $t(tab.labelKey) }}</span>
          </button>
        </div>
      </div>

      <button
        v-show="canScrollRight"
        class="scroll-btn right-btn"
        @click="scroll('right')"
      >
        <i class="fa fa-chevron-right"></i>
      </button>
    </div>

    <!-- TAB: Basic Info -->
    <BasicInfoTab
      v-show="activeTab === 'basic'"
      :user="user"
      :is-editing="isEditing"
      :is-saving="isSaving"
      :edit-form="editForm"
      :email-form="emailForm"
      :is-verifying-password="isVerifyingPassword"
      :is-changing-email="isChangingEmail"
      :gender-name="genderName"
      :formatted-birth-date="formattedBirthDate"
      :user-type-name="userTypeName"
      :employee-type-name="employeeTypeName"
      @start-editing="$emit('start-editing')"
      @cancel-editing="$emit('cancel-editing')"
      @update-profile="$emit('update-profile')"
      @update:edit-form="$emit('update:editForm', $event)"
      @update:email-form="$emit('update:emailForm', $event)"
      @verify-password="$emit('verify-password')"
      @request-change-email="$emit('request-change-email')"
      @reset-email-form="$emit('reset-email-form')"
    />

    <!-- TAB: Security -->
    <SecurityTab
      v-show="activeTab === 'security'"
      :user="user"
      :password-form="passwordForm"
      :email-form="emailForm"
      :is-changing-password="isChangingPassword"
      :is-verifying-password="isVerifyingPassword"
      :is-changing-email="isChangingEmail"
      :can-change-password="canChangePassword"
      :can-change-email="canChangeEmail"
      @change-password="$emit('change-password')"
      @verify-password="$emit('verify-password')"
      @reset-email-form="$emit('reset-email-form')"
      @request-change-email="$emit('request-change-email')"
      @update:password-form="$emit('update:passwordForm', $event)"
      @update:email-form="$emit('update:emailForm', $event)"
    />

    <!-- ASN-only Tabs -->
    <!-- TAB: Unit Kerja -->
    <UnitKerjaTab
      v-if="isASN"
      v-show="activeTab === 'unitkerja'"
      :current-user-id="currentUserId"
      :should-load="visitedTabs.has('unitkerja')"
    />

    <!-- TAB: Jabatan -->
    <JabatanTab
      v-if="isASN"
      v-show="activeTab === 'jabatan'"
      :current-user-id="currentUserId"
      :should-load="visitedTabs.has('jabatan')"
    />

    <!-- TAB: Pangkat -->
    <PangkatTab
      v-if="isASN"
      v-show="activeTab === 'pangkat'"
      :current-user-id="currentUserId"
      :should-load="visitedTabs.has('pangkat')"
    />

    <!-- TAB: Pekerjaan -->
    <PekerjaanTab
      v-show="activeTab === 'pekerjaan'"
      :current-user-id="currentUserId"
      :should-load="visitedTabs.has('pekerjaan')"
    />

    <!-- TAB: Pendidikan -->
    <PendidikanTab
      v-show="activeTab === 'pendidikan'"
      :current-user-id="currentUserId"
      :should-load="visitedTabs.has('pendidikan')"
    />

    <!-- TAB: Pelatihan -->
    <PelatihanTab
      v-show="activeTab === 'pelatihan'"
      :current-user-id="currentUserId"
      :should-load="visitedTabs.has('pelatihan')"
    />

    <!-- TAB: Prestasi -->
    <PrestasiTab
      v-show="activeTab === 'prestasi'"
      :current-user-id="currentUserId"
      :should-load="visitedTabs.has('prestasi')"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import {
  BasicInfoTab,
  SecurityTab,
  PendidikanTab,
  PekerjaanTab,
  PelatihanTab,
  PrestasiTab,
  UnitKerjaTab,
  JabatanTab,
  PangkatTab,
} from "../tabs";

const props = defineProps({
  user: { type: Object, required: true },
  activeTab: { type: String, required: true },
  isEditing: Boolean,
  isSaving: Boolean,
  editForm: Object,
  emailForm: Object,
  passwordForm: Object,
  isVerifyingPassword: Boolean,
  isChangingEmail: Boolean,
  isChangingPassword: Boolean,
  canChangePassword: Boolean,
  canChangeEmail: Boolean,
  genderName: String,
  formattedBirthDate: String,
  userTypeName: String,
  employeeTypeName: String,
  visitedTabs: Set,
  isASN: Boolean,
  currentUserId: String,
});

const emit = defineEmits([
  "update:activeTab",
  "start-editing",
  "cancel-editing",
  "update-profile",
  "update:editForm",
  "update:emailForm",
  "update:passwordForm",
  "verify-password",
  "request-change-email",
  "reset-email-form",
  "change-password",
]);

const TAB_CONFIG = [
  { key: "basic", icon: "fa-user", labelKey: "Basic Info", asnOnly: false },
  { key: "security", icon: "fa-shield", labelKey: "Security", asnOnly: false },
  {
    key: "unitkerja",
    icon: "fa-building",
    labelKey: "Work Unit",
    asnOnly: true,
  },
  { key: "jabatan", icon: "fa-id-badge", labelKey: "Position", asnOnly: true },
  { key: "pangkat", icon: "fa-star", labelKey: "Rank", asnOnly: true },
  {
    key: "pekerjaan",
    icon: "fa-briefcase",
    labelKey: "Work Experience",
    asnOnly: false,
  },
  {
    key: "pendidikan",
    icon: "fa-graduation-cap",
    labelKey: "Education",
    asnOnly: false,
  },
  {
    key: "pelatihan",
    icon: "fa-certificate",
    labelKey: "Training",
    asnOnly: false,
  },
  {
    key: "prestasi",
    icon: "fa-trophy",
    labelKey: "Achievements",
    asnOnly: false,
  },
];

const visibleTabs = computed(() => {
  return TAB_CONFIG.filter((tab) => !tab.asnOnly || props.isASN);
});

const scrollContainer = ref(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);

const checkScroll = () => {
  const el = scrollContainer.value;
  if (el) {
    canScrollLeft.value = el.scrollLeft > 5;
    canScrollRight.value =
      Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth - 1;
  }
};

const scroll = (direction) => {
  const el = scrollContainer.value;
  if (el) {
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }
};

onMounted(async () => {
  await nextTick();
  setTimeout(checkScroll, 100);
  window.addEventListener("resize", checkScroll);
});
</script>

<style scoped>
.chip-tabs-container-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.chip-tabs-container {
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-behavior: smooth;
  width: 100%;
  scroll-snap-type: x mandatory;
}

.chip-tabs-container::-webkit-scrollbar {
  display: none;
}

.chip-tabs {
  display: flex;
  flex-wrap: nowrap;
  gap: 10px;
  padding: 18px 4px;
}

.scroll-btn {
  background: white;
  border: 1px solid #eee;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 2;
  transition: all 0.2s;
  flex-shrink: 0;
}

.scroll-btn:hover {
  background: #f8f9fa;
  transform: scale(1.1);
}

.left-btn {
  margin-right: 8px;
}

.right-btn {
  margin-left: 8px;
}

.chip-tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 50px;
  border: 1px solid #e0e0e0;
  background: #ffffff;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  flex-shrink: 0;
  scroll-snap-align: start;
}

.chip-tab:hover {
  border-color: #15406a;
  color: #15406a;
  transform: translateY(-2px);
}

.chip-tab.active {
  background: linear-gradient(135deg, #15406a 0%, #0f2d4a 100%);
  color: #fff;
  border-color: transparent;
}

.chip-tab.active:hover {
  transform: translateY(-2px);
}

.chip-tab i {
  font-size: 14px;
}

@media (max-width: 768px) {
  .chip-tab {
    padding: 8px 14px;
    font-size: 13px;
  }
}
</style>
