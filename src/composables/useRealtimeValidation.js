import { watch } from "vue";

/**
 * Composable untuk validasi real-time seluruh form secara cross-field.
 * Menggunakan full-schema validation agar .test() yang mereferensi
 * field lain (this.parent) tetap berjalan secara real-time.
 *
 * @param {Object} options
 * @param {import('vue').Reactive} options.formData - reactive form data
 * @param {import('vue').Reactive} options.formErrors - reactive form errors
 * @param {import('vue').Ref<boolean>} options.wasValidated - ref boolean, true setelah submit pertama
 * @param {import('yup').ObjectSchema} options.validationSchema - yup validation schema
 */
export function useRealtimeValidation({
  formData,
  formErrors,
  wasValidated,
  validationSchema,
}) {
  watch(
    formData,
    async () => {
      if (!wasValidated.value) return;

      try {
        await validationSchema.validate(formData, { abortEarly: false });
        // Semua valid — bersihkan semua error
        Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
      } catch (err) {
        // Bersihkan dulu, lalu set yang masih error
        Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
        if (err.inner) {
          err.inner.forEach((e) => {
            if (e.path in formErrors) {
              formErrors[e.path] = e.message;
            }
          });
        }
      }
    },
    { deep: true },
  );
}
