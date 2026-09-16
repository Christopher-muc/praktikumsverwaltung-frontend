<template>
  <v-dialog
    v-model="dialog"
    max-width="500"
    persistent
  >
    <v-card rounded="xl">
      <v-card-title class="pa-6 pb-2">
        Zeitgutschrift bearbeiten
      </v-card-title>

      <v-card-text class="pa-6 pt-3">
        <v-form
          ref="form"
          @submit.prevent="updateZeitgutschrift"
        >
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
              Speichern
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { ZeitgutschriftDTO } from "@/api/generated/api-spec";

import { computed, ref, watch } from "vue";

import { ApiFactory } from "@/api/ApiFactory";
import { ZeitgutschriftControllerApi } from "@/api/generated/api-spec";

/*
 * Dialog
 */
const dialog = defineModel<boolean>({
  default: false,
});

/*
 * Props
 */
const props = defineProps<{
  studentId: number;
  zeitgutschrift: ZeitgutschriftDTO | undefined;
}>();

/*
 * Events
 */
const emit = defineEmits<{
  updated: [];
}>();

/*
 * API
 */
const zeitgutschriftApi = ApiFactory.getInstance(
  ZeitgutschriftControllerApi
);

/*
 * Formular
 */
const form = ref();

const mengeMinuten = ref<number>();
const grund = ref("");

const saving = ref(false);

/*
 * Daten der ausgewählten Zeitgutschrift
 * ins Formular übernehmen.
 */
watch(
  () => props.zeitgutschrift,
  (zeitgutschrift) => {
    if (!zeitgutschrift) {
      return;
    }

    mengeMinuten.value = zeitgutschrift.mengeMinuten;
    grund.value = zeitgutschrift.grund ?? "";
  },
  {
    immediate: true,
  }
);

/*
 * Datum anzeigen.
 *
 * Das Datum kommt beim Bearbeiten aus der
 * vorhandenen Zeitgutschrift.
 */
const formattedDate = computed(() => {
  return (
    props.zeitgutschrift?.tag?.toLocaleDateString("de-DE") ?? ""
  );
});

/*
 * Validierung
 */
const required = (value: string) =>
  !!value?.trim() || "Dieses Feld ist erforderlich";

const requiredMinutes = (value: number | undefined) =>
  (value !== undefined && value > 0) ||
  "Die Minuten müssen größer als 0 sein.";

/*
 * PUT /zeitgutschrift
 */
async function updateZeitgutschrift() {
  const result = await form.value?.validate();

  if (!result?.valid) {
    return;
  }

  const zeitgutschrift = props.zeitgutschrift;

  if (
    !zeitgutschrift ||
    zeitgutschrift.id === undefined ||
    !zeitgutschrift.tag
  ) {
    return;
  }

  saving.value = true;

  try {
    await zeitgutschriftApi.updateZeitgutschrift({
      tag: zeitgutschrift.tag,
      mengeMinuten: mengeMinuten.value,
      grund: grund.value.trim(),
      praktikumID: props.studentId,
      zeitgutschriftID: zeitgutschrift.id,
    });

    emit("updated");

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

  form.value?.resetValidation();
}
</script>