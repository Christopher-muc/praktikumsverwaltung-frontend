<template>
  <v-dialog
    v-model="dialog"
    max-width="600"
    persistent
  >
    <v-card rounded="xl">
      <v-card-title class="pa-6 pb-2"> Student bearbeiten </v-card-title>

      <v-card-text class="pa-6">
        <!-- Auswahl: Name oder Praktikum -->
        <v-btn-toggle
          v-model="editMode"
          mandatory
          divided
          class="mb-6"
        >
          <v-btn value="name"> Name </v-btn>

          <v-btn value="praktikum"> Praktikum </v-btn>
        </v-btn-toggle>

        <!-- Name -->
        <div v-if="editMode === 'name'">
          <v-text-field
            v-model="firstName"
            label="Vorname"
            variant="outlined"
            :rules="[required]"
            class="mb-2"
          />

          <v-text-field
            v-model="lastName"
            label="Nachname"
            variant="outlined"
            :rules="[required]"
          />
        </div>

        <!-- Praktikum -->
        <div v-else>
          <v-progress-linear
            v-if="praktikumLoading"
            indeterminate
            class="mb-4"
          />

          <template v-else>
            <v-alert
              v-if="!praktikum"
              type="info"
              variant="tonal"
              class="mb-4"
            >
              Für diesen Studenten ist noch kein Praktikum angelegt. Beim
              Speichern wird ein neues Praktikum erstellt.
            </v-alert>

            <v-text-field
              v-model="beginnDatum"
              label="Beginn"
              type="date"
              variant="outlined"
              class="mb-2"
            />

            <v-text-field
              v-model="endeDatum"
              label="Ende"
              type="date"
              variant="outlined"
              class="mb-2"
            />

            <v-text-field
              v-model.number="wochenarbeitszeit"
              label="Wochenarbeitszeit"
              type="number"
              variant="outlined"
              suffix="Stunden"
              min="0"
              class="mb-2"
            />

            <v-text-field
              v-model.number="benoetigteWochen"
              label="Benötigte Wochen"
              type="number"
              variant="outlined"
              suffix="Wochen"
              min="0"
            />

            <v-alert
              v-if="dateError"
              type="error"
              variant="tonal"
              class="mt-4"
            >
              {{ dateError }}
            </v-alert>
          </template>
        </div>

        <!-- Aktionen -->
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
            :loading="saving"
            :disabled="praktikumLoading"
            @click="save"
          >
            Speichern
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type {
  FullPraktikumDTO,
  SimpleStudentDTO,
} from "@/api/generated/api-spec";

import { ref, watch } from "vue";

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
 * Props
 */
const props = defineProps<{
  student: SimpleStudentDTO | null;
}>();

/*
 * Events
 */
const emit = defineEmits<{
  updated: [];
}>();

/*
 * APIs
 */
const studentApi = ApiFactory.getInstance(StudentControllerApi);

const praktikumApi = ApiFactory.getInstance(PraktikumControllerApi);

/*
 * Bearbeitungsmodus
 */
const editMode = ref<"name" | "praktikum">("name");

/*
 * Student
 */
const firstName = ref("");
const lastName = ref("");

/*
 * Praktikum
 */
const praktikum = ref<FullPraktikumDTO | null>(null);

const beginnDatum = ref("");
const endeDatum = ref("");

const wochenarbeitszeit = ref<number | undefined>(undefined);

const benoetigteWochen = ref<number | undefined>(undefined);

/*
 * Status
 */
const praktikumLoading = ref(false);
const saving = ref(false);
const dateError = ref("");

/*
 * Validierung
 */
const required = (value: string) =>
  !!value?.trim() || "Dieses Feld ist erforderlich";

/*
 * Wenn ein Student ausgewählt wird:
 * Studentendaten übernehmen und Praktikum laden.
 */
watch(
  () => props.student,
  async (student) => {
    if (!student) {
      return;
    }

    firstName.value = student.vorname ?? "";
    lastName.value = student.nachname ?? "";

    editMode.value = "name";

    await loadPraktikum();
  },
  {
    immediate: true,
  }
);

/*
 * Praktikum laden.
 *
 * Falls keines existiert, bleiben die Felder leer.
 */
async function loadPraktikum() {
  if (props.student?.studentId === undefined) {
    return;
  }

  praktikumLoading.value = true;

  /*
   * Alte Werte zunächst entfernen.
   */
  praktikum.value = null;
  resetPraktikumFields();

  try {
    const loadedPraktikum = await praktikumApi.getPraktikum(
      props.student.studentId
    );

    praktikum.value = loadedPraktikum;

    beginnDatum.value = toDateInputValue(loadedPraktikum.beginnDatum);

    endeDatum.value = toDateInputValue(loadedPraktikum.endeDatum);

    wochenarbeitszeit.value = loadedPraktikum.wochenarbeitszeit;

    benoetigteWochen.value = loadedPraktikum.benoetigteWochen;
  } catch (error) {
    /*
     * getPraktikum liefert bei einem Studenten ohne
     * Praktikum einen Fehler (z. B. 404).
     *
     * Dann behandeln wir das Praktikum als "noch nicht
     * vorhanden". Beim Speichern wird POST verwendet.
     */
    console.debug(
      "Kein Praktikum für Student vorhanden:",
      props.student.studentId,
      error
    );

    praktikum.value = null;
    resetPraktikumFields();
  } finally {
    praktikumLoading.value = false;
  }
}

/*
 * Entscheiden, was gespeichert werden soll.
 */
async function save() {
  if (editMode.value === "name") {
    await updateStudent();
    return;
  }

  await savePraktikum();
}

/*
 * Student aktualisieren.
 */
async function updateStudent() {
  if (props.student?.studentId === undefined) {
    return;
  }

  if (!firstName.value.trim() || !lastName.value.trim()) {
    return;
  }

  saving.value = true;

  try {
    await studentApi.updateStudent(props.student.studentId, {
      vorname: firstName.value.trim(),
      nachname: lastName.value.trim(),
    });

    emit("updated");
    close();
  } finally {
    saving.value = false;
  }
}

/*
 * Praktikum speichern.
 *
 * Existiert bereits ein Praktikum:
 * -> PUT
 *
 * Existiert noch keines:
 * -> POST
 */
async function savePraktikum() {
  if (props.student?.studentId === undefined) {
    return;
  }

  dateError.value = "";

  /*
   * Datum validieren.
   *
   * YYYY-MM-DD kann lexikographisch verglichen werden.
   */
  if (
    beginnDatum.value &&
    endeDatum.value &&
    endeDatum.value < beginnDatum.value
  ) {
    dateError.value = "Das Enddatum darf nicht vor dem Beginndatum liegen.";

    return;
  }

  saving.value = true;

  try {
    const praktikumData = {
      beginnDatum: beginnDatum.value
        ? new Date(`${beginnDatum.value}T00:00:00`)
        : undefined,

      endeDatum: endeDatum.value
        ? new Date(`${endeDatum.value}T00:00:00`)
        : undefined,

      wochenarbeitszeit: wochenarbeitszeit.value,

      benoetigteWochen: benoetigteWochen.value,
    };

    /*
     * Praktikum existiert bereits.
     */
    if (praktikum.value) {
      console.debug(
        "Praktikum wird aktualisiert:",
        props.student.studentId,
        praktikumData
      );

      await praktikumApi.updatePraktikum(
        props.student.studentId,
        praktikumData
      );
    } else {
      /*
       * Student hat noch kein Praktikum.
       */
      console.debug(
        "Praktikum wird neu angelegt:",
        props.student.studentId,
        praktikumData
      );

      await praktikumApi.createPraktikum({
        studentId: props.student.studentId,
        ...praktikumData,
      });
    }

    emit("updated");
    close();
  } finally {
    saving.value = false;
  }
}

/*
 * Date aus dem API-Modell in YYYY-MM-DD
 * für <input type="date"> umwandeln.
 */
function toDateInputValue(value: Date | undefined): string {
  if (!value) {
    return "";
  }

  return value.toISOString().slice(0, 10);
}

/*
 * Praktikumsfelder leeren.
 */
function resetPraktikumFields() {
  beginnDatum.value = "";
  endeDatum.value = "";
  wochenarbeitszeit.value = undefined;
  benoetigteWochen.value = undefined;
}

/*
 * Dialog schließen.
 */
function close() {
  dialog.value = false;

  editMode.value = "name";
  dateError.value = "";
}
</script>
