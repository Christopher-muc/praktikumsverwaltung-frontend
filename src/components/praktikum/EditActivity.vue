<template>
  <v-dialog
    v-model="dialog"
    max-width="500"
    persistent
  >
    <v-card rounded="xl">
      <v-card-title class="pa-6 pb-2">
        Tätigkeitsblock bearbeiten
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form @submit.prevent="save">
          <v-text-field
            v-model="tag"
            label="Tag"
            type="date"
            variant="outlined"
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
              Speichern
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

/*
 * Temporärer GUI-Typ.
 *
 * Kann später durch den generierten DTO-Typ
 * aus der OpenAPI ersetzt werden.
 */
interface Activity {
  studentId?: number;
  tag?: Date;
  beginnZeit?: string;
  endeZeit?: string;
  homeoffice?: boolean;
}

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
  activity: Activity | null;
}>();

/*
 * Events
 */
const emit = defineEmits<{
  updated: [];
}>();

/*
 * Formulardaten
 */
const tag = ref("");
const beginnZeit = ref("");
const endeZeit = ref("");
const homeoffice = ref(false);

/*
 * Status
 */
const saving = ref(false);
const timeError = ref("");

/*
 * Sobald eine Tätigkeit zum Bearbeiten
 * übergeben wird, Formular befüllen.
 */
watch(
  () => props.activity,
  (activity) => {
    if (!activity) {
      return;
    }

    tag.value = activity.tag
      ? toDateKey(activity.tag)
      : "";

    beginnZeit.value = activity.beginnZeit ?? "";
    endeZeit.value = activity.endeZeit ?? "";
    homeoffice.value = activity.homeoffice ?? false;

    timeError.value = "";
  },
  {
    immediate: true,
  }
);

/*
 * Änderungen speichern
 */
async function save() {
  timeError.value = "";

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
     * Später Backend-Aufruf einsetzen.
     */
    const activityData = {
      studentId: props.activity?.studentId,
      tag: tag.value
        ? new Date(`${tag.value}T00:00:00`)
        : undefined,
      beginnZeit: beginnZeit.value,
      endeZeit: endeZeit.value,
      homeoffice: homeoffice.value,
    };

    console.debug("Tätigkeitsblock aktualisieren:", activityData);

    /*
     * Später z. B.:
     *
     * await taetigkeitApi.updateTaetigkeit(...)
     */

    emit("updated");
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
  timeError.value = "";
}
</script>