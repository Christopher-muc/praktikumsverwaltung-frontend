<template>
  <v-card elevation="5">
    <v-card-title class="d-flex justify-space-between align-center">
      <span>Tätigkeitsblöcke</span>

      <v-btn
        v-if="canWrite"
        icon
        variant="text"
        size="small"
        :disabled="!selectedDate"
        @click="openCreateDialog"
      >
        +
      </v-btn>
    </v-card-title>

    <v-card-subtitle v-if="selectedDate">
      {{ toDateString(selectedDate) }}
    </v-card-subtitle>

    <v-list v-if="selectedTaetigkeiten.length">
      <template
        v-for="(taetigkeit, index) in selectedTaetigkeiten"
        :key="taetigkeit.taetigkeitenblockId ?? index"
      >
        <v-list-item>
          <div class="d-flex align-center">
            <div>
              {{ toDateString(taetigkeit.beginnDatum!) }}
              -
              {{ toDateString(taetigkeit.endDatum!) }}
            </div>

            <div class="flex-grow-1 text-center">
              {{ taetigkeit.beschreibung }}
            </div>

            <div v-if="taetigkeit.stundenanzahl !== undefined">
              {{ taetigkeit.stundenanzahl }} h
            </div>
          </div>

          <template
            v-if="canWrite"
            #append
          >
            <v-menu>
              <template #activator="{ props: menuProps }">
                <v-btn
                  v-bind="menuProps"
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
                  @click="openEditDialog(taetigkeit)"
                />

                <v-list-item
                  title="Löschen"
                  @click="deleteTaetigkeit(taetigkeit)"
                />
              </v-list>
            </v-menu>
          </template>
        </v-list-item>

        <v-divider v-if="index < selectedTaetigkeiten.length - 1" />
      </template>
    </v-list>

    <v-card-text
      v-else-if="selectedDate"
      class="text-medium-emphasis"
    >
      Keine Tätigkeitsblöcke hinterlegt.
    </v-card-text>

    <v-card-text
      v-else
      class="text-medium-emphasis"
    >
      Kein Datum ausgewählt.
    </v-card-text>

    <v-card-text
      v-if="error"
      class="text-error"
    >
      {{ error }}
    </v-card-text>
  </v-card>

  <CreateActivity
    v-model="createDialog"
    :student-id="studentId"
    :selected-date="selectedDate"
    @created="handleCreated"
  />

  <EditActivity
    v-model="editDialog"
    :activity="selectedTaetigkeit"
    @updated="handleUpdated"
  />
</template>

<script setup lang="ts">
import type {
  PraktikumResponseDTO,
  TaetigkeitenblockResponseDTO,
} from "@/api/generated/api-spec/models";

import { computed, ref } from "vue";

import { ApiFactory } from "@/api/ApiFactory";
import { TaetigkeitenblockControllerApi } from "@/api/generated/api-spec";
import { toDateString } from "@/util/formatter";
import CreateActivity from "./CreateActivity.vue";
import EditActivity from "./EditActivity.vue";

const props = defineProps<{
  studentId: number;
  praktikum?: PraktikumResponseDTO;
  selectedDate?: Date;
  canWrite: boolean;
}>();

const emit = defineEmits<{
  changed: [];
}>();

const taetigkeitenblockApi = ApiFactory.getInstance(
  TaetigkeitenblockControllerApi
);

const createDialog = ref(false);
const editDialog = ref(false);

const selectedTaetigkeit = ref<TaetigkeitenblockResponseDTO | null>(null);

const error = ref("");

const selectedTaetigkeiten = computed<TaetigkeitenblockResponseDTO[]>(() => {
  if (!props.praktikum || !props.selectedDate) {
    return [];
  }

  const selectedDate = props.selectedDate;

  return (
    props.praktikum.taetigkeitenbloecke?.filter((taetigkeit) => {
      if (!taetigkeit.beginnDatum || !taetigkeit.endDatum) {
        return false;
      }

      return (
        selectedDate >= taetigkeit.beginnDatum &&
        selectedDate <= taetigkeit.endDatum
      );
    }) ?? []
  );
});

function openCreateDialog() {
  if (!props.canWrite || !props.selectedDate) {
    return;
  }

  error.value = "";
  createDialog.value = true;
}

function openEditDialog(taetigkeit: TaetigkeitenblockResponseDTO) {
  if (!props.canWrite) {
    return;
  }

  error.value = "";
  selectedTaetigkeit.value = taetigkeit;
  editDialog.value = true;
}

async function deleteTaetigkeit(taetigkeit: TaetigkeitenblockResponseDTO) {
  if (!props.canWrite) {
    return;
  }

  if (taetigkeit.taetigkeitenblockId === undefined) {
    error.value = "Der Tätigkeitsblock besitzt keine ID.";
    return;
  }

  error.value = "";

  try {
    await taetigkeitenblockApi.deleteTaetigkeitenblock(
      taetigkeit.taetigkeitenblockId
    );

    emit("changed");
  } catch (e) {
    console.debug("Tätigkeitsblock konnte nicht gelöscht werden:", e);

    error.value = "Der Tätigkeitsblock konnte nicht gelöscht werden.";
  }
}

function handleCreated() {
  createDialog.value = false;
  emit("changed");
}

function handleUpdated() {
  editDialog.value = false;
  selectedTaetigkeit.value = null;
  emit("changed");
}
</script>
