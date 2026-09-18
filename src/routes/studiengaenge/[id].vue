<template>
  <v-container>
    <div class="d-flex align-center mb-6">
      <v-btn
        icon="mdi-arrow-left"
        variant="text"
        to="/studiengaenge"
        class="mr-2"
      />

      <div>
        <h1 class="text-h4">
          {{ studiengang?.name ?? "Studiengang" }}
        </h1>

        <div class="text-medium-emphasis">Studenten</div>
      </div>
    </div>

    <v-progress-linear
      v-if="loading"
      indeterminate
      class="mb-4"
    />

    <div
      v-else-if="students.length === 0"
      class="text-medium-emphasis"
    >
      Für diesen Studiengang sind keine Studenten hinterlegt.
    </div>

    <v-row v-else>
      <v-col
        v-for="student in students"
        :key="student.studentId"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card
          variant="outlined"
          hover
          class="h-100"
          @click="openStudent(student.studentId)"
        >
          <v-card-title>
            {{ student.vorname }}
            {{ student.nachname }}
          </v-card-title>

          <v-card-text>
            <div>
              {{ student.email }}
            </div>

            <div
              v-if="student.wochenarbeitszeit"
              class="text-medium-emphasis mt-1"
            >
              {{ student.wochenarbeitszeit }} Stunden / Woche
            </div>
          </v-card-text>

          <v-card-actions>
            <v-spacer />

            <v-btn
              variant="text"
              append-icon="mdi-chevron-right"
            >
              Öffnen
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type {
  StudentResponseDTO,
  StudiengangResponseDTO,
} from "@/api/generated/api-spec/models";

import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { ApiFactory } from "@/api/ApiFactory";
import { StudiengangControllerApi } from "@/api/generated/api-spec/apis";
import { Role } from "@/types/Role";

definePage({
  meta: {
    hasAnyRole: Role.ADMIN,
  },
});

const route = useRoute("/studiengaenge/[id]");
const router = useRouter();

const api = ApiFactory.getInstance(StudiengangControllerApi);

const students = ref<StudentResponseDTO[]>([]);
const studiengang = ref<StudiengangResponseDTO>();
const loading = ref(false);

const studiengangId = Number(route.params.id);

async function loadStudiengang() {
  if (!Number.isInteger(studiengangId) || studiengangId <= 0) {
    return;
  }

  loading.value = true;

  try {
    const [loadedStudiengang, loadedStudents] = await Promise.all([
      api.getStudiengang(studiengangId),
      api.getStudentenByStudiengang(studiengangId),
    ]);

    studiengang.value = loadedStudiengang;
    students.value = loadedStudents;
  } finally {
    loading.value = false;
  }
}

async function openStudent(studentId?: number) {
  if (studentId === undefined) {
    return;
  }

  await router.push(`/students/${studentId}`);
}

onMounted(loadStudiengang);
</script>
