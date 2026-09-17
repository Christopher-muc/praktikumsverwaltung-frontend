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
        :key="zeitgutschrift.id"
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
              {{ zeitgutschrift.mengeMinuten }} min
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

    <create-time-credit-dialog
      v-model="createDialog"
      :student-id="studentId"
      :selected-date="selectedDate"
      @created="emit('changed')"
    />

    <edit-time-credit-dialog
      v-model="editDialog"
      :student-id="studentId"
      :zeitgutschrift="zeitgutschriftToEdit"
      @updated="emit('changed')"
    />
  </v-card>
</template>

<script setup lang="ts">
import type { FullPraktikumDTO } from "@/api/generated/api-spec";

import { computed, ref } from "vue";

import { ApiFactory } from "@/api/ApiFactory";
import { ZeitgutschriftControllerApi } from "@/api/generated/api-spec";
import CreateTimeCreditDialog from "@/components/praktikum/CreateTimeCreditDialog.vue";
import EditTimeCreditDialog from "@/components/praktikum/EditTimeCreditDialog.vue";
import { toDateString } from "@/util/formatter";

type Zeitgutschrift =
  NonNullable<FullPraktikumDTO["zeitgutschriften"]>[number];

const props = defineProps<{
  studentId: number;
  praktikum?: FullPraktikumDTO;
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

const zeitgutschriftToEdit = ref<Zeitgutschrift>();

const selectedZeitgutschriften = computed(() => {
  if (!props.praktikum || !props.selectedDate) {
    return [];
  }

  const selectedDateKey = toDateKey(props.selectedDate);

  return (
    props.praktikum.zeitgutschriften?.filter((zeitgutschrift) => {
      const tag = zeitgutschrift.tag;

      return tag !== undefined && toDateKey(tag) === selectedDateKey;
    }) ?? []
  );
});

function openCreateDialog() {
  if (!props.canWrite || !props.selectedDate) {
    return;
  }

  createDialog.value = true;
}

function openEditDialog(
  zeitgutschrift: Zeitgutschrift,
) {
  if (!props.canWrite) {
    return;
  }

  zeitgutschriftToEdit.value = zeitgutschrift;

  editDialog.value = true;
}

async function deleteZeitgutschrift(
  zeitgutschrift: Zeitgutschrift,
) {
  if (!props.canWrite) {
    return;
  }

  if (zeitgutschrift.id === undefined) {
    console.error(
      "Zeitgutschrift kann nicht gelöscht werden: ID fehlt.",
      zeitgutschrift,
    );

    return;
  }

  await zeitgutschriftApi.deleteZeitgutschrift(
    zeitgutschrift.id,
  );

  emit("changed");
}

function toDateKey(date: Date): string {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
</script>