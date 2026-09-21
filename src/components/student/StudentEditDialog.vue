<template>
  <v-dialog
    v-model="dialog"
    max-width="600"
    persistent
  >
    <v-card rounded="xl">
      <v-card-title class="pa-6 pb-2"> Student bearbeiten </v-card-title>

      <v-card-text class="pa-6">
        <v-btn-toggle
          v-model="editMode"
          mandatory
          divided
          class="mb-6"
        >
          <v-btn value="student"> Student </v-btn>

          <v-btn value="praktikum"> Praktikum </v-btn>

          <v-btn value="studiengang"> Studiengang </v-btn>
        </v-btn-toggle>

        <!-- STUDENT -->
        <student-name-form
          v-if="editMode === 'student'"
          v-model:first-name="firstName"
          v-model:last-name="lastName"
          v-model:email="email"
          v-model:wochenarbeitszeit="studentWochenarbeitszeit"
        />

        <!-- PRAKTIKUM -->
        <student-praktikum-form
          v-if="editMode === 'praktikum'"
          v-model:beginn-datum="beginnDatum"
          v-model:end-datum="endDatum"
          v-model:wochenarbeitszeit="praktikumWochenarbeitszeit"
          v-model:benoetigte-wochen="benoetigteWochen"
          :loading="praktikumLoading"
          :praktikum-exists="praktikum !== null"
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
            @click="close"
          >
            Abbrechen
          </v-btn>

          <v-btn
            color="primary"
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

const dialog = defineModel<boolean>({
  default: false,
});

const props = defineProps<{
  student: StudentResponseDTO | null;
}>();

const emit = defineEmits<{
  updated: [];
}>();

const studentApi = ApiFactory.getInstance(StudentControllerApi);

const praktikumApi = ApiFactory.getInstance(PraktikumControllerApi);

const studiengangApi = ApiFactory.getInstance(StudiengangControllerApi);

const editMode = ref<"student" | "praktikum" | "studiengang">("student");

const firstName = ref("");
const lastName = ref("");
const email = ref("");

const studentWochenarbeitszeit = ref(0);

const praktikum = ref<PraktikumResponseDTO | null>(null);

const beginnDatum = ref("");
const endDatum = ref("");

const praktikumWochenarbeitszeit = ref(0);

const benoetigteWochen = ref(0);

const studiengaenge = ref<StudiengangResponseDTO[]>([]);

const praktikumLoading = ref(false);
const studiengaengeLoading = ref(false);

watch(
  () => props.student,
  async (student) => {
    if (!student) {
      return;
    }

    firstName.value = student.vorname ?? "";
    lastName.value = student.nachname ?? "";
    email.value = student.email ?? "";

    studentWochenarbeitszeit.value = student.wochenarbeitszeit ?? 0;

    editMode.value = "student";

    await Promise.all([loadPraktikum(), loadStudiengaenge()]);
  },
  {
    immediate: true,
  }
);

async function loadPraktikum() {
  if (props.student?.studentId === undefined) {
    return;
  }

  praktikumLoading.value = true;

  praktikum.value = null;
  resetPraktikumFields();

  try {
    const loadedPraktikum = await praktikumApi.getPraktikum(
      props.student.studentId
    );

    praktikum.value = loadedPraktikum;

    beginnDatum.value = toDateInputValue(loadedPraktikum.beginnDatum);

    endDatum.value = toDateInputValue(loadedPraktikum.endDatum);

    praktikumWochenarbeitszeit.value = loadedPraktikum.wochenarbeitszeit ?? 0;

    benoetigteWochen.value = loadedPraktikum.benoetigteWochen ?? 0;
  } catch {
    praktikum.value = null;
    resetPraktikumFields();
  } finally {
    praktikumLoading.value = false;
  }
}

async function loadStudiengaenge() {
  if (props.student?.studentId === undefined) {
    return;
  }

  studiengaengeLoading.value = true;

  const fullStudent = await studentApi.getStudent(props.student.studentId);

  studiengaenge.value = [...(fullStudent.studiengaenge ?? [])];

  studiengaengeLoading.value = false;
}

async function save() {
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

async function updateStudent() {
  if (props.student?.studentId === undefined) {
    return;
  }

  const request: StudentRequestDTO = {
    vorname: firstName.value.trim(),
    nachname: lastName.value.trim(),
    email: email.value.trim(),
    wochenarbeitszeit: studentWochenarbeitszeit.value,
  };

  await studentApi.updateStudent(props.student.studentId, request);

  emit("updated");
  close();
}

async function savePraktikum() {
  if (props.student?.studentId === undefined) {
    return;
  }

  if (!beginnDatum.value || !endDatum.value) {
    return;
  }

  const request: PraktikumRequestDTO = {
    studentId: props.student.studentId,
    beginnDatum: new Date(`${beginnDatum.value}T00:00:00`),
    endDatum: new Date(`${endDatum.value}T00:00:00`),
    wochenarbeitszeit: praktikumWochenarbeitszeit.value,
    benoetigteWochen: benoetigteWochen.value,
  };

  if (praktikum.value) {
    await praktikumApi.updatePraktikum(props.student.studentId, request);
  } else {
    await praktikumApi.createPraktikum(request);
  }

  emit("updated");
  close();
}

async function saveStudiengaenge() {
  if (props.student?.studentId === undefined) {
    return;
  }

  const studiengangIds = studiengaenge.value
    .map((studiengang) => studiengang.studiengangId)
    .filter((id): id is number => id !== undefined);

  await studiengangApi.updateStudiengaengeByStudent(props.student.studentId, {
    studiengangIds: new Set(studiengangIds),
  });

  emit("updated");
  close();
}

function toDateInputValue(value: Date | undefined): string {
  if (!value) {
    return "";
  }

  return value.toISOString().slice(0, 10);
}

function resetPraktikumFields() {
  beginnDatum.value = "";
  endDatum.value = "";
  praktikumWochenarbeitszeit.value = 0;
  benoetigteWochen.value = 0;
}

function close() {
  dialog.value = false;
  editMode.value = "student";
}
</script>