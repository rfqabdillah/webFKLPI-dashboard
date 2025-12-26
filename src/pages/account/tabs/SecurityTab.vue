<template>
  <div>
    <div class="card shadow-sm mb-4">
      <div class="card-header bg-white">
        <div class="d-flex align-items-center">
          <div class="section-icon bg-warning">
            <i class="fa fa-lock"></i>
          </div>
          <h5 class="mb-0 ms-3">{{ $t("Change Password") }}</h5>
        </div>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <!-- Current Password -->
          <div class="col-12">
            <label
              class="form-label fw-bold text-muted small text-uppercase mb-1"
              >{{ $t("Current Password") }}</label
            >
            <div class="input-group">
              <input
                :value="passwordForm.currentPassword"
                @input="
                  handlePasswordInput('currentPassword', $event.target.value)
                "
                @blur="validatePasswordField('currentPassword')"
                :type="showCurrentPassword ? 'text' : 'password'"
                class="form-control"
                :class="{ 'is-invalid': passwordErrors.currentPassword }"
                :placeholder="$t('Enter current password')"
              />
              <button
                class="btn btn-outline-primary"
                type="button"
                @click="showCurrentPassword = !showCurrentPassword"
              >
                <i
                  class="fa"
                  :class="showCurrentPassword ? 'fa-eye-slash' : 'fa-eye'"
                ></i>
              </button>
            </div>
            <small v-if="passwordErrors.currentPassword" class="text-danger">
              {{ passwordErrors.currentPassword }}
            </small>
          </div>

          <!-- New Password -->
          <div class="col-12">
            <label
              class="form-label fw-bold text-muted small text-uppercase mb-1"
              >{{ $t("New Password") }}</label
            >
            <div class="input-group">
              <input
                :value="passwordForm.newPassword"
                @input="handlePasswordInput('newPassword', $event.target.value)"
                @blur="validatePasswordField('newPassword')"
                :type="showNewPassword ? 'text' : 'password'"
                class="form-control"
                :class="{ 'is-invalid': passwordErrors.newPassword }"
                :placeholder="$t('Enter new password')"
                :disabled="!passwordForm.currentPassword"
              />
              <button
                class="btn btn-outline-primary"
                type="button"
                @click="showNewPassword = !showNewPassword"
                :disabled="!passwordForm.currentPassword"
              >
                <i
                  class="fa"
                  :class="showNewPassword ? 'fa-eye-slash' : 'fa-eye'"
                ></i>
              </button>
            </div>
            <small v-if="passwordErrors.newPassword" class="text-danger">
              {{ passwordErrors.newPassword }}
            </small>
          </div>

          <!-- Confirm New Password -->
          <div class="col-12">
            <label
              class="form-label fw-bold text-muted small text-uppercase mb-1"
              >{{ $t("Confirm New Password") }}</label
            >
            <div class="input-group">
              <input
                :value="passwordForm.confirmPassword"
                @input="
                  handlePasswordInput('confirmPassword', $event.target.value)
                "
                @blur="validatePasswordField('confirmPassword')"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="form-control"
                :class="{ 'is-invalid': passwordErrors.confirmPassword }"
                :placeholder="$t('Confirm new password')"
                :disabled="!passwordForm.newPassword"
              />
              <button
                class="btn btn-outline-primary"
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                :disabled="!passwordForm.newPassword"
              >
                <i
                  class="fa"
                  :class="showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'"
                ></i>
              </button>
            </div>
            <small v-if="passwordErrors.confirmPassword" class="text-danger">
              {{ passwordErrors.confirmPassword }}
            </small>
          </div>

          <!-- Change Password Button -->
          <div class="col-12 text-end mt-4">
            <button
              class="btn btn-primary"
              @click="handleChangePassword"
              :disabled="!isPasswordFormValid || isChangingPassword"
            >
              <span v-if="isChangingPassword">
                <i class="fa fa-spinner fa-spin me-2"></i
                >{{ $t("Processing") }}...
              </span>
              <span v-else>{{ $t("Change Password") }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import * as yup from "yup";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  passwordForm: {
    type: Object,
    required: true,
  },
  isChangingPassword: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["change-password", "update:passwordForm"]);

// Local state for password visibility
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

// Validation errors
const passwordErrors = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// Yup schema for password validation
const passwordSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .required(() => t("Current password is required")),
  newPassword: yup
    .string()
    .required(() => t("New password is required"))
    .min(6, () => t("Password must be at least 6 characters")),
  confirmPassword: yup
    .string()
    .required(() => t("Confirm password is required"))
    .oneOf([yup.ref("newPassword")], () => t("Passwords do not match")),
});

// Re-validate when locale changes to update error messages
watch(
  () => locale.value,
  () => {
    Object.keys(passwordErrors).forEach((field) => {
      if (passwordErrors[field]) {
        validatePasswordField(field);
      }
    });
  }
);

// Validate single password field
const validatePasswordField = async (field) => {
  try {
    await passwordSchema.validateAt(field, props.passwordForm);
    passwordErrors[field] = "";
  } catch (error) {
    passwordErrors[field] = error.message;
  }
};

// Handle password input
const handlePasswordInput = (field, value) => {
  emit("update:passwordForm", { ...props.passwordForm, [field]: value });
  // Clear error when user starts typing
  if (passwordErrors[field]) {
    passwordErrors[field] = "";
  }
};

// Validate entire password form
const validatePasswordForm = async () => {
  try {
    await passwordSchema.validate(props.passwordForm, { abortEarly: false });
    Object.keys(passwordErrors).forEach((key) => (passwordErrors[key] = ""));
    return true;
  } catch (error) {
    error.inner.forEach((err) => {
      passwordErrors[err.path] = err.message;
    });
    return false;
  }
};

// Computed: Check if password form is valid
const isPasswordFormValid = computed(() => {
  return (
    props.passwordForm.currentPassword &&
    props.passwordForm.newPassword &&
    props.passwordForm.newPassword.length >= 6 &&
    props.passwordForm.confirmPassword &&
    props.passwordForm.newPassword === props.passwordForm.confirmPassword &&
    !passwordErrors.currentPassword &&
    !passwordErrors.newPassword &&
    !passwordErrors.confirmPassword
  );
});

// Handle change password with validation
const handleChangePassword = async () => {
  const isValid = await validatePasswordForm();
  if (isValid) {
    emit("change-password");
  }
};
</script>

<style scoped>
.section-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
}

.is-invalid {
  border-color: #dc3545 !important;
}
</style>
