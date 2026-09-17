<template>
  <div class="ma-12">
    <!-- Stammdaten -->
    <student-overview
      v-if="student"
      :student="student"
      :praktikum="praktikum"
    />

    <!-- Praktikum -->
    <v-row class="mt-4">
      <!-- Kalender -->
      <v-col cols="4">
        <praktikum-calendar
          v-model="selectedDate"
          :praktikum="praktikum"
        />
      </v-col>

      <!-- Zeitgutschriften -->
      <v-col cols="4">
        <time-credit-list
          :student-id="studentId"
          :praktikum="praktikum"
          :selected-date="selectedDate"
          :can-write="canWriteZeitgutschrift"
          @changed="loadPraktikum"
        />
      </v-col>

      <!-- Tätigkeitsblöcke -->
      <v-col cols="4">
        <activity-list
          :student-id="studentId"
          :praktikum="praktikum"
          :selected-date="selectedDate"
          :can-write="canWrite"
          @changed="loadPraktikum"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { FullPraktikumDTO, StudentDTO } from "@/api/generated/api-spec";

import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import { ApiFactory } from "@/api/ApiFactory";
import {
  PraktikumControllerApi,
  StudentControllerApi,
} from "@/api/generated/api-spec";
import ActivityList from "@/components/praktikum/ActivityList.vue";
import PraktikumCalendar from "@/components/praktikum/PraktikumCalendar.vue";
import TimeCreditList from "@/components/praktikum/TimeCreditList.vue";
import StudentOverview from "@/components/student/StudentOverview.vue";
import useHasAnyRole from "@/composables/useHasAnyRole";
import { Role } from "@/types/Role";

/*
 * Route
 */
const route = useRoute("/student/[id]");

const studentId = Number(route.params.id);

/*
 * APIs
 */
const studentApi = ApiFactory.getInstance(StudentControllerApi);

const praktikumApi = ApiFactory.getInstance(PraktikumControllerApi);

/*
 * Berechtigungen
 */
const canWrite = useHasAnyRole(Role.WRITER);

const canWriteZeitgutschrift = useHasAnyRole([
  Role.ZEITGUTSCHRIFT_WRITER,
  Role.WRITER,
]);

/*
 * State
 */
const student = ref<StudentDTO>();

const praktikum = ref<FullPraktikumDTO>();

const selectedDate = ref<Date>();

/*
 * Student laden
 */
async function loadStudent() {
  student.value = await studentApi.getStudent(studentId);
}

/*
 * Praktikum laden
 */
async function loadPraktikum() {
  try {
    const loadedPraktikum = await praktikumApi.getPraktikum(studentId);

    praktikum.value = loadedPraktikum;

    /*
     * Nur beim ersten Laden automatisch
     * den Praktikumsbeginn auswählen.
     */
    if (!selectedDate.value && loadedPraktikum.beginnDatum) {
      selectedDate.value = loadedPraktikum.beginnDatum;
    }
  } catch (error) {
    console.debug("Kein Praktikum vorhanden:", studentId, error);

    praktikum.value = undefined;

    selectedDate.value = undefined;
  }
}

/*
 * Initialisierung
 */
onMounted(async () => {
  await Promise.all([loadStudent(), loadPraktikum()]);
});
</script>
