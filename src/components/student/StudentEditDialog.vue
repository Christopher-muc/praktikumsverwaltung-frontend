<template>
  <v-dialog
    v-model="dialog"
    max-width="600"
    persistent
  >
    <v-card rounded="xl">
      <v-card-title class="pa-6 pb-2">
        Student bearbeiten
      </v-card-title>

      <v-card-text class="pa-6">
        <v-btn-toggle
          v-model="editMode"
          mandatory
          divided
          class="mb-6"
        >
          <v-btn value="name">
            Name
          </v-btn>

          <v-btn value="praktikum">
            Praktikum
          </v-btn>

          <v-btn value="studiengang">
            Studiengang
          </v-btn>
        </v-btn-toggle>

        <!-- NAME -->
        <student-name-form
          v-if="editMode === 'name'"
          v-model:first-name="firstName"
          v-model:last-name="lastName"
        />

        <!-- PRAKTIKUM -->
        <student-praktikum-form
          v-if="editMode === 'praktikum'"
          v-model:beginn-datum="beginnDatum"
          v-model:ende-datum="endeDatum"
          v-model:wochenarbeitszeit="wochenarbeitszeit"
          v-model:benoetigte-wochen="benoetigteWochen"
          :loading="praktikumLoading"
          :praktikum-exists="praktikum !== null"
          :date-error="dateError"
        />

        <!-- STUDIENGÄNGE -->
        <student-studiengaenge-form
          v-if="editMode === 'studiengang'"
          v-model="studiengaenge"
          :loading="studiengaengeLoading"
        />

        <!-- AKTIONEN -->
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
            :disabled="praktikumLoading || studiengaengeLoading"
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
  Studiengang,
} from "@/api/generated/api-spec";

import { ref, watch } from "vue";

import { ApiFactory } from "@/api/ApiFactory";
import {
  PraktikumControllerApi,
  StudentControllerApi,
} from "@/api/generated/api-spec";
import StudentNameForm from "@/components/student/StudentNameForm.vue";
import StudentPraktikumForm from "@/components/student/StudentPraktikumForm.vue";
import StudentStudiengaengeForm from "@/components/student/StudentStudiengaengeForm.vue";

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
const editMode = ref<"name" | "praktikum" | "studiengang">("name");

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

const wochenarbeitszeit = ref<number | undefined>();

const benoetigteWochen = ref<number | undefined>();

/*
 * Studiengänge
 */
const studiengaenge = ref<Studiengang[]>([]);

/*
 * Status
 */
const praktikumLoading = ref(false);

const studiengaengeLoading = ref(false);

const saving = ref(false);

const dateError = ref("");

/*
 * Student wurde ausgewählt
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

    await Promise.all([
      loadPraktikum(),
      loadStudiengaenge(),
    ]);
  },
  {
    immediate: true,
  },
);

/*
 * Praktikum laden
 */
async function loadPraktikum() {
  if (props.student?.studentId === undefined) {
    return;
  }

  praktikumLoading.value = true;

  praktikum.value = null;

  resetPraktikumFields();

  try {
    const loadedPraktikum = await praktikumApi.getPraktikum(
      props.student.studentId,
    );

    praktikum.value = loadedPraktikum;

    beginnDatum.value = toDateInputValue(
      loadedPraktikum.beginnDatum,
    );

    endeDatum.value = toDateInputValue(
      loadedPraktikum.endeDatum,
    );

    wochenarbeitszeit.value =
      loadedPraktikum.wochenarbeitszeit;

    benoetigteWochen.value =
      loadedPraktikum.benoetigteWochen;
  } catch (error) {
    console.debug(
      "Kein Praktikum für Student vorhanden:",
      props.student.studentId,
      error,
    );

    praktikum.value = null;

    resetPraktikumFields();
  } finally {
    praktikumLoading.value = false;
  }
}

/*
 * Studiengänge laden
 */
async function loadStudiengaenge() {
  if (props.student?.studentId === undefined) {
    return;
  }

  studiengaengeLoading.value = true;

  studiengaenge.value = [];

  try {
    const fullStudent = await studentApi.getStudent(
      props.student.studentId,
    );

    studiengaenge.value = [
      ...(fullStudent.studiengaenge ?? []),
    ];
  } catch (error) {
    console.error(
      "Studiengänge konnten nicht geladen werden:",
      props.student.studentId,
      error,
    );

    studiengaenge.value = [];
  } finally {
    studiengaengeLoading.value = false;
  }
}

/*
 * Speichern
 */
async function save() {
  if (editMode.value === "name") {
    await updateStudent();

    return;
  }

  if (editMode.value === "praktikum") {
    await savePraktikum();

    return;
  }

  if (editMode.value === "studiengang") {
    await saveStudiengaenge();
  }
}

/*
 * Student aktualisieren
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
    await studentApi.updateStudent(
      props.student.studentId,
      {
        vorname: firstName.value.trim(),
        nachname: lastName.value.trim(),
      },
    );

    emit("updated");

    close();
  } finally {
    saving.value = false;
  }
}

/*
 * Praktikum speichern
 */
async function savePraktikum() {
  if (props.student?.studentId === undefined) {
    return;
  }

  dateError.value = "";

  if (
    beginnDatum.value &&
    endeDatum.value &&
    endeDatum.value < beginnDatum.value
  ) {
    dateError.value =
      "Das Enddatum darf nicht vor dem Beginndatum liegen.";

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

    if (praktikum.value) {
      await praktikumApi.updatePraktikum(
        props.student.studentId,
        praktikumData,
      );
    } else {
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
 * Studiengänge speichern
 */
async function saveStudiengaenge() {
  if (props.student?.studentId === undefined) {
    return;
  }

  /*
   * TODO:
   * Backend-Endpunkt zum Speichern der Studiengänge
   * ergänzen.
   */
  console.debug(
    "Student:",
    props.student.studentId,
  );

  console.debug(
    "Zu speichernde Studiengänge:",
    studiengaenge.value,
  );

  console.warn(
    "Studiengänge können noch nicht gespeichert werden, " +
    "da der Backend-Endpunkt noch fehlt.",
  );
}

/*
 * Date -> YYYY-MM-DD
 */
function toDateInputValue(
  value: Date | undefined,
): string {
  if (!value) {
    return "";
  }

  return value.toISOString().slice(0, 10);
}

/*
 * Praktikumsfelder zurücksetzen
 */
function resetPraktikumFields() {
  beginnDatum.value = "";
  endeDatum.value = "";

  wochenarbeitszeit.value = undefined;
  benoetigteWochen.value = undefined;
}

/*
 * Dialog schließen
 */
function close() {
  dialog.value = false;

  editMode.value = "name";

  dateError.value = "";
}
</script>