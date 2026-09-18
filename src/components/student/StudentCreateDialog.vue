<template>
  <v-dialog
    v-model="dialog"
    max-width="650"
    persistent
  >
    <v-card rounded="xl">
      <v-card-title class="d-flex align-center pa-6 pb-2">
        Student hinzufügen
      </v-card-title>

      <v-card-text class="pa-6 pt-3">
        <v-stepper
          v-model="step"
          :items="['Student', 'Praktikum', 'Studiengang']"
          hide-actions
          flat
        >
          <!-- SCHRITT 1: STUDENT -->
          <template #[`item.1`]>
            <v-form @submit.prevent="nextStep">
              <v-text-field
                v-model="newStudent.vorname"
                label="Vorname"
                variant="outlined"
                class="mb-2"
                autofocus
              />

              <v-text-field
                v-model="newStudent.nachname"
                label="Nachname"
                variant="outlined"
                class="mb-2"
              />

              <v-text-field
                v-model="newStudent.email"
                label="E-Mail"
                type="email"
                variant="outlined"
                class="mb-2"
              />

              <v-text-field
                v-model.number="newStudent.wochenarbeitszeit"
                label="Wochenarbeitszeit"
                type="number"
                variant="outlined"
                suffix="h"
                class="mb-2"
              />

              <div class="d-flex justify-space-between mt-4">
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
                  Weiter
                </v-btn>
              </div>
            </v-form>
          </template>

          <!-- SCHRITT 2: PRAKTIKUM -->
          <template #[`item.2`]>
            <v-form @submit.prevent="nextPraktikumStep">
              <v-text-field
                v-model.number="newPraktikum.wochenarbeitszeit"
                label="Sollzeit pro Woche"
                type="number"
                variant="outlined"
                suffix="h"
                class="mb-2"
              />

              <v-text-field
                v-model.number="newPraktikum.benoetigteWochen"
                label="Benötigte Wochen"
                type="number"
                variant="outlined"
                class="mb-2"
              />

              <v-text-field
                v-model="newPraktikum.beginnDatum"
                label="Beginn"
                type="date"
                variant="outlined"
                class="mb-2"
              />

              <v-text-field
                v-model="newPraktikum.endDatum"
                label="Ende"
                type="date"
                variant="outlined"
              />

              <div class="d-flex justify-space-between mt-4">
                <v-btn
                  variant="text"
                  @click="step = 1"
                >
                  Zurück
                </v-btn>

                <div class="d-flex ga-2">
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
                    Weiter
                  </v-btn>
                </div>
              </div>
            </v-form>
          </template>

          <!-- SCHRITT 3: STUDIENGÄNGE -->
          <template #[`item.3`]>
            <v-form @submit.prevent="createStudent">
              <v-autocomplete
                v-model="selectedStudiengangIds"
                :items="availableStudiengaenge"
                item-title="name"
                item-value="studiengangId"
                label="Studiengänge"
                variant="outlined"
                multiple
                chips
                closable-chips
                clearable
                class="mt-4 mb-2"
              />

              <div class="d-flex justify-space-between mt-4">
                <v-btn
                  variant="text"
                  @click="step = 2"
                >
                  Zurück
                </v-btn>

                <div class="d-flex ga-2">
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
                    Student anlegen
                  </v-btn>
                </div>
              </div>
            </v-form>
          </template>
        </v-stepper>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type {
  PraktikumRequestDTO,
  StudentRequestDTO,
  StudiengangResponseDTO,
} from "@/api/generated/api-spec/models";

import { reactive, ref, watch } from "vue";

import { ApiFactory } from "@/api/ApiFactory";
import {
  PraktikumControllerApi,
  StudentControllerApi,
  StudiengangControllerApi,
} from "@/api/generated/api-spec";

const dialog = defineModel<boolean>({
  default: false,
});

const emit = defineEmits<{
  created: [];
}>();

const studentApi = ApiFactory.getInstance(StudentControllerApi);

const praktikumApi = ApiFactory.getInstance(PraktikumControllerApi);

const studiengangApi = ApiFactory.getInstance(StudiengangControllerApi);

const step = ref(1);

const availableStudiengaenge = ref<StudiengangResponseDTO[]>([]);

const selectedStudiengangIds = ref<number[]>([]);

const newStudent = reactive({
  vorname: "",
  nachname: "",
  email: "",
  wochenarbeitszeit: undefined as number | undefined,
});

const newPraktikum = reactive({
  wochenarbeitszeit: undefined as number | undefined,
  benoetigteWochen: undefined as number | undefined,
  beginnDatum: "",
  endDatum: "",
});

watch(dialog, async (open) => {
  if (open) {
    await loadStudiengaenge();
  }
});

async function loadStudiengaenge() {
  availableStudiengaenge.value = await studiengangApi.getStudiengaenge();
}

function nextStep() {
  step.value = 2;
}

function nextPraktikumStep() {
  step.value = 3;
}

async function createStudent() {
  const studentRequest: StudentRequestDTO = {
    vorname: newStudent.vorname.trim(),
    nachname: newStudent.nachname.trim(),
    email: newStudent.email.trim(),
    wochenarbeitszeit: newStudent.wochenarbeitszeit,
  };

  const studentId = await studentApi.createStudent(studentRequest);

  const hasPraktikumData =
    newPraktikum.wochenarbeitszeit !== undefined ||
    newPraktikum.benoetigteWochen !== undefined ||
    newPraktikum.beginnDatum !== "" ||
    newPraktikum.endDatum !== "";

  if (hasPraktikumData) {
    const praktikumRequest: PraktikumRequestDTO = {
      studentId,

      beginnDatum: newPraktikum.beginnDatum
        ? new Date(`${newPraktikum.beginnDatum}T00:00:00`)
        : undefined,

      endDatum: newPraktikum.endDatum
        ? new Date(`${newPraktikum.endDatum}T00:00:00`)
        : undefined,

      benoetigteWochen: newPraktikum.benoetigteWochen,

      wochenarbeitszeit: newPraktikum.wochenarbeitszeit,
    };

    await praktikumApi.createPraktikum(praktikumRequest);
  }

  if (selectedStudiengangIds.value.length > 0) {
    await studiengangApi.updateStudiengaengeByStudent(studentId, {
      studiengangIds: selectedStudiengangIds.value,
    });
  }

  emit("created");
  close();
}

function close() {
  dialog.value = false;
  resetForm();
}

function resetForm() {
  step.value = 1;

  newStudent.vorname = "";
  newStudent.nachname = "";
  newStudent.email = "";
  newStudent.wochenarbeitszeit = undefined;

  newPraktikum.wochenarbeitszeit = undefined;
  newPraktikum.benoetigteWochen = undefined;
  newPraktikum.beginnDatum = "";
  newPraktikum.endDatum = "";

  selectedStudiengangIds.value = [];
}
</script>
