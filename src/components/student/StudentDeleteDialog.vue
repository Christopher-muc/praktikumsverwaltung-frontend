<template>
  <v-dialog
    v-model="dialog"
    max-width="500"
    persistent
  >
    <v-card rounded="xl">
      <v-card-title class="pa-6 pb-2"> Student löschen </v-card-title>

      <v-card-text class="pa-6">
        Möchtest du
        <strong>
          {{ student?.vorname }}
          {{ student?.nachname }}
        </strong>
        wirklich löschen?

        <div
          v-if="error"
          class="text-error mt-4"
        >
          {{ error }}
        </div>

        <div class="d-flex justify-end ga-2 mt-6">
          <v-btn
            variant="text"
            :disabled="deleting"
            @click="close"
          >
            Abbrechen
          </v-btn>

          <v-btn
            color="error"
            :loading="deleting"
            @click="deleteStudent"
          >
            Löschen
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { StudentResponseDTO } from "@/api/generated/api-spec/models";

import { ref } from "vue";

import { ApiFactory } from "@/api/ApiFactory";
import { StudentControllerApi } from "@/api/generated/api-spec";

const dialog = defineModel<boolean>({
  default: false,
});

const props = defineProps<{
  student: StudentResponseDTO | null;
}>();

const emit = defineEmits<{
  deleted: [];
}>();

const studentApi = ApiFactory.getInstance(StudentControllerApi);

const deleting = ref(false);
const error = ref("");

async function deleteStudent() {
  error.value = "";

  if (props.student?.studentId === undefined) {
    error.value = "Der Student besitzt keine ID.";
    return;
  }

  deleting.value = true;

  try {
    await studentApi.deleteStudent(props.student.studentId);

    emit("deleted");

    close();
  } catch (e) {
    console.debug("Student konnte nicht gelöscht werden:", e);

    error.value = "Der Student konnte nicht gelöscht werden.";
  } finally {
    deleting.value = false;
  }
}

function close() {
  dialog.value = false;
  error.value = "";
}
</script>
