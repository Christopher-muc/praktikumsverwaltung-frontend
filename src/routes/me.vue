<template>
  <StudentDetail
    v-if="student"
    :student="student"
    :praktikum="praktikum"
    :can-write-activity="true"
    :can-write-zeitgutschrift="canWriteZeitgutschrift"
    @changed="loadPraktikum"
  />
</template>

<script setup lang="ts">
import type {
  PraktikumResponseDTO,
  StudentResponseDTO,
} from "@/api/generated/api-spec/models";

import { onMounted, ref } from "vue";

import { ApiFactory } from "@/api/ApiFactory.ts";
import {
  PraktikumControllerApi,
  StudentControllerApi,
} from "@/api/generated/api-spec";
import StudentDetail from "@/components/student/StudentDetail.vue";
import useHasAnyRole from "@/composables/useHasAnyRole.ts";
import { Role } from "@/types/Role.ts";

/*
 * STUDENT und FACHSTUDENT dürfen /me öffnen.
 */
definePage({
  meta: {
    hasAnyRole: [
      Role.STUDENT,
      Role.FACHSTUDENT,
    ],
  },
});

/*
 * APIs
 */
const studentApi = ApiFactory.getInstance(
  StudentControllerApi,
);

const praktikumApi = ApiFactory.getInstance(
  PraktikumControllerApi,
);

/*
 * Berechtigungen
 *
 * STUDENT:
 *   Tätigkeiten schreiben: ja
 *   Zeitgutschriften schreiben: nein
 *
 * FACHSTUDENT:
 *   Tätigkeiten schreiben: ja
 *   Zeitgutschriften schreiben: ja
 */
const canWriteZeitgutschrift =
  useHasAnyRole(Role.FACHSTUDENT);

/*
 * State
 */
const student = ref<StudentResponseDTO>();

const praktikum = ref<PraktikumResponseDTO>();

/*
 * Eigenen Studentendatensatz laden.
 *
 * Die Student-ID kommt NICHT aus der URL.
 * Das Backend ermittelt den Studenten anhand des JWT.
 */
async function loadStudent() {
  student.value =
    await studentApi.getMyStudent();
}

/*
 * Praktikum des eigenen Studenten laden.
 */
async function loadPraktikum() {
  const studentId = student.value?.studentId;

  if (studentId === undefined) {
    return;
  }

  try {
    praktikum.value =
      await praktikumApi.getPraktikum(
        studentId,
      );
  } catch (e) {
    console.debug(
      "Kein Praktikum vorhanden:",
      studentId,
      e,
    );

    praktikum.value = undefined;
  }
}

/*
 * Erst Student laden, weil wir dessen ID
 * für das Praktikum benötigen.
 */
onMounted(async () => {
  await loadStudent();
  await loadPraktikum();
});
</script>