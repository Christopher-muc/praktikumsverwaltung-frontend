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
          :items="['Student', 'Praktikum']"
          hide-actions
          flat
        >
          <!-- Schritt 1: Student -->
          <template #[`item.1`]>
            <v-form
              ref="studentForm"
              class="pt-3"
              @submit.prevent="nextStep"
            >
              <v-text-field
                v-model="newStudent.firstName"
                label="Vorname"
                variant="outlined"
                :rules="[required]"
                class="mb-2"
                autofocus
              />

              <v-text-field
                v-model="newStudent.lastName"
                label="Nachname"
                variant="outlined"
                :rules="[required]"
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

          <!-- Schritt 2: Praktikum -->
          <template #[`item.2`]>
            <v-form
              ref="praktikumForm"
              @submit.prevent="createStudent"
            >
              <v-text-field
                v-model.number="newStudent.targetHours"
                label="Sollzeit pro Woche"
                type="number"
                variant="outlined"
                suffix="h"
                min="0"
                class="mb-2"
              />

              <v-text-field
                v-model.number="newStudent.requiredWeeks"
                label="Benötigte Wochen"
                type="number"
                variant="outlined"
                min="0"
                class="mb-2"
              />

              <v-text-field
                v-model="newStudent.startDate"
                label="Beginn"
                type="date"
                variant="outlined"
                class="mb-2"
              />

              <v-text-field
                v-model="newStudent.endDate"
                label="Ende"
                type="date"
                variant="outlined"
                :rules="[endDateRule]"
              />

              <div class="d-flex justify-space-between mt-4">
                <v-btn
                  variant="text"
                  :disabled="saving"
                  @click="step = 1"
                >
                  Zurück
                </v-btn>

                <div class="d-flex ga-2">
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
import { reactive, ref } from "vue";

import { ApiFactory } from "@/api/ApiFactory";
import {
  PraktikumControllerApi,
  StudentControllerApi,
} from "@/api/generated/api-spec";

/*
 * Dialog
 */
const dialog = defineModel<boolean>({
  default: false,
});

/*
 * Events
 */
const emit = defineEmits<{
  created: [];
}>();

/*
 * APIs
 */
const studentApi = ApiFactory.getInstance(StudentControllerApi);

const praktikumApi = ApiFactory.getInstance(PraktikumControllerApi);

/*
 * Stepper / Forms
 */
const step = ref(1);

const studentForm = ref();
const praktikumForm = ref();

const saving = ref(false);

/*
 * Formulardaten
 */
const newStudent = reactive({
  firstName: "",
  lastName: "",

  targetHours: undefined as number | undefined,
  requiredWeeks: undefined as number | undefined,

  startDate: "",
  endDate: "",
});

/*
 * Validierung
 */
const required = (value: string) =>
  !!value?.trim() || "Dieses Feld ist erforderlich";

const endDateRule = (value: string) => {
  if (!value || !newStudent.startDate) {
    return true;
  }

  return (
    value >= newStudent.startDate ||
    "Das Enddatum darf nicht vor dem Beginn liegen."
  );
};

/*
 * Schritt 1 -> Schritt 2
 */
async function nextStep() {
  const result = await studentForm.value?.validate();

  if (!result?.valid) {
    return;
  }

  step.value = 2;
}

/*
 * Student + optional Praktikum erstellen
 */
async function createStudent() {
  /*
   * Erst Praktikumsformular validieren.
   */
  const result = await praktikumForm.value?.validate();

  if (!result?.valid) {
    return;
  }

  saving.value = true;

  try {
    /*
     * 1. Student erstellen
     *
     * Rückgabewert ist die studentId.
     */
    const studentId = await studentApi.createStudent({
      vorname: newStudent.firstName.trim(),
      nachname: newStudent.lastName.trim(),
    });

    /*
     * 2. Prüfen, ob überhaupt Praktikumsdaten
     * eingegeben wurden.
     *
     * Praktikum ist optional.
     */
    const hasPraktikumData =
      newStudent.targetHours !== undefined ||
      newStudent.requiredWeeks !== undefined ||
      newStudent.startDate !== "" ||
      newStudent.endDate !== "";

    /*
     * 3. Nur dann ein Praktikum anlegen.
     */
    if (hasPraktikumData) {
      await praktikumApi.createPraktikum({
        studentId,

        beginnDatum: newStudent.startDate
          ? new Date(`${newStudent.startDate}T00:00:00`)
          : undefined,

        endeDatum: newStudent.endDate
          ? new Date(`${newStudent.endDate}T00:00:00`)
          : undefined,

        wochenarbeitszeit: newStudent.targetHours,

        benoetigteWochen: newStudent.requiredWeeks,
      });
    }

    /*
     * Parent-Komponente informieren.
     */
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
  step.value = 1;

  newStudent.firstName = "";
  newStudent.lastName = "";

  newStudent.targetHours = undefined;
  newStudent.requiredWeeks = undefined;

  newStudent.startDate = "";
  newStudent.endDate = "";

  studentForm.value?.resetValidation();
  praktikumForm.value?.resetValidation();
}
</script>
