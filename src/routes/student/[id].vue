<template>
  <v-container>
    <!-- Student -->
    <div class="mb-6">
      <h1 class="text-h4">Praktikumsübersicht</h1>

      <div
        v-if="student"
        class="text-medium-emphasis"
      >
        {{ student.vorname }} {{ student.nachname }} {{student.studiengaenge}}
      </div>
    </div>

    <!-- Praktikum -->
    <div v-if="praktikum">
      <div class="mb-6">
        <h2 class="text-h5 mb-3">Praktikum</h2>

        <div>
          Beginn:
          {{ praktikum.beginnDatum }}
        </div>

        <div>
          Ende:
          {{ praktikum.endeDatum }}
        </div>

        <div>
          Wochenarbeitszeit:
          {{ praktikum.wochenarbeitszeit }} Stunden
        </div>

        <div>
          Benötigte Wochen:
          {{ praktikum.benoetigteWochen }}
        </div>
      </div>

      <v-divider class="my-6" />

      <!-- Tätigkeitsblöcke -->
      <activity-block-list :student-id="studentId" />

      <v-divider class="my-6" />

      <!-- Zeitgutschriften -->
      <time-credit-list :student-id="studentId" />
    </div>

    <div
      v-else
      class="text-medium-emphasis"
    >
      Kein Praktikum vorhanden.
    </div>
  </v-container>
</template>

<script setup lang="ts">
import type { PraktikumDTO, StudentDTO } from "@/api/generated/api-spec";

import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import { ApiFactory } from "@/api/ApiFactory";
import {
  PraktikumControllerApi,
  StudentControllerApi,
} from "@/api/generated/api-spec";
import ActivityBlockList from "@/components/praktikum/ActivityBlockList.vue";
import TimeCreditList from "@/components/praktikum/TimeCreditList.vue";

/*
 * Route /student/{id}
 */
const route = useRoute("/student/[id]");
const studentId = Number(route.params.id);

/*
 * APIs
 */
const studentApi = ApiFactory.getInstance(StudentControllerApi);
const praktikumApi = ApiFactory.getInstance(PraktikumControllerApi);

/*
 * Daten
 */
const student = ref<StudentDTO>();
const praktikum = ref<PraktikumDTO>();

/*
 * Student laden
 */
async function loadStudent() {
  student.value = await studentApi.getStudent(studentId);
}

/*
 * Praktikum laden
 *
 * Student und Praktikum haben eine 1:1-Beziehung.
 * Das Praktikum wird deshalb über die Student-ID geladen.
 */
async function loadPraktikum() {
  praktikum.value = await praktikumApi.getPraktikum(studentId);
}

/*
 * Seite laden
 */
onMounted(async () => {
  await Promise.all([loadStudent(), loadPraktikum()]);
});
</script>
