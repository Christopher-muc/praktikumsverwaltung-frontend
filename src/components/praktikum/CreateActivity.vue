<template>
  <v-dialog
    v-model="dialog"
    max-width="500"
    persistent
  >
    <v-card rounded="xl">
      <v-card-title class="pa-6 pb-2">
        Tätigkeitsblock hinzufügen
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form @submit.prevent="save">
          <v-text-field
            v-model="beschreibung"
            label="Beschreibung"
            variant="outlined"
            class="mb-2"
          />

          <v-text-field
            v-model="beginnDatum"
            label="Beginn"
            type="date"
            variant="outlined"
            class="mb-2"
          />

          <v-text-field
            v-model="endDatum"
            label="Ende"
            type="date"
            variant="outlined"
            class="mb-2"
          />

          <v-text-field
            v-model.number="stundenanzahl"
            label="Stundenanzahl"
            type="number"
            variant="outlined"
            suffix="h"
            min="0"
            class="mb-2"
          />

          <div
            v-if="error"
            class="text-error mt-2"
          >
            {{ error }}
          </div>

          <div class="d-flex justify-end ga-2 mt-6">
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
              Hinzufügen
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { TaetigkeitenblockRequestDTO } from "@/api/generated/api-spec/models";

import { ref, watch } from "vue";

import { ApiFactory } from "@/api/ApiFactory";
import { TaetigkeitenblockControllerApi } from "@/api/generated/api-spec";

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

const taetigkeitenblockApi = ApiFactory.getInstance(
  TaetigkeitenblockControllerApi
);

const beschreibung = ref("");
const beginnDatum = ref("");
const endDatum = ref("");
const stundenanzahl = ref<number>();

const saving = ref(false);
const error = ref("");

watch(
  () => dialog.value,
  (open) => {
    if (!open) {
      return;
    }

    resetForm();

    if (props.selectedDate) {
      const date = toDateKey(props.selectedDate);

      beginnDatum.value = date;
      endDatum.value = date;
    }
  }
);

async function save() {
  error.value = "";

  if (!props.selectedDate) {
    error.value = "Es wurde kein Datum ausgewählt.";
    return;
  }

  if (!beschreibung.value.trim()) {
    error.value = "Bitte eine Beschreibung eingeben.";
    return;
  }

  if (!beginnDatum.value || !endDatum.value) {
    error.value = "Bitte Beginn und Ende angeben.";
    return;
  }

  if (endDatum.value < beginnDatum.value) {
    error.value = "Das Enddatum darf nicht vor dem Beginn liegen.";
    return;
  }

  if (stundenanzahl.value === undefined || stundenanzahl.value <= 0) {
    error.value = "Die Stundenanzahl muss größer als 0 sein.";
    return;
  }

  saving.value = true;

  try {
    const request: TaetigkeitenblockRequestDTO = {
      studentId: props.studentId,
      beschreibung: beschreibung.value.trim(),
      beginnDatum: new Date(`${beginnDatum.value}T00:00:00`),
      endDatum: new Date(`${endDatum.value}T00:00:00`),
      stundenanzahl: stundenanzahl.value,
    };

    await taetigkeitenblockApi.createTaetigkeitenblock(request);

    emit("created");
    close();
  } catch (e) {
    console.debug("Tätigkeitsblock konnte nicht erstellt werden:", e);

    error.value = "Der Tätigkeitsblock konnte nicht erstellt werden.";
  } finally {
    saving.value = false;
  }
}

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function close() {
  dialog.value = false;
  resetForm();
}

function resetForm() {
  beschreibung.value = "";
  beginnDatum.value = "";
  endDatum.value = "";
  stundenanzahl.value = undefined;
  error.value = "";
}
</script>
