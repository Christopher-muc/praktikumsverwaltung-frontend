<template>
  <v-card elevation="5">
    <v-card-title class="d-flex justify-space-between align-center">
      <span>Zeitgutschriften</span>

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

    <v-list v-if="selectedZeitgutschriften.length">
      <template
          v-for="(zeitgutschrift, index) in selectedZeitgutschriften"
          :key="zeitgutschrift.zeitgutschriftId ?? index"
      >
        <v-list-item>
          <div class="d-flex align-center">
            <div
                class="text-truncate"
                style="width: 50%"
            >
              {{ zeitgutschrift.grund }}
            </div>

            <div
                class="text-center"
                style="width: 50%"
            >
              {{ zeitgutschrift.minuten }} min
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
                    @click="openEditDialog(zeitgutschrift)"
                />

                <v-list-item
                    title="Löschen"
                    @click="deleteZeitgutschrift(zeitgutschrift)"
                />
              </v-list>
            </v-menu>
          </template>
        </v-list-item>

        <v-divider
            v-if="index < selectedZeitgutschriften.length - 1"
        />
      </template>
    </v-list>

    <v-card-text
        v-else-if="selectedDate"
        class="text-medium-emphasis"
    >
      Keine Zeitgutschriften hinterlegt.
    </v-card-text>

    <v-card-text
        v-else
        class="text-medium-emphasis"
    >
      Kein Datum ausgewählt.
    </v-card-text>

    <CreateTimeCreditDialog
        v-model="createDialog"
        :student-id="studentId"
        :selected-date="selectedDate"
        @created="handleCreated"
    />

    <EditTimeCreditDialog
        v-model="editDialog"
        :student-id="studentId"
        :zeitgutschrift="zeitgutschriftToEdit"
        @updated="handleUpdated"
    />
  </v-card>
</template>

<script setup lang="ts">
import type {
  PraktikumResponseDTO,
  ZeitgutschriftResponseDTO,
} from "@/api/generated/api-spec/models";

import { computed, ref } from "vue";

import { ApiFactory } from "@/api/ApiFactory";
import { ZeitgutschriftControllerApi } from "@/api/generated/api-spec";
import CreateTimeCreditDialog from "@/components/praktikum/CreateTimeCreditDialog.vue";
import EditTimeCreditDialog from "@/components/praktikum/EditTimeCreditDialog.vue";
import { toDateString } from "@/util/formatter";

const props = defineProps<{
  studentId: number;
  praktikum?: PraktikumResponseDTO;
  selectedDate?: Date;
  canWrite: boolean;
}>();

const emit = defineEmits<{
  changed: [];
}>();

const zeitgutschriftApi = ApiFactory.getInstance(
    ZeitgutschriftControllerApi,
);

const createDialog = ref(false);

const editDialog = ref(false);

const zeitgutschriftToEdit =
    ref<ZeitgutschriftResponseDTO>();

const selectedZeitgutschriften = computed<
    ZeitgutschriftResponseDTO[]
>(() => {
  if (!props.praktikum || !props.selectedDate) {
    return [];
  }

  const selectedDateKey = toDateKey(props.selectedDate);

  return (
      props.praktikum.zeitgutschriften?.filter(
          (zeitgutschrift) => {
            const datum = zeitgutschrift.datum;

            return (
                datum !== undefined &&
                toDateKey(datum) === selectedDateKey
            );
          },
      ) ?? []
  );
});

function openCreateDialog() {
  if (!props.canWrite || !props.selectedDate) {
    return;
  }

  createDialog.value = true;
}

function openEditDialog(
    zeitgutschrift: ZeitgutschriftResponseDTO,
) {
  if (!props.canWrite) {
    return;
  }

  zeitgutschriftToEdit.value = zeitgutschrift;

  editDialog.value = true;
}

async function deleteZeitgutschrift(
    zeitgutschrift: ZeitgutschriftResponseDTO,
) {
  if (!props.canWrite) {
    return;
  }

  if (zeitgutschrift.zeitgutschriftId === undefined) {
    console.debug(
        "Zeitgutschrift kann nicht gelöscht werden: ID fehlt.",
        zeitgutschrift,
    );

    return;
  }

  try {
    await zeitgutschriftApi.deleteZeitgutschrift(
        zeitgutschrift.zeitgutschriftId,
    );

    emit("changed");
  } catch (e) {
    console.debug(
        "Zeitgutschrift konnte nicht gelöscht werden:",
        e,
    );
  }
}

function handleCreated() {
  createDialog.value = false;

  emit("changed");
}

function handleUpdated() {
  editDialog.value = false;

  zeitgutschriftToEdit.value = undefined;

  emit("changed");
}

function toDateKey(date: Date): string {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(
      2,
      "0",
  );

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
</script>