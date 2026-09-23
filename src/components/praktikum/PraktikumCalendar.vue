<template>
  <v-card elevation="5">
    <v-card-title>
      {{ t("domain.praktikum.calendar") }}
    </v-card-title>

    <v-date-picker
      v-if="praktikum"
      v-model="selectedDate"
      :min="praktikum.beginnDatum"
      :max="praktikum.endeDatum"
      :events="calendarEvents"
      width="100%"
    />

    <v-card-text
      v-else
      class="text-medium-emphasis"
    >
      Kein Praktikum hinterlegt.
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { FullPraktikumDTO } from "@/api/generated/api-spec/models";

import { useI18n } from "vue-i18n";

const { t } = useI18n();

const selectedDate = defineModel<Date>();

const props = defineProps<{
  praktikum?: FullPraktikumDTO;
}>();

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function calendarEvents(date: string): string[] | false {
  if (!props.praktikum) {
    return false;
  }

  const colors: string[] = [];

  const hasTaetigkeit =
    props.praktikum.taetigkeiten?.some((taetigkeit) => {
      const tag = taetigkeit.taetigkeitenblockID?.tag;

      if (!tag) {
        return false;
      }

      return toDateKey(tag) === date;
    }) ?? false;

  const hasZeitgutschrift =
    props.praktikum.zeitgutschriften?.some((zeitgutschrift) => {
      if (!zeitgutschrift.tag) {
        return false;
      }

      return toDateKey(zeitgutschrift.tag) === date;
    }) ?? false;

  if (hasTaetigkeit) {
    colors.push("black");
  }

  if (hasZeitgutschrift) {
    colors.push("yellow");
  }

  return colors.length > 0 ? colors : false;
}
</script>
