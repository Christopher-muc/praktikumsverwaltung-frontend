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
            :error-messages="validationStore.getFieldErrors('beschreibung')"
            class="mb-2"
          />

          <v-text-field
            v-model="beginnDatum"
            label="Beginn"
            type="date"
            variant="outlined"
            :error-messages="validationStore.getFieldErrors('beginnDatum')"
            class="mb-2"
          />

          <v-text-field
            v-model="endDatum"
            label="Ende"
            type="date"
            variant="outlined"
            :error-messages="validationStore.getFieldErrors('endDatum')"
            class="mb-2"
          />

          <v-text-field
            v-model.number="stundenanzahl"
            label="Stundenanzahl"
            type="number"
            variant="outlined"
            suffix="h"
            :error-messages="validationStore.getFieldErrors('stundenanzahl')"
            class="mb-2"
          />

          <div class="d-flex justify-end ga-2 mt-6">
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
import { useValidationStore } from "@/stores/validation";

const dialog = defineModel<boolean>({
  default: false,
});

const props = defineProps<{
  studentId: number;
  activity: TaetigkeitenblockResponseDTO | null;
}>();

const emit = defineEmits<{
  updated: [];
}>();

const taetigkeitenblockApi = ApiFactory.getInstance(
  TaetigkeitenblockControllerApi
);

const validationStore = useValidationStore();

const beschreibung = ref("");
const beginnDatum = ref("");
const endDatum = ref("");
const stundenanzahl = ref(0);

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

    stundenanzahl.value = activity.stundenanzahl ?? 0;
  },
  {
    immediate: true,
  }
);

async function save() {
  if (!props.activity || props.activity.taetigkeitenblockId === undefined) {
    return;
  }

  const request: TaetigkeitenblockRequestDTO = {
    studentId: props.studentId,
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
}

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function close() {
  dialog.value = false;
}
</script>
