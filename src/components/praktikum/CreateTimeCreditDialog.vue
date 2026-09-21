<template>
  <v-dialog
    v-model="dialog"
    max-width="500"
    persistent
  >
    <v-card rounded="xl">
      <v-card-title class="pa-6 pb-2"> Zeitgutschrift hinzufügen </v-card-title>

      <v-card-text class="pa-6 pt-3">
        <v-form @submit.prevent="createZeitgutschrift">
          <v-text-field
            :model-value="formattedDate"
            label="Datum"
            variant="outlined"
            readonly
            :error-messages="validationStore.getFieldErrors('datum')"
            class="mb-2"
          />

          <v-text-field
            v-model.number="minuten"
            label="Minuten"
            type="number"
            variant="outlined"
            suffix="min"
            :error-messages="validationStore.getFieldErrors('minuten')"
            class="mb-2"
          />

          <v-text-field
            v-model="grund"
            label="Grund"
            variant="outlined"
            :error-messages="validationStore.getFieldErrors('grund')"
            class="mb-2"
          />

          <div class="d-flex justify-end ga-2 mt-4">
            <v-btn
              variant="text"
              @click="close"
            >
              Abbrechen
            </v-btn>

            <v-btn
              color="primary"
              type="submit"
            >
              Zeitgutschrift anlegen
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { ZeitgutschriftRequestDTO } from "@/api/generated/api-spec/models";

import { computed, ref } from "vue";

import { ApiFactory } from "@/api/ApiFactory";
import { ZeitgutschriftControllerApi } from "@/api/generated/api-spec";
import { useValidationStore } from "@/stores/validation";

const dialog = defineModel<boolean>({
  default: false,
});

const props = defineProps<{
  studentId: number;
  selectedDate?: Date;
}>();

const emit = defineEmits<{
  created: [];
}>();

const zeitgutschriftApi = ApiFactory.getInstance(ZeitgutschriftControllerApi);

const validationStore = useValidationStore();

const minuten = ref<number>();
const grund = ref("");

const formattedDate = computed(() => {
  if (!props.selectedDate) {
    return "";
  }

  return props.selectedDate.toLocaleDateString("de-DE");
});

async function createZeitgutschrift() {
  if (!props.selectedDate) {
    return;
  }

  const request: ZeitgutschriftRequestDTO = {
    studentId: props.studentId,
    datum: props.selectedDate,
    minuten: minuten.value!,
    grund: grund.value.trim(),
  };

  await zeitgutschriftApi.createZeitgutschrift(request);

  emit("created");
  close();
}

function close() {
  dialog.value = false;
  resetForm();
}

function resetForm() {
  minuten.value = undefined;
  grund.value = "";
}
</script>
