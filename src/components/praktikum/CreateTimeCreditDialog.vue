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
          <!-- Datum nur anzeigen -->
          <v-text-field
            :model-value="formattedDate"
            label="Datum"
            variant="outlined"
            readonly
            class="mb-2"
          />

          <v-text-field
            v-model.number="mengeMinuten"
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
import { computed, ref } from "vue";

import { ApiFactory } from "@/api/ApiFactory";
import { ZeitgutschriftControllerApi } from "@/api/generated/api-spec";

/*
 * Dialog
 */
const dialog = defineModel<boolean>({
  default: false,
});

/*
 * Daten kommen aus [id].vue
 */
const props = defineProps<{
  studentId: number;
  selectedDate: Date | undefined;
}>();

/*
 * Parent nach erfolgreichem Erstellen informieren
 */
const emit = defineEmits<{
  created: [];
}>();

/*
 * API
 */
const zeitgutschriftApi = ApiFactory.getInstance(ZeitgutschriftControllerApi);

/*
 * Formular
 */
const form = ref();

const mengeMinuten = ref<number>();
const grund = ref("");

const saving = ref(false);

/*
 * Datum für die Anzeige
 */
const formattedDate = computed(() => {
  if (!props.selectedDate) {
    return "";
  }

  return props.selectedDate.toLocaleDateString("de-DE");
});

/*
 * Date -> YYYY-MM-DD vermeiden wir hier bewusst:
 * Der generierte API-Client erwartet bei OpenAPI format: date
 * normalerweise ein Date-Objekt.
 */

/*
 * Validierung
 */
const required = (value: string) =>
  !!value?.trim() || "Dieses Feld ist erforderlich";

const requiredMinutes = (value: number | undefined) =>
  (value !== undefined && value > 0) || "Die Minuten müssen größer als 0 sein.";

/*
 * Zeitgutschrift erstellen
 */
async function createZeitgutschrift() {
  const result = await form.value?.validate();

  if (!result?.valid) {
    return;
  }

  if (!props.selectedDate) {
    return;
  }

  saving.value = true;

  try {
    await zeitgutschriftApi.createZeitgutschrift({
      tag: props.selectedDate,
      mengeMinuten: mengeMinuten.value!,
      grund: grund.value.trim(),
      praktikumID: props.studentId,
    });

    emit("created");

    close();
  } finally {
    saving.value = false;
  }
}

/*
 * Dialog schließen
 */
function close() {
  dialog.value = false;

  resetForm();
}

/*
 * Formular zurücksetzen
 */
function resetForm() {
  mengeMinuten.value = undefined;
  grund.value = "";

  form.value?.resetValidation();
}
</script>
