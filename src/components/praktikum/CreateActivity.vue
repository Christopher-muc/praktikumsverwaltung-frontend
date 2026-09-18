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
  const request: TaetigkeitenblockRequestDTO = {
    studentId: props.studentId,
    beschreibung: beschreibung.value.trim(),
    beginnDatum: new Date(`${beginnDatum.value}T00:00:00`),
    endDatum: new Date(`${endDatum.value}T00:00:00`),
    stundenanzahl: stundenanzahl.value!,
  };

  await taetigkeitenblockApi.createTaetigkeitenblock(request);

  emit("created");
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
  resetForm();
}

function resetForm() {
  beschreibung.value = "";
  beginnDatum.value = "";
  endDatum.value = "";
  stundenanzahl.value = undefined;
}
</script>
