<template>
  <v-card
    :title="`${student.vorname} ${student.nachname}`"
    elevation="5"
  >
    <v-row>
      <!-- Praktikum -->
      <v-col cols="6">
        <v-card-text>
          <template v-if="praktikum">
            Praktikumsstart:
            {{
              praktikum.beginnDatum ? toDateString(praktikum.beginnDatum) : "-"
            }}

            <br />

            Praktikumsende:
            {{ praktikum.endeDatum ? toDateString(praktikum.endeDatum) : "-" }}

            <br />

            Benötigte Wochen:
            {{ praktikum.benoetigteWochen ?? "-" }}

            <br />

            Wochenarbeitszeit:
            {{ praktikum.wochenarbeitszeit ?? "-" }}
          </template>

          <div
            v-else
            class="text-medium-emphasis py-4"
          >
            Kein Praktikum hinterlegt.
          </div>
        </v-card-text>
      </v-col>

      <!-- Studiengänge -->
      <v-col
        cols="6"
        class="border-s"
      >
        <v-card-text>
          <div class="text-h6 mb-2">Studiengänge</div>

          <v-list
            v-if="student.studiengaenge?.length"
            density="compact"
          >
            <v-list-item
              v-for="studiengang in student.studiengaenge"
              :key="studiengang.studiengangNr"
              :title="studiengang.name"
            />
          </v-list>

          <div
            v-else
            class="text-medium-emphasis py-4"
          >
            Keine Studiengänge hinterlegt.
          </div>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import type { FullPraktikumDTO, StudentDTO } from "@/api/generated/api-spec";

import { toDateString } from "@/util/formatter";

defineProps<{
  student: StudentDTO;
  praktikum?: FullPraktikumDTO;
}>();
</script>
