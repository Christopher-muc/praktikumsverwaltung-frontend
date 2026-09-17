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
        :key="`${taetigkeit.taetigkeitenblockID?.studentId}-${taetigkeit.taetigkeitenblockID?.tag}-${index}`"
      >
        <v-list-item>
          <div class="d-flex align-center">
            <div>
              {{ taetigkeit.taetigkeitenblockID?.beginnZeit }}
              -
              {{ taetigkeit.taetigkeitenblockID?.endeZeit }}
            </div>

            <div class="flex-grow-1 text-center">
              {{ taetigkeit.homeoffice ? "HO" : "Office" }}
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

        <v-divider
          v-if="index < selectedTaetigkeiten.length - 1"
        />
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
  </v-card>
</template>

<script setup lang="ts">
import type { FullPraktikumDTO } from "@/api/generated/api-spec";

import { computed } from "vue";

import { toDateString } from "@/util/formatter";

type Taetigkeit =
  NonNullable<FullPraktikumDTO["taetigkeiten"]>[number];

const props = defineProps<{
  studentId: number;
  praktikum?: FullPraktikumDTO;
  selectedDate?: Date;
  canWrite: boolean;
}>();

const emit = defineEmits<{
  changed: [];
}>();

const selectedTaetigkeiten = computed(() => {
  if (!props.praktikum || !props.selectedDate) {
    return [];
  }

  const selectedDateKey = toDateKey(props.selectedDate);

  return (
    props.praktikum.taetigkeiten?.filter((taetigkeit) => {
      const tag = taetigkeit.taetigkeitenblockID?.tag;

      return tag !== undefined && toDateKey(tag) === selectedDateKey;
    }) ?? []
  );
});

function openCreateDialog() {
  if (!props.canWrite || !props.selectedDate) {
    return;
  }

  /*
   * TODO:
   * CreateActivity.vue hier anbinden.
   */
  console.debug(
    "Tätigkeitsblock anlegen:",
    props.studentId,
    props.selectedDate,
  );
}

function openEditDialog(
  taetigkeit: Taetigkeit,
) {
  if (!props.canWrite) {
    return;
  }

  /*
   * TODO:
   * EditActivity.vue hier anbinden.
   */
  console.debug(
    "Tätigkeitsblock bearbeiten:",
    taetigkeit,
  );
}

function deleteTaetigkeit(
  taetigkeit: Taetigkeit,
) {
  if (!props.canWrite) {
    return;
  }

  /*
   * TODO:
   * TaetigkeitenblockControllerApi anbinden.
   */
  console.debug(
    "Tätigkeitsblock löschen:",
    taetigkeit,
  );

  /*
   * Nach erfolgreichem DELETE:
   *
   * emit("changed");
   */
}

function toDateKey(date: Date): string {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
</script>