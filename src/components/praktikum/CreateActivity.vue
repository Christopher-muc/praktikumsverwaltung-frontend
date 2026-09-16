<template>
  <v-dialog
    v-model="dialog"
    max-width="500"
    persistent
  >
    <v-card rounded="xl">
      <v-card-title class="pa-6 pb-2">
        Tätigkeitsblock hinzufügen
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form @submit.prevent="save">
          <v-text-field
            :model-value="formattedDate"
            label="Tag"
            type="date"
            variant="outlined"
            readonly
            class="mb-2"
          />

          <v-text-field
            v-model="beginnZeit"
            label="Beginn"
            type="time"
            variant="outlined"
            class="mb-2"
          />

          <v-text-field
            v-model="endeZeit"
            label="Ende"
            type="time"
            variant="outlined"
            class="mb-2"
          />

          <v-switch
            v-model="homeoffice"
            label="Homeoffice"
            color="primary"
            hide-details
          />

          <v-alert
            v-if="timeError"
            type="error"
            variant="tonal"
            class="mt-4"
          >
            {{ timeError }}
          </v-alert>

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
              type="submit"
              :loading="saving"
            >
              Hinzufügen
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

/*
 * Dialog
 */
const dialog = defineModel<boolean>({
  default: false,
});

/*
 * Props
 *
 * Student und ausgewählter Kalendertag
 * kommen aus student/[id].vue.
 */
const props = defineProps<{
  studentId: number;
  selectedDate?: Date;
}>();

/*
 * Events
 */
const emit = defineEmits<{
  created: [];
}>();

/*
 * Formulardaten
 */
const beginnZeit = ref("");
const endeZeit = ref("");
const homeoffice = ref(false);

/*
 * Status
 */
const saving = ref(false);
const timeError = ref("");

/*
 * Datum für <input type="date">
 */
const formattedDate = computed(() => {
  if (!props.selectedDate) {
    return "";
  }

  return toDateKey(props.selectedDate);
});

/*
 * Tätigkeitsblock speichern
 */
async function save() {
  timeError.value = "";

  if (!props.selectedDate) {
    return;
  }

  /*
   * Zeit validieren.
   */
  if (
    beginnZeit.value &&
    endeZeit.value &&
    endeZeit.value <= beginnZeit.value
  ) {
    timeError.value = "Das Ende muss nach dem Beginn liegen.";
    return;
  }

  saving.value = true;

  try {
    /*
     * Später kommt hier der Backend-Aufruf hinein.
     */
    const activityData = {
      studentId: props.studentId,
      tag: props.selectedDate,
      beginnZeit: beginnZeit.value,
      endeZeit: endeZeit.value,
      homeoffice: homeoffice.value,
    };

    console.debug("Tätigkeitsblock erstellen:", activityData);

    /*
     * Später z. B.:
     *
     * await taetigkeitApi.createTaetigkeit(...)
     */

    emit("created");
    close();
  } finally {
    saving.value = false;
  }
}

/*
 * Date -> YYYY-MM-DD
 */
function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/*
 * Dialog schließen
 */
function close() {
  dialog.value = false;
  resetForm();
}

/*
 * Formular zurücksetzen
 */
function resetForm() {
  beginnZeit.value = "";
  endeZeit.value = "";
  homeoffice.value = false;
  timeError.value = "";
}
</script>