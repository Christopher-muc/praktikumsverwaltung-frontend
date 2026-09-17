<template>
  <div>
    <v-progress-linear
      v-if="loading"
      indeterminate
      class="mb-4"
    />

    <template v-else>
      <div class="text-h6 mb-2">Studiengänge</div>

      <v-list
        v-if="studiengaenge.length > 0"
        class="mb-4"
      >
        <template
          v-for="(studiengang, index) in studiengaenge"
          :key="studiengang.studiengangNr ?? index"
        >
          <v-list-item :title="studiengang.name">
            <template #append>
              <v-btn
                variant="text"
                size="small"
                @click="removeStudiengang(index)"
              >
                Löschen
              </v-btn>
            </template>
          </v-list-item>

          <v-divider v-if="index < studiengaenge.length - 1" />
        </template>
      </v-list>

      <v-alert
        v-else
        type="info"
        variant="tonal"
        class="mb-4"
      >
        Für diesen Studenten ist noch kein Studiengang hinterlegt.
      </v-alert>

      <div class="d-flex align-center ga-2 mt-4">
        <v-text-field
          v-model="newStudiengang"
          label="Studiengang"
          variant="outlined"
          hide-details
          @keyup.enter="addStudiengang"
        />

        <v-btn
          color="primary"
          variant="outlined"
          @click="addStudiengang"
        >
          Hinzufügen
        </v-btn>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Studiengang } from "@/api/generated/api-spec";

import { ref } from "vue";

defineProps<{
  loading: boolean;
}>();

const studiengaenge = defineModel<Studiengang[]>({
  required: true,
});

const newStudiengang = ref("");

function addStudiengang() {
  const name = newStudiengang.value.trim();

  if (!name) {
    return;
  }

  const alreadyExists = studiengaenge.value.some(
    (studiengang) => studiengang.name.toLowerCase() === name.toLowerCase()
  );

  if (alreadyExists) {
    return;
  }

  studiengaenge.value.push({
    name,
  });

  newStudiengang.value = "";
}

function removeStudiengang(index: number) {
  studiengaenge.value.splice(index, 1);
}
</script>
