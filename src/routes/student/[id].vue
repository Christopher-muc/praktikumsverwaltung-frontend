<template>
  <v-container>
    <!-- Überschrift -->
    <div class="mb-6">
      <h1 class="text-h4">
        Praktikumsübersicht
      </h1>
    </div>

    <div class="d-flex">
      <!-- ============================================ -->
      <!-- LINKE SEITE: Kalendertage                   -->
      <!-- ============================================ -->

      <div class="day-list">
        <h3 class="text-h6 mb-3">
          Kalendertage
        </h3>

        <v-list
            v-model:selected="selectedDay"
            selectable
            nav
        >
          <v-list-item
              v-for="day in days"
              :key="day.date"
              :value="day.date"
              :title="day.label"
          />
        </v-list>
      </div>

      <!-- Vertikale Trennlinie -->
      <v-divider
          vertical
          class="border-opacity-100 mx-6"
      />

      <!-- ============================================ -->
      <!-- RECHTE SEITE                                -->
      <!-- ============================================ -->

      <div class="flex-grow-1">
        <!-- Ausgewählter Tag -->
        <h2 class="text-h5 mb-6">
          {{ selectedDayLabel }}
        </h2>

        <!-- ========================================== -->
        <!-- Tätigkeitsblöcke                          -->
        <!-- ========================================== -->

        <div class="d-flex justify-space-between align-center mb-2">
          <h3 class="text-h6">
            Tätigkeitsblöcke
          </h3>

          <v-btn
              v-if="canWrite"
              variant="outlined"
              @click="openCreateActivityDialog"
          >
            Tätigkeitsblock hinzufügen
          </v-btn>
        </div>

        <v-list v-if="selectedBlocks.length > 0">
          <template
              v-for="(block, index) in selectedBlocks"
              :key="block.id"
          >
            <v-list-item
                :title="`${block.startTime} – ${block.endTime}`"
                :subtitle="block.homeoffice ? 'Homeoffice' : 'Vor Ort'"
                @click="canWrite && openEditActivityDialog(block)"
            >
              <template #append>
                <v-menu v-if="canWrite">
                  <template #activator="{ props }">
                    <v-btn
                        v-bind="props"
                        variant="text"
                        size="small"
                        @click.stop
                    >
                      ⋮
                    </v-btn>
                  </template>

                  <v-list>
                    <v-list-item
                        title="Bearbeiten"
                        @click="openEditActivityDialog(block)"
                    />

                    <v-list-item
                        title="Löschen"
                        @click="deleteActivityBlock(block.id)"
                    />
                  </v-list>
                </v-menu>
              </template>
            </v-list-item>

            <v-divider
                v-if="index < selectedBlocks.length - 1"
            />
          </template>
        </v-list>

        <div
            v-else
            class="text-medium-emphasis pa-4"
        >
          Keine Tätigkeitsblöcke vorhanden.
        </div>

        <!-- Trennung -->
        <v-divider class="my-6" />

        <!-- ========================================== -->
        <!-- Zeitgutschriften                          -->
        <!-- ========================================== -->

        <div class="d-flex justify-space-between align-center mb-2">
          <h3 class="text-h6">
            Zeitgutschriften
          </h3>

          <v-btn
              v-if="canWrite"
              variant="outlined"
              @click="openCreateCreditDialog"
          >
            Zeitgutschrift hinzufügen
          </v-btn>
        </div>

        <v-list v-if="selectedCredits.length > 0">
          <template
              v-for="(credit, index) in selectedCredits"
              :key="credit.id"
          >
            <v-list-item
                :title="formatMinutes(credit.minutes)"
                :subtitle="credit.reason"
                @click="canWrite && openEditCreditDialog(credit)"
            >
              <template #append>
                <v-menu v-if="canWrite">
                  <template #activator="{ props }">
                    <v-btn
                        v-bind="props"
                        variant="text"
                        size="small"
                        @click.stop
                    >
                      ⋮
                    </v-btn>
                  </template>

                  <v-list>
                    <v-list-item
                        title="Bearbeiten"
                        @click="openEditCreditDialog(credit)"
                    />

                    <v-list-item
                        title="Löschen"
                        @click="deleteCredit(credit.id)"
                    />
                  </v-list>
                </v-menu>
              </template>
            </v-list-item>

            <v-divider
                v-if="index < selectedCredits.length - 1"
            />
          </template>
        </v-list>

        <div
            v-else
            class="text-medium-emphasis pa-4"
        >
          Keine Zeitgutschriften vorhanden.
        </div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- DIALOG: Tätigkeitsblock                     -->
    <!-- ============================================ -->

    <v-dialog
        v-model="activityDialog"
        max-width="500"
    >
      <v-card rounded="xl">
        <v-card-title class="d-flex align-center pa-6 pb-2">
          {{
            editingBlockId === null
                ? "Tätigkeitsblock hinzufügen"
                : "Tätigkeitsblock bearbeiten"
          }}
        </v-card-title>

        <v-card-text class="pa-6">
          <v-form @submit.prevent="saveActivityBlock">
            <v-text-field
                v-model="newBlock.startTime"
                label="Beginn"
                type="time"
                variant="outlined"
                class="mb-2"
            />

            <v-text-field
                v-model="newBlock.endTime"
                label="Ende"
                type="time"
                variant="outlined"
                class="mb-2"
            />

            <v-switch
                v-model="newBlock.homeoffice"
                label="Homeoffice"
                color="primary"
            />

            <div class="d-flex justify-end ga-2 mt-4">
              <v-btn
                  variant="text"
                  @click="activityDialog = false"
              >
                Abbrechen
              </v-btn>

              <v-btn
                  color="primary"
                  type="submit"
              >
                {{
                  editingBlockId === null
                      ? "Hinzufügen"
                      : "Speichern"
                }}
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- ============================================ -->
    <!-- DIALOG: Zeitgutschrift                      -->
    <!-- ============================================ -->

    <v-dialog
        v-model="creditDialog"
        max-width="500"
    >
      <v-card rounded="xl">
        <v-card-title class="d-flex align-center pa-6 pb-2">
          {{
            editingCreditId === null
                ? "Zeitgutschrift hinzufügen"
                : "Zeitgutschrift bearbeiten"
          }}
        </v-card-title>

        <v-card-text class="pa-6">
          <v-form @submit.prevent="saveCredit">
            <v-text-field
                v-model.number="newCredit.minutes"
                label="Minuten"
                type="number"
                variant="outlined"
                suffix="min"
                class="mb-2"
            />

            <v-text-field
                v-model="newCredit.reason"
                label="Grund"
                variant="outlined"
                class="mb-2"
            />

            <div class="d-flex justify-end ga-2 mt-4">
              <v-btn
                  variant="text"
                  @click="creditDialog = false"
              >
                Abbrechen
              </v-btn>

              <v-btn
                  color="primary"
                  type="submit"
              >
                {{
                  editingCreditId === null
                      ? "Hinzufügen"
                      : "Speichern"
                }}
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useRoute } from "vue-router";

import useHasAnyRole from "@/composables/useHasAnyRole";
import {
  mockStudentDays,
  type ActivityBlock,
  type TimeCredit,
} from "@/mocks/studentDetail.mock";
import { Role } from "@/types/Role";

/*
 * Student-ID aus /student/:id
 */
const route = useRoute("/student/[id]");

const studentId = Number(route.params.id);

/*
 * Rollen
 */
const canWrite = useHasAnyRole(Role.WRITER);

/*
 * Mock-Daten
 *
 * Kopie erzeugen, damit Änderungen in dieser View
 * nicht direkt das exportierte Mock-Objekt verändern.
 */
const days = ref(
    structuredClone(mockStudentDays),
);

/*
 * Dialoge
 */
const activityDialog = ref(false);
const creditDialog = ref(false);

/*
 * Aktuell bearbeitete IDs
 *
 * null = neuer Eintrag
 */
const editingBlockId = ref<number | null>(null);
const editingCreditId = ref<number | null>(null);

/*
 * Standardmäßig ersten Tag auswählen
 */
const selectedDay = ref<string[]>([
  days.value[0]?.date ?? "",
]);

/*
 * Aktuell ausgewählter Tag
 */
const selectedDayData = computed(() => {
  return days.value.find(
      (day) => day.date === selectedDay.value[0],
  );
});

/*
 * Beschriftung des ausgewählten Tages
 */
const selectedDayLabel = computed(() => {
  return selectedDayData.value?.label ?? "Kein Tag ausgewählt";
});

/*
 * Tätigkeitsblöcke des ausgewählten Tages
 */
const selectedBlocks = computed(() => {
  return selectedDayData.value?.blocks ?? [];
});

/*
 * Zeitgutschriften des ausgewählten Tages
 */
const selectedCredits = computed(() => {
  return selectedDayData.value?.credits ?? [];
});

/*
 * Formular Tätigkeitsblock
 */
const newBlock = reactive({
  startTime: "",
  endTime: "",
  homeoffice: false,
});

/*
 * Formular Zeitgutschrift
 */
const newCredit = reactive({
  minutes: undefined as number | undefined,
  reason: "",
});

/*
 * ============================================
 * Tätigkeitsblock: Neu
 * ============================================
 */
function openCreateActivityDialog() {
  if (!canWrite.value) {
    return;
  }

  editingBlockId.value = null;

  newBlock.startTime = "";
  newBlock.endTime = "";
  newBlock.homeoffice = false;

  activityDialog.value = true;
}

/*
 * ============================================
 * Tätigkeitsblock: Bearbeiten
 * ============================================
 */
function openEditActivityDialog(block: ActivityBlock) {
  if (!canWrite.value) {
    return;
  }

  editingBlockId.value = block.id;

  newBlock.startTime = block.startTime;
  newBlock.endTime = block.endTime;
  newBlock.homeoffice = block.homeoffice;

  activityDialog.value = true;
}

/*
 * ============================================
 * Tätigkeitsblock: Speichern
 * ============================================
 */
function saveActivityBlock() {
  if (!canWrite.value || !selectedDayData.value) {
    return;
  }

  /*
   * Neuen Tätigkeitsblock anlegen
   */
  if (editingBlockId.value === null) {
    selectedDayData.value.blocks.push({
      id: Date.now(),
      startTime: newBlock.startTime,
      endTime: newBlock.endTime,
      homeoffice: newBlock.homeoffice,
    });

    console.debug(
        "Tätigkeitsblock erstellt für Student:",
        studentId,
    );

    console.debug(
        "Tag:",
        selectedDay.value[0],
    );

    /*
     * Später:
     *
     * POST /taetigkeitenblock/
     */
  } else {
    /*
     * Bestehenden Tätigkeitsblock bearbeiten
     */
    const block = selectedDayData.value.blocks.find(
        (block) => block.id === editingBlockId.value,
    );

    if (block) {
      block.startTime = newBlock.startTime;
      block.endTime = newBlock.endTime;
      block.homeoffice = newBlock.homeoffice;
    }

    console.debug(
        "Tätigkeitsblock bearbeitet:",
        editingBlockId.value,
    );

    /*
     * Später:
     *
     * PUT / PATCH /taetigkeitenblock/{id}
     */
  }

  activityDialog.value = false;
}

/*
 * ============================================
 * Tätigkeitsblock: Löschen
 * ============================================
 */
function deleteActivityBlock(id: number) {
  if (!canWrite.value || !selectedDayData.value) {
    return;
  }

  const index = selectedDayData.value.blocks.findIndex(
      (block) => block.id === id,
  );

  if (index !== -1) {
    selectedDayData.value.blocks.splice(index, 1);
  }

  console.debug(
      "Tätigkeitsblock gelöscht:",
      id,
  );

  /*
   * Später:
   *
   * DELETE /taetigkeitenblock/{id}
   */
}

/*
 * ============================================
 * Zeitgutschrift: Neu
 * ============================================
 */
function openCreateCreditDialog() {
  if (!canWrite.value) {
    return;
  }

  editingCreditId.value = null;

  newCredit.minutes = undefined;
  newCredit.reason = "";

  creditDialog.value = true;
}

/*
 * ============================================
 * Zeitgutschrift: Bearbeiten
 * ============================================
 */
function openEditCreditDialog(credit: TimeCredit) {
  if (!canWrite.value) {
    return;
  }

  editingCreditId.value = credit.id;

  newCredit.minutes = credit.minutes;
  newCredit.reason = credit.reason;

  creditDialog.value = true;
}

/*
 * ============================================
 * Zeitgutschrift: Speichern
 * ============================================
 */
function saveCredit() {
  if (
      !canWrite.value ||
      !selectedDayData.value ||
      newCredit.minutes === undefined
  ) {
    return;
  }

  /*
   * Neue Zeitgutschrift anlegen
   */
  if (editingCreditId.value === null) {
    selectedDayData.value.credits.push({
      id: Date.now(),
      minutes: newCredit.minutes,
      reason: newCredit.reason,
    });

    console.debug(
        "Zeitgutschrift erstellt für Student:",
        studentId,
    );

    console.debug(
        "Tag:",
        selectedDay.value[0],
    );

    /*
     * Später:
     *
     * POST /zeitgutschrift/
     */
  } else {
    /*
     * Bestehende Zeitgutschrift bearbeiten
     */
    const credit = selectedDayData.value.credits.find(
        (credit) => credit.id === editingCreditId.value,
    );

    if (credit) {
      credit.minutes = newCredit.minutes;
      credit.reason = newCredit.reason;
    }

    console.debug(
        "Zeitgutschrift bearbeitet:",
        editingCreditId.value,
    );

    /*
     * Später:
     *
     * PUT / PATCH /zeitgutschrift/{id}
     */
  }

  creditDialog.value = false;
}

/*
 * ============================================
 * Zeitgutschrift: Löschen
 * ============================================
 */
function deleteCredit(id: number) {
  if (!canWrite.value || !selectedDayData.value) {
    return;
  }

  const index = selectedDayData.value.credits.findIndex(
      (credit) => credit.id === id,
  );

  if (index !== -1) {
    selectedDayData.value.credits.splice(index, 1);
  }

  console.debug(
      "Zeitgutschrift gelöscht:",
      id,
  );

  /*
   * Später:
   *
   * DELETE /zeitgutschrift/{id}
   */
}

/*
 * Minuten darstellen
 */
function formatMinutes(minutes: number) {
  return `${minutes >= 0 ? "+" : ""}${minutes} Minuten`;
}
</script>