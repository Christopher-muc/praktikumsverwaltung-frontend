<template>
  <v-dialog
    v-model="dialog"
    max-width="500"
    persistent
  >
    <v-card rounded="xl">
      <v-card-title class="pa-6 pb-2">
        Tätigkeitsblock bearbeiten
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
            min="1"
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
              Speichern
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type {
  TaetigkeitenblockRequestDTO,
  TaetigkeitenblockResponseDTO,
} from "@/api/generated/api-spec/models";

import { ref, watch } from "vue";

import { ApiFactory } from "@/api/ApiFactory";
import { TaetigkeitenblockControllerApi } from "@/api/generated/api-spec/apis";

const dialog = defineModel<boolean>({
  default: false,
});

const props = defineProps<{
  activity: TaetigkeitenblockResponseDTO | null;
}>();

const emit = defineEmits<{
  updated: [];
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
  () => props.activity,
  (activity) => {
    if (!activity) {
      return;
    }

    beschreibung.value = activity.beschreibung ?? "";

    beginnDatum.value = activity.beginnDatum
      ? toDateKey(activity.beginnDatum)
      : "";

    endDatum.value = activity.endDatum ? toDateKey(activity.endDatum) : "";

    stundenanzahl.value = activity.stundenanzahl;

    error.value = "";
  },
  {
    immediate: true,
  }
);

async function save() {
  error.value = "";

  if (props.activity?.taetigkeitenblockId === undefined) {
    error.value = "Tätigkeitsblock besitzt keine ID.";
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
      studentId: props.activity.studentId,
      beschreibung: beschreibung.value.trim(),
      beginnDatum: new Date(`${beginnDatum.value}T00:00:00`),
      endDatum: new Date(`${endDatum.value}T00:00:00`),
      stundenanzahl: stundenanzahl.value,
    };

    await taetigkeitenblockApi.updateTaetigkeitenblock(
      props.activity.taetigkeitenblockId,
      request
    );

    emit("updated");
    close();
  } catch (e) {
    console.debug("Tätigkeitsblock konnte nicht aktualisiert werden:", e);

    error.value = "Der Tätigkeitsblock konnte nicht gespeichert werden.";
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
  error.value = "";
}
</script>
