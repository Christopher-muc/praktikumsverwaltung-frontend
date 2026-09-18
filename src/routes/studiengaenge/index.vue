<template>
  <v-container>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4">Studiengänge</h1>

        <div class="text-medium-emphasis">Übersicht aller Studiengänge</div>
      </div>
    </div>

    <v-progress-linear
      v-if="loading"
      indeterminate
      class="mb-4"
    />

    <div
      v-else-if="studiengaenge.length === 0"
      class="text-medium-emphasis"
    >
      Es sind keine Studiengänge hinterlegt.
    </div>

    <v-row v-else>
      <v-col
        v-for="studiengang in studiengaenge"
        :key="studiengang.studiengangId"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card
          variant="outlined"
          hover
          class="h-100"
          @click="openStudiengang(studiengang.studiengangId)"
        >
          <v-card-title>
            {{ studiengang.name }}
          </v-card-title>

          <v-card-actions>
            <v-spacer />

            <v-btn
              variant="text"
              append-icon="mdi-chevron-right"
            >
              Studenten anzeigen
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type { StudiengangResponseDTO } from "@/api/generated/api-spec/models";

import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import { ApiFactory } from "@/api/ApiFactory";
import { StudiengangControllerApi } from "@/api/generated/api-spec/apis";
import { Role } from "@/types/Role";

definePage({
  meta: {
    hasAnyRole: Role.ADMIN,
  },
});

const router = useRouter();

const api = ApiFactory.getInstance(StudiengangControllerApi);

const studiengaenge = ref<StudiengangResponseDTO[]>([]);
const loading = ref(false);

async function loadStudiengaenge() {
  loading.value = true;

  try {
    studiengaenge.value = await api.getStudiengaenge();
  } finally {
    loading.value = false;
  }
}

async function openStudiengang(studiengangId?: number) {
  if (studiengangId === undefined) {
    return;
  }

  await router.push(`/studiengaenge/${studiengangId}`);
}

onMounted(loadStudiengaenge);
</script>
