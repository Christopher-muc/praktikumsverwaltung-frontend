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
          <v-btn value="student">
            Student
          </v-btn>

          <v-btn value="praktikum">
            Praktikum
          </v-btn>

          <v-btn value="studiengang">
            Studiengang
          </v-btn>
        </v-btn-toggle>

        <!-- STUDENT -->
        <StudentNameForm
            v-if="editMode === 'student'"
            v-model:first-name="firstName"
            v-model:last-name="lastName"
            v-model:email="email"
            v-model:wochenarbeitszeit="studentWochenarbeitszeit"
        />

        <!-- PRAKTIKUM -->
        <StudentPraktikumForm
            v-if="editMode === 'praktikum'"
            v-model:beginn-datum="beginnDatum"
            v-model:ende-datum="endDatum"
            v-model:wochenarbeitszeit="praktikumWochenarbeitszeit"
            v-model:benoetigte-wochen="benoetigteWochen"
            :loading="praktikumLoading"
            :praktikum-exists="praktikum !== null"
            :date-error="dateError"
        />

        <!-- STUDIENGÄNGE -->
        <StudentStudiengaengeForm
            v-if="editMode === 'studiengang'"
            v-model="studiengaenge"
            :loading="studiengaengeLoading"
        />

        <!-- FEHLER -->
        <div
            v-if="error"
            class="text-error mt-4"
        >
          {{ error }}
        </div>

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
  PraktikumRequestDTO,
  PraktikumResponseDTO,
  StudentRequestDTO,
  StudentResponseDTO,
  StudiengangResponseDTO,
} from "@/api/generated/api-spec/models";

import { ref, watch } from "vue";

import { ApiFactory } from "@/api/ApiFactory";
import {
  PraktikumControllerApi,
  StudentControllerApi,
  StudiengangControllerApi,
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
  student: StudentResponseDTO | null;
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
const studentApi = ApiFactory.getInstance(
    StudentControllerApi
);

const praktikumApi = ApiFactory.getInstance(
    PraktikumControllerApi
);

const studiengangApi = ApiFactory.getInstance(
    StudiengangControllerApi
);

/*
 * Bearbeitungsmodus
 */
const editMode =
    ref<"student" | "praktikum" | "studiengang">(
        "student"
    );

/*
 * Student
 */
const firstName = ref("");
const lastName = ref("");
const email = ref("");

const studentWochenarbeitszeit =
    ref<number | undefined>();

/*
 * Praktikum
 */
const praktikum =
    ref<PraktikumResponseDTO | null>(null);

const beginnDatum = ref("");
const endDatum = ref("");

const praktikumWochenarbeitszeit =
    ref<number | undefined>();

const benoetigteWochen =
    ref<number | undefined>();

/*
 * Studiengänge
 */
const studiengaenge =
    ref<StudiengangResponseDTO[]>([]);

/*
 * Status
 */
const praktikumLoading = ref(false);
const studiengaengeLoading = ref(false);
const saving = ref(false);

const dateError = ref("");
const error = ref("");

/*
 * Student wurde ausgewählt
 */
watch(
    () => props.student,
    async (student) => {
      if (!student) {
        return;
      }

      firstName.value =
          student.vorname ?? "";

      lastName.value =
          student.nachname ?? "";

      email.value =
          student.email ?? "";

      studentWochenarbeitszeit.value =
          student.wochenarbeitszeit;

      editMode.value = "student";

      error.value = "";
      dateError.value = "";

      await Promise.all([
        loadPraktikum(),
        loadStudiengaenge(),
      ]);
    },
    {
      immediate: true,
    }
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
    const loadedPraktikum =
        await praktikumApi.getPraktikum(
            props.student.studentId
        );

    praktikum.value =
        loadedPraktikum;

    beginnDatum.value =
        toDateInputValue(
            loadedPraktikum.beginnDatum
        );

    endDatum.value =
        toDateInputValue(
            loadedPraktikum.endDatum
        );

    praktikumWochenarbeitszeit.value =
        loadedPraktikum.wochenarbeitszeit;

    benoetigteWochen.value =
        loadedPraktikum.benoetigteWochen;
  } catch (e) {
    console.debug(
        "Kein Praktikum für Student vorhanden:",
        props.student.studentId,
        e
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
    const fullStudent =
        await studentApi.getStudent(
            props.student.studentId
        );

    studiengaenge.value = [
      ...(fullStudent.studiengaenge ?? []),
    ];
  } catch (e) {
    console.debug(
        "Studiengänge konnten nicht geladen werden:",
        props.student.studentId,
        e
    );

    studiengaenge.value = [];
  } finally {
    studiengaengeLoading.value = false;
  }
}

/*
 * Je nach ausgewähltem Bereich speichern
 */
async function save() {
  error.value = "";

  if (editMode.value === "student") {
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

  if (
      !firstName.value.trim() ||
      !lastName.value.trim() ||
      !email.value.trim()
  ) {
    error.value =
        "Vorname, Nachname und E-Mail dürfen nicht leer sein.";

    return;
  }

  if (
      studentWochenarbeitszeit.value === undefined ||
      studentWochenarbeitszeit.value <= 0
  ) {
    error.value =
        "Die Wochenarbeitszeit muss größer als 0 sein.";

    return;
  }

  saving.value = true;

  try {
    const request: StudentRequestDTO = {
      vorname: firstName.value.trim(),
      nachname: lastName.value.trim(),
      email: email.value.trim(),
      wochenarbeitszeit:
      studentWochenarbeitszeit.value,
    };

    await studentApi.updateStudent(
        props.student.studentId,
        request
    );

    emit("updated");

    close();
  } catch (e) {
    console.debug(
        "Student konnte nicht aktualisiert werden:",
        e
    );

    error.value =
        "Der Student konnte nicht gespeichert werden.";
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
  error.value = "";

  if (
      beginnDatum.value &&
      endDatum.value &&
      endDatum.value < beginnDatum.value
  ) {
    dateError.value =
        "Das Enddatum darf nicht vor dem Beginndatum liegen.";

    return;
  }

  saving.value = true;

  try {
    const request: PraktikumRequestDTO = {
      studentId:
      props.student.studentId,

      beginnDatum:
          beginnDatum.value
              ? new Date(
                  `${beginnDatum.value}T00:00:00`
              )
              : undefined,

      endDatum:
          endDatum.value
              ? new Date(
                  `${endDatum.value}T00:00:00`
              )
              : undefined,

      wochenarbeitszeit:
      praktikumWochenarbeitszeit.value,

      benoetigteWochen:
      benoetigteWochen.value,
    };

    if (praktikum.value) {
      await praktikumApi.updatePraktikum(
          props.student.studentId,
          request
      );
    } else {
      await praktikumApi.createPraktikum(
          request
      );
    }

    emit("updated");

    close();
  } catch (e) {
    console.debug(
        "Praktikum konnte nicht gespeichert werden:",
        e
    );

    error.value =
        "Das Praktikum konnte nicht gespeichert werden.";
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

  error.value = "";
  saving.value = true;

  try {
    const studiengangIds =
        studiengaenge.value
            .map(
                (studiengang) =>
                    studiengang.studiengangId
            )
            .filter(
                (id): id is number =>
                    id !== undefined
            );

    await studiengangApi.updateStudiengaengeByStudent(
        props.student.studentId,
        {
          studiengangIds,
        }
    );

    emit("updated");

    close();
  } catch (e) {
    console.debug(
        "Studiengänge konnten nicht gespeichert werden:",
        e
    );

    error.value =
        "Die Studiengänge konnten nicht gespeichert werden.";
  } finally {
    saving.value = false;
  }
}

/*
 * Date -> YYYY-MM-DD
 */
function toDateInputValue(
    value: Date | undefined
): string {
  if (!value) {
    return "";
  }

  return value
      .toISOString()
      .slice(0, 10);
}

/*
 * Praktikumsfelder zurücksetzen
 */
function resetPraktikumFields() {
  beginnDatum.value = "";
  endDatum.value = "";

  praktikumWochenarbeitszeit.value =
      undefined;

  benoetigteWochen.value =
      undefined;
}

/*
 * Dialog schließen
 */
function close() {
  dialog.value = false;

  editMode.value = "student";

  dateError.value = "";
  error.value = "";
}
</script>