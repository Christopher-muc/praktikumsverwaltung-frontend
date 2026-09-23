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
            v-model="beginnZeit"
            label="Beginn"
            type="time"
            variant="outlined"
            :error-messages="validationStore.getFieldErrors('beginnZeit')"
            class="mb-2"
          />

          <v-text-field
            v-model="endeZeit"
            label="Ende"
            type="time"
            variant="outlined"
            :error-messages="validationStore.getFieldErrors('endeZeit')"
            class="mb-2"
          />

          <v-switch
            v-model="homeoffice"
            label="Homeoffice"
            color="primary"
            :error-messages="validationStore.getFieldErrors('homeoffice')"
          />

          <div class="d-flex justify-end ga-2 mt-6">
            <v-btn
              variant="text"
              @click="close"
            >
              Abbrechen
            </v-btn>

            <v-btn
              color="primary"
              type="submit"
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
import type { TaetigkeitenblockCreationDTO } from "@/api/generated/api-spec/models";

import { ref, watch } from "vue";

import { ApiFactory } from "@/api/ApiFactory";
import { TaetigkeitenblockControllerApi } from "@/api/generated/api-spec/apis";
import { useValidationStore } from "@/stores/validation";

const dialog = defineModel<boolean>({
  default: false,
});

const props = defineProps<{
  studentId: number;
  activity: TaetigkeitenblockCreationDTO | null;
}>();

const emit = defineEmits<{
  updated: [];
}>();

const taetigkeitenblockApi = ApiFactory.getInstance(
  TaetigkeitenblockControllerApi
);

const validationStore = useValidationStore();

const beginnZeit = ref("");
const endeZeit = ref("");
const homeoffice = ref(false);

watch(
  () => props.activity,
  (activity) => {
    if (!activity) {
      return;
    }

    beginnZeit.value = activity.beginnZeit ?? "";
    endeZeit.value = activity.endeZeit ?? "";
    homeoffice.value = activity.homeoffice ?? false;
  },
  {
    immediate: true,
  }
);

async function save() {
  if (
    !props.activity ||
    props.activity.studentId === undefined ||
    props.activity.tag === undefined ||
    props.activity.beginnZeit === undefined ||
    props.activity.endeZeit === undefined
  ) {
    return;
  }

  const request: TaetigkeitenblockCreationDTO = {
    studentId: props.studentId,
    tag: props.activity.tag,
    beginnZeit: beginnZeit.value,
    endeZeit: endeZeit.value,
    homeoffice: homeoffice.value,
  };

  await taetigkeitenblockApi.updateTaetigkeitenblock(
    props.activity.studentId,
    props.activity.beginnZeit,
    props.activity.endeZeit,
    props.activity.tag,
    request
  );

  emit("updated");
  close();
}

function close() {
  dialog.value = false;
}
</script>
