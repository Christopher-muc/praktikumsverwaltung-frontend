import { defineStore } from "pinia";
import { ref } from "vue";

export const useValidationStore = defineStore("validation", () => {
  const fieldErrors = ref<Record<string, string[]>>({});

  function setFieldErrors(errors: Record<string, string[]>) {
    fieldErrors.value = errors;
  }

  function getFieldErrors(field: string): string[] {
    return fieldErrors.value[field] ?? [];
  }

  function clearFieldErrors() {
    fieldErrors.value = {};
  }

  return {
    fieldErrors,
    setFieldErrors,
    getFieldErrors,
    clearFieldErrors,
  };
});