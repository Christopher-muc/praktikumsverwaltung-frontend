<template>
  <div class="ma-12">
    <!-- Stammdaten -->
    <StudentOverview
      :student="student"
      :praktikum="praktikum"
    />

    <!-- Praktikum -->
    <v-row class="mt-4">
      <!-- Kalender -->
      <v-col cols="4">
        <PraktikumCalendar
          v-model="selectedDate"
          :praktikum="praktikum"
        />
      </v-col>

      <!-- Zeitgutschriften -->
      <v-col cols="4">
        <TimeCreditList
          :student-id="student.studentId!"
          :praktikum="praktikum"
          :selected-date="selectedDate"
          :can-write="canWriteZeitgutschrift"
          @changed="emit('changed')"
        />
      </v-col>

      <!-- Tätigkeitsblöcke -->
      <v-col cols="4">
        <ActivityList
          :student-id="student.studentId!"
          :praktikum="praktikum"
          :selected-date="selectedDate"
          :can-write="canWriteActivity"
          @changed="emit('changed')"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type {
  PraktikumResponseDTO,
  StudentResponseDTO,
} from "@/api/generated/api-spec/models";

import { ref, watch } from "vue";

import ActivityList from "@/components/praktikum/ActivityList.vue";
import PraktikumCalendar from "@/components/praktikum/PraktikumCalendar.vue";
import TimeCreditList from "@/components/praktikum/TimeCreditList.vue";
import StudentOverview from "@/components/student/StudentOverview.vue";

const props = defineProps<{
  student: StudentResponseDTO;
  praktikum?: PraktikumResponseDTO;
  canWriteActivity: boolean;
  canWriteZeitgutschrift: boolean;
}>();

const emit = defineEmits<{
  changed: [];
}>();

const selectedDate = ref<Date>();

/*
 * Wenn das Praktikum geladen wird,
 * automatisch den Praktikumsbeginn auswählen.
 */
watch(
  () => props.praktikum,
  (praktikum) => {
    if (!selectedDate.value && praktikum?.beginnDatum) {
      selectedDate.value = praktikum.beginnDatum;
    }

    if (!praktikum) {
      selectedDate.value = undefined;
    }
  },
  {
    immediate: true,
  }
);
</script>
