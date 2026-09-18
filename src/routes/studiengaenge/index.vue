<template>
  <v-container>
    <!-- Überschrift -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4">Studiengänge</h1>

        <div class="text-medium-emphasis">Übersicht aller Studiengänge</div>
      </div>

      <v-btn
        color="primary"
        variant="outlined"
        @click="createDialog = true"
      >
        Studiengang hinzufügen
      </v-btn>
    </div>

    <!-- Laden -->
    <v-progress-linear
      v-if="loading"
      indeterminate
      class="mb-4"
    />

    <!-- Keine Studiengänge -->
    <div
      v-else-if="studiengaenge.length === 0"
      class="text-medium-emphasis"
    >
      Es sind keine Studiengänge hinterlegt.
    </div>

    <!-- Studiengänge -->
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
        >
          <!-- Kopfzeile -->
          <div class="d-flex align-center pa-4">
            <div class="text-h6">
              {{ studiengang.name }}
            </div>

            <v-spacer />

            <!-- Löschen -->
            <v-btn
              color="error"
              variant="outlined"
              size="small"
              :loading="deletingId === studiengang.studiengangId"
              @click="deleteStudiengang(studiengang)"
            >
              ×
            </v-btn>
          </div>

          <v-divider />

          <!-- Studenten -->
          <v-card-actions class="pa-4">
            <v-spacer />

            <v-btn
              variant="text"
              append-icon="mdi-chevron-right"
              @click="openStudiengang(studiengang.studiengangId)"
            >
              Studenten anzeigen
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Studiengang erstellen -->
    <CreateStudiengang
      v-model="createDialog"
      @created="loadStudiengaenge"
    />
  </v-container>
</template>

<script setup lang="ts">
import type { StudiengangResponseDTO } from "@/api/generated/api-spec/models";

import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import { ApiFactory } from "@/api/ApiFactory";
import { StudiengangControllerApi } from "@/api/generated/api-spec/apis";
import CreateStudiengang from "@/components/studiengang/CreateStudiengang.vue";
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
const createDialog = ref(false);
const deletingId = ref<number>();

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

async function deleteStudiengang(studiengang: StudiengangResponseDTO) {
  if (studiengang.studiengangId === undefined) {
    return;
  }

  deletingId.value = studiengang.studiengangId;

  try {
    await api.deleteStudiengang(studiengang.studiengangId);

    await loadStudiengaenge();
  } catch (e) {
    console.debug("Studiengang konnte nicht gelöscht werden:", e);
  } finally {
    deletingId.value = undefined;
  }
}

onMounted(loadStudiengaenge);
</script>
