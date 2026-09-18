<template>
  <v-dialog
    v-model="dialog"
    max-width="500"
    persistent
  >
    <v-card rounded="xl">
      <v-card-title class="pa-6 pb-2"> Zeitgutschrift hinzufügen </v-card-title>

      <v-card-text class="pa-6 pt-3">
        <v-form
          ref="form"
          @submit.prevent="createZeitgutschrift"
        >
          <v-text-field
            :model-value="formattedDate"
            label="Datum"
            variant="outlined"
            readonly
            class="mb-2"
          />

          <v-text-field
            v-model.number="minuten"
            label="Minuten"
            type="number"
            variant="outlined"
            suffix="min"
            min="1"
            :rules="[requiredMinutes]"
            class="mb-2"
          />

          <v-text-field
            v-model="grund"
            label="Grund"
            variant="outlined"
            :rules="[required]"
            class="mb-2"
          />

          <div
            v-if="error"
            class="text-error mt-2"
          >
            {{ error }}
          </div>

          <div class="d-flex justify-end ga-2 mt-4">
            <v-btn
              variant="text"
              :disabled="saving"
              @click="close"
            >
              Abbrechen
            </v-btn>

            <v-btn
              color="primary"
              type="submit"
              :loading="saving"
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

const form = ref();

const minuten = ref<number>();
const grund = ref("");

const saving = ref(false);
const error = ref("");

const formattedDate = computed(() => {
  if (!props.selectedDate) {
    return "";
  }

  return props.selectedDate.toLocaleDateString("de-DE");
});

const required = (value: string) =>
  !!value?.trim() || "Dieses Feld ist erforderlich";

const requiredMinutes = (value: number | undefined) =>
  (value !== undefined && value > 0) || "Die Minuten müssen größer als 0 sein.";

async function createZeitgutschrift() {
  error.value = "";

  const result = await form.value?.validate();

  if (!result?.valid) {
    return;
  }

  if (!props.selectedDate) {
    error.value = "Es wurde kein Datum ausgewählt.";
    return;
  }

  saving.value = true;

  try {
    const request: ZeitgutschriftRequestDTO = {
      studentId: props.studentId,
      datum: props.selectedDate,
      minuten: minuten.value!,
      grund: grund.value.trim(),
    };

    await zeitgutschriftApi.createZeitgutschrift(request);

    emit("created");
    close();
  } catch (e) {
    console.debug("Zeitgutschrift konnte nicht erstellt werden:", e);

    error.value = "Die Zeitgutschrift konnte nicht erstellt werden.";
  } finally {
    saving.value = false;
  }
}

function close() {
  dialog.value = false;
  resetForm();
}

function resetForm() {
  minuten.value = undefined;
  grund.value = "";
  error.value = "";

  form.value?.resetValidation();
}
</script>
