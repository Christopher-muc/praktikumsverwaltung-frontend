<template>
  <v-container>
    <!-- Überschrift -->
    <div class="d-flex justify-space-between align-center mb-4">
      <h1 class="text-h4">Studenten</h1>

      <v-btn
        v-if="canWrite"
        variant="outlined"
        @click="createDialog = true"
      >
        Student hinzufügen
      </v-btn>
    </div>

    <!-- Studentenliste -->
    <v-list>
      <template
        v-for="(student, index) in filteredStudents"
        :key="student.studentId"
      >
        <v-list-item
          :title="`${student.vorname} ${student.nachname}`"
          :to="`/student/${student.studentId}`"
        >
          <!-- Aktionen nur für WRITER -->
          <template
            v-if="canWrite"
            #append
          >
            <v-menu>
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  variant="text"
                  size="small"
                  @click.prevent.stop
                >
                  ⋮
                </v-btn>
              </template>

              <v-list>
                <v-list-item
                  title="Bearbeiten"
                  @click="openEditDialog(student)"
                />

                <v-list-item
                  title="Löschen"
                  @click="openDeleteDialog(student)"
                />
              </v-list>
            </v-menu>
          </template>
        </v-list-item>

        <v-divider v-if="index < filteredStudents.length - 1" />
      </template>
    </v-list>

    <!-- Keine Studenten gefunden -->
    <div
      v-if="filteredStudents.length === 0"
      class="text-medium-emphasis pa-4"
    >
      Keine Studenten gefunden.
    </div>

    <!-- Dialoge -->
    <StudentCreateDialog
      v-model="createDialog"
      @created="loadStudents"
    />

    <StudentEditDialog
      v-model="editDialog"
      :student="selectedStudent"
      @updated="loadStudents"
    />

    <StudentDeleteDialog
      v-model="deleteDialog"
      :student="selectedStudent"
      @deleted="loadStudents"
    />
  </v-container>
</template>

<script setup lang="ts">
import type { SimpleStudentDTO } from "@/api/generated/api-spec";

import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import { ApiFactory } from "@/api/ApiFactory";
import { StudentControllerApi } from "@/api/generated/api-spec";
import StudentCreateDialog from "@/components/student/StudentCreateDialog.vue";
import StudentDeleteDialog from "@/components/student/StudentDeleteDialog.vue";
import StudentEditDialog from "@/components/student/StudentEditDialog.vue";
import useHasAnyRole from "@/composables/useHasAnyRole";
import { Role } from "@/types/Role";

const route = useRoute();

/*
 * Rollen
 */
const canWrite = useHasAnyRole(Role.WRITER);

/*
 * API
 */
const studentApi = ApiFactory.getInstance(StudentControllerApi);

/*
 * Studentenliste
 */
const students = ref<SimpleStudentDTO[]>([]);

async function loadStudents() {
  students.value = await studentApi.getAllStudents();
}

onMounted(async () => {
  await loadStudents();
});

/*
 * Suche
 */
const filteredStudents = computed(() => {
  const search = String(route.query.search ?? "")
    .trim()
    .toLowerCase();

  if (!search) {
    return students.value;
  }

  return students.value.filter((student) => {
    const fullName = `${student.vorname} ${student.nachname}`.toLowerCase();

    return fullName.includes(search);
  });
});

/*
 * Dialoge
 */
const createDialog = ref(false);
const editDialog = ref(false);
const deleteDialog = ref(false);

const selectedStudent = ref<SimpleStudentDTO | null>(null);

function openEditDialog(student: SimpleStudentDTO) {
  selectedStudent.value = student;
  editDialog.value = true;
}

function openDeleteDialog(student: SimpleStudentDTO) {
  selectedStudent.value = student;
  deleteDialog.value = true;
}
</script>
