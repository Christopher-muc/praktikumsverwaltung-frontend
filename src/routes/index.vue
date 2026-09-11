<template>
  <v-container>
    <!-- Überschrift + Student hinzufügen -->
    <div class="d-flex justify-space-between align-center mb-4">
      <h1 class="text-h4">Studenten</h1>

      <v-btn
          v-if="canWrite"
          variant="outlined"
          @click="openDialog"
      >
        Student hinzufügen
      </v-btn>
    </div>

    <!-- Studentenliste -->
    <v-list>
      <template
          v-for="(student, index) in filteredStudents"
          :key="student.id"
      >
        <v-list-item
            :title="`${student.firstName} ${student.lastName}`"
            :to="`/student/${student.id}`"
        />

        <v-divider
            v-if="index < filteredStudents.length - 1"
        />
      </template>
    </v-list>

    <!-- Meldung, wenn nichts gefunden wurde -->
    <div
        v-if="filteredStudents.length === 0"
        class="text-medium-emphasis pa-4"
    >
      Keine Studenten gefunden.
    </div>

    <!-- Student hinzufügen Dialog -->
    <v-dialog
        v-model="dialog"
        max-width="650"
        persistent
    >
      <v-card rounded="xl">
        <!-- Titel -->
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
            <template #item.1>
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
                      @click="closeDialog"
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
            <template #item.2>
              <v-form @submit.prevent="createStudent">
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
                        @click="closeDialog"
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
  </v-container>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useRoute } from "vue-router";

import useHasAnyRole from "@/composables/useHasAnyRole";
import { Role } from "@/types/Role";

const route = useRoute();

const canWrite = useHasAnyRole(Role.WRITER);

const dialog = ref(false);
const step = ref(1);

const studentForm = ref();

const students = ref([
  {
    id: 1,
    firstName: "Max",
    lastName: "Mustermann",
  },
  {
    id: 2,
    firstName: "Anna",
    lastName: "Musterfrau",
  },
  {
    id: 3,
    firstName: "Peter",
    lastName: "Beispiel",
  },
]);

/**
 * Studenten anhand des Suchbegriffs aus der App-Bar filtern.
 *
 * Beispiel:
 * /?search=max
 */
const filteredStudents = computed(() => {
  const search = String(route.query.search ?? "")
      .trim()
      .toLowerCase();

  if (!search) {
    return students.value;
  }

  return students.value.filter((student) => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();

    return fullName.includes(search);
  });
});

const newStudent = reactive({
  firstName: "",
  lastName: "",
  targetHours: undefined as number | undefined,
  requiredWeeks: undefined as number | undefined,
  startDate: "",
  endDate: "",
});

/**
 * Pflichtfeld-Validierung
 */
const required = (value: string) =>
    !!value?.trim() || "Dieses Feld ist erforderlich";

/**
 * Dialog öffnen
 */
function openDialog() {
  if (!canWrite.value) {
    return;
  }

  resetForm();
  dialog.value = true;
}

/**
 * Prüft Vorname + Nachname und wechselt
 * zum Praktikums-Schritt.
 */
async function nextStep() {
  const result = await studentForm.value?.validate();

  if (!result?.valid) {
    return;
  }

  step.value = 2;
}

/**
 * Student anlegen
 */
async function createStudent() {
  if (!canWrite.value) {
    return;
  }

  console.debug("Student:", {
    firstName: newStudent.firstName,
    lastName: newStudent.lastName,
  });

  console.debug("Praktikum:", {
    targetHours: newStudent.targetHours,
    requiredWeeks: newStudent.requiredWeeks,
    startDate: newStudent.startDate,
    endDate: newStudent.endDate,
  });

  /*
   * Später:
   *
   * 1. POST /student/
   *
   * const createdStudent = await studentApi.createStudent({
   *   firstName: newStudent.firstName,
   *   lastName: newStudent.lastName,
   * });
   *
   * 2. Praktikum mit createdStudent.id anlegen
   *
   * await praktikumApi.createPraktikum({
   *   studentId: createdStudent.id,
   *   targetHours: newStudent.targetHours,
   *   requiredWeeks: newStudent.requiredWeeks,
   *   startDate: newStudent.startDate,
   *   endDate: newStudent.endDate,
   * });
   */

  // Mock, solange Backend noch nicht angeschlossen ist
  students.value.push({
    id: Date.now(),
    firstName: newStudent.firstName,
    lastName: newStudent.lastName,
  });

  closeDialog();
}

/**
 * Dialog schließen
 */
function closeDialog() {
  dialog.value = false;
  resetForm();
}

/**
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
}
</script>