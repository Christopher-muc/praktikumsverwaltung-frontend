<template>
  <div class="ma-12">
    <!-- ====================================================== -->
    <!-- STAMMDATEN -->
    <!-- ====================================================== -->

    <v-card
      v-if="student"
      :title="`${student.vorname} ${student.nachname}`"
      elevation="5"
    >
      <v-row>
        <!-- Praktikum -->
        <v-col cols="6">
          <v-card-text>
            <template v-if="praktikum">
              Praktikumsstart:
              {{ formatDate(praktikum.beginnDatum) }}

              <br />

              Praktikumsende:
              {{ formatDate(praktikum.endeDatum) }}

              <br />

              Benötigte Wochen:
              {{ praktikum.benoetigteWochen ?? "-" }}

              <br />

              Wochenarbeitszeit:
              {{ praktikum.wochenarbeitszeit ?? "-" }}
            </template>

            <v-alert
              v-else
              type="info"
              variant="tonal"
            >
              Für diesen Studenten ist noch kein Praktikum angelegt.
            </v-alert>
          </v-card-text>
        </v-col>

        <!-- Studiengänge -->
        <v-col
          cols="6"
          class="border-s"
        >
          <v-card-text>
            <div class="text-h6 mb-2">
              Studiengänge
            </div>

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

            <v-alert
              v-else
              type="info"
              variant="tonal"
            >
              Für {{ student.vorname }} {{ student.nachname }} sind keine
              Studiengänge hinterlegt.
            </v-alert>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>

    <!-- ====================================================== -->
    <!-- KALENDER / ZEITGUTSCHRIFTEN / TÄTIGKEITEN -->
    <!-- ====================================================== -->

    <v-row class="mt-4">
      <!-- ==================================================== -->
      <!-- KALENDER -->
      <!-- ==================================================== -->

      <v-col cols="4">
        <v-card elevation="5">
          <v-card-title>
            Kalender
          </v-card-title>

          <v-date-picker
            v-if="praktikum"
            v-model="selectedDate"
            :min="praktikum.beginnDatum"
            :max="praktikum.endeDatum"
            :events="calendarEvents"
            width="100%"
          />

          <v-card-text v-else>
            <v-alert
              type="info"
              variant="tonal"
            >
              Der Kalender steht zur Verfügung, sobald ein Praktikum angelegt
              wurde.
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- ==================================================== -->
      <!-- ZEITGUTSCHRIFTEN -->
      <!-- ==================================================== -->

      <v-col cols="4">
        <v-card elevation="5">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Zeitgutschriften</span>

            <v-btn
              v-if="canWriteZeitgutschrift"
              icon
              variant="text"
              size="small"
              :disabled="!selectedDate"
              @click="openCreateZeitgutschriftDialog"
            >
              +
            </v-btn>
          </v-card-title>

          <v-card-subtitle v-if="selectedDate">
            {{ formatDate(selectedDate) }}
          </v-card-subtitle>

          <!-- Einträge -->
          <v-list v-if="selectedZeitgutschriften.length">
            <template
              v-for="(zeitgutschrift, index) in selectedZeitgutschriften"
              :key="zeitgutschrift.id"
            >
              <v-list-item>
                <div class="d-flex align-center">
                  <!-- Grund -->
                  <div
                    class="text-truncate"
                    style="width: 50%"
                  >
                    {{ zeitgutschrift.grund }}
                  </div>

                  <!-- Minuten -->
                  <div
                    class="text-center"
                    style="width: 50%"
                  >
                    {{ zeitgutschrift.mengeMinuten }} min
                  </div>
                </div>

                <!-- Menü -->
                <template
                  v-if="canWriteZeitgutschrift"
                  #append
                >
                  <v-menu>
                    <template #activator="{ props }">
                      <v-btn
                        v-bind="props"
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
                        @click="openEditZeitgutschriftDialog(zeitgutschrift)"
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

          <!-- Keine Einträge -->
          <v-card-text v-else-if="selectedDate">
            <v-alert
              type="info"
              variant="tonal"
            >
              Für den {{ formatDate(selectedDate) }} sind keine
              Zeitgutschriften vorhanden.
            </v-alert>
          </v-card-text>

          <!-- Kein Datum -->
          <v-card-text v-else>
            <v-alert
              type="info"
              variant="tonal"
            >
              Bitte zuerst ein Datum im Kalender auswählen.
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- ==================================================== -->
      <!-- TÄTIGKEITSBLÖCKE -->
      <!-- ==================================================== -->

      <v-col cols="4">
        <v-card elevation="5">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Tätigkeitsblöcke</span>

            <v-btn
              v-if="canWrite"
              icon
              variant="text"
              size="small"
              :disabled="!selectedDate"
              @click="openCreateTaetigkeitDialog"
            >
              +
            </v-btn>
          </v-card-title>

          <v-card-subtitle v-if="selectedDate">
            {{ formatDate(selectedDate) }}
          </v-card-subtitle>

          <!-- Einträge -->
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
                    <template #activator="{ props }">
                      <v-btn
                        v-bind="props"
                        variant="text"
                        size="small"
                        @click.prevent.stop
                      >
                        ⋮
                      </v-btn>
                    </template>

                    <v-list>
                      <v-list-item title="Bearbeiten" />
                      <v-list-item title="Löschen" />
                    </v-list>
                  </v-menu>
                </template>
              </v-list-item>

              <v-divider
                v-if="index < selectedTaetigkeiten.length - 1"
              />
            </template>
          </v-list>

          <!-- Keine Einträge -->
          <v-card-text v-else-if="selectedDate">
            <v-alert
              type="info"
              variant="tonal"
            >
              Für den {{ formatDate(selectedDate) }} sind keine Tätigkeitsblöcke
              vorhanden.
            </v-alert>
          </v-card-text>

          <!-- Kein Datum -->
          <v-card-text v-else>
            <v-alert
              type="info"
              variant="tonal"
            >
              Bitte zuerst ein Datum im Kalender auswählen.
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- ====================================================== -->
    <!-- DIALOGE -->
    <!-- ====================================================== -->

    <!-- CREATE -->
    <CreateTimeCreditDialog
      v-model="createZeitgutschriftDialog"
      :student-id="studentId"
      :selected-date="selectedDate"
      @created="loadPraktikum"
    />

    <!-- EDIT -->
    <EditTimeCreditDialog
      v-model="editZeitgutschriftDialog"
      :student-id="studentId"
      :zeitgutschrift="zeitgutschriftToEdit"
      @updated="loadPraktikum"
    />
  </div>
</template>

<script setup lang="ts">
import type {
  FullPraktikumDTO,
  StudentDTO,
} from "@/api/generated/api-spec";

import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import { ApiFactory } from "@/api/ApiFactory";

import {
  PraktikumControllerApi,
  StudentControllerApi,
  ZeitgutschriftControllerApi,
} from "@/api/generated/api-spec";

import CreateTimeCreditDialog from "@/components/praktikum/CreateTimeCreditDialog.vue";
import EditTimeCreditDialog from "@/components/praktikum/EditTimeCreditDialog.vue";

import useHasAnyRole from "@/composables/useHasAnyRole";
import { Role } from "@/types/Role";

/*
 * ============================================================
 * TYPEN
 * ============================================================
 */

/*
 * Wir verwenden exakt den Elementtyp aus FullPraktikumDTO.
 * Dadurch müssen wir den Namen des generierten
 * Zeitgutschrift-DTOs nicht kennen.
 */
type Zeitgutschrift =
  NonNullable<FullPraktikumDTO["zeitgutschriften"]>[number];

/*
 * ============================================================
 * ROUTE
 * ============================================================
 */

const route = useRoute("/student/[id]");

const studentId = Number(route.params.id);

/*
 * ============================================================
 * API
 * ============================================================
 */

const studentApi =
  ApiFactory.getInstance(StudentControllerApi);

const praktikumApi =
  ApiFactory.getInstance(PraktikumControllerApi);

const zeitgutschriftApi =
  ApiFactory.getInstance(ZeitgutschriftControllerApi);

/*
 * ============================================================
 * BERECHTIGUNGEN
 * ============================================================
 */

const canWrite =
  useHasAnyRole(Role.WRITER);

const canWriteZeitgutschrift =
  useHasAnyRole([
    Role.ZEITGUTSCHRIFT_WRITER,
    Role.WRITER,
  ]);

/*
 * ============================================================
 * STATE
 * ============================================================
 */

const student = ref<StudentDTO>();

const praktikum = ref<FullPraktikumDTO>();

const selectedDate = ref<Date>();

/*
 * Dialoge
 */
const createZeitgutschriftDialog = ref(false);

const editZeitgutschriftDialog = ref(false);

/*
 * Die Zeitgutschrift, die gerade bearbeitet wird.
 */
const zeitgutschriftToEdit =
  ref<Zeitgutschrift>();

/*
 * ============================================================
 * LADEN
 * ============================================================
 */

async function loadStudent() {
  student.value =
    await studentApi.getStudent(studentId);
}

async function loadPraktikum() {
  try {
    const loadedPraktikum =
      await praktikumApi.getPraktikum(studentId);

    praktikum.value = loadedPraktikum;

    /*
     * Nur beim ersten Laden den Praktikumsbeginn auswählen.
     *
     * Nach POST / PUT / DELETE wird loadPraktikum()
     * erneut aufgerufen. Das ausgewählte Datum soll dabei
     * erhalten bleiben.
     */
    if (
      !selectedDate.value &&
      loadedPraktikum.beginnDatum
    ) {
      selectedDate.value =
        loadedPraktikum.beginnDatum;
    }
  } catch (error) {
    console.debug(
      "Kein Praktikum vorhanden:",
      studentId,
      error
    );

    praktikum.value = undefined;

    selectedDate.value = undefined;
  }
}

/*
 * ============================================================
 * DATUM
 * ============================================================
 */

/*
 * Date -> YYYY-MM-DD
 *
 * Kein toISOString(), da wir hier keine
 * UTC-Konvertierung wollen.
 */
function toDateKey(date: Date): string {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/*
 * Datum für die Oberfläche.
 */
function formatDate(
  date: Date | undefined
): string {
  return date?.toLocaleDateString("de-DE") ?? "-";
}

/*
 * ============================================================
 * KALENDER-EVENTS
 * ============================================================
 *
 * schwarz = mindestens ein Tätigkeitsblock
 * gelb    = mindestens eine Zeitgutschrift
 */

function calendarEvents(
  date: string
): string[] | false {
  if (!praktikum.value) {
    return false;
  }

  const colors: string[] = [];

  const hasTaetigkeit =
    praktikum.value.taetigkeiten?.some(
      (taetigkeit) => {
        const tag =
          taetigkeit.taetigkeitenblockID?.tag;

        return (
          tag !== undefined &&
          toDateKey(tag) === date
        );
      }
    ) ?? false;

  const hasZeitgutschrift =
    praktikum.value.zeitgutschriften?.some(
      (zeitgutschrift) => {
        const tag =
          zeitgutschrift.tag;

        return (
          tag !== undefined &&
          toDateKey(tag) === date
        );
      }
    ) ?? false;

  if (hasTaetigkeit) {
    colors.push("black");
  }

  if (hasZeitgutschrift) {
    colors.push("yellow");
  }

  return colors.length
    ? colors
    : false;
}

/*
 * ============================================================
 * AUSGEWÄHLTE TÄTIGKEITSBLÖCKE
 * ============================================================
 */

const selectedTaetigkeiten = computed(() => {
  if (
    !praktikum.value ||
    !selectedDate.value
  ) {
    return [];
  }

  const selectedDateKey =
    toDateKey(selectedDate.value);

  return (
    praktikum.value.taetigkeiten?.filter(
      (taetigkeit) => {
        const tag =
          taetigkeit.taetigkeitenblockID?.tag;

        return (
          tag !== undefined &&
          toDateKey(tag) === selectedDateKey
        );
      }
    ) ?? []
  );
});

/*
 * ============================================================
 * AUSGEWÄHLTE ZEITGUTSCHRIFTEN
 * ============================================================
 */

const selectedZeitgutschriften = computed(() => {
  if (
    !praktikum.value ||
    !selectedDate.value
  ) {
    return [];
  }

  const selectedDateKey =
    toDateKey(selectedDate.value);

  return (
    praktikum.value.zeitgutschriften?.filter(
      (zeitgutschrift) => {
        const tag =
          zeitgutschrift.tag;

        return (
          tag !== undefined &&
          toDateKey(tag) === selectedDateKey
        );
      }
    ) ?? []
  );
});

/*
 * ============================================================
 * CREATE ZEITGUTSCHRIFT
 * ============================================================
 */

function openCreateZeitgutschriftDialog() {
  if (
    !canWriteZeitgutschrift.value ||
    !selectedDate.value
  ) {
    return;
  }

  createZeitgutschriftDialog.value = true;
}

/*
 * ============================================================
 * EDIT ZEITGUTSCHRIFT
 * ============================================================
 */

function openEditZeitgutschriftDialog(
  zeitgutschrift: Zeitgutschrift
) {
  if (!canWriteZeitgutschrift.value) {
    return;
  }

  /*
   * Gewählten Datensatz merken.
   */
  zeitgutschriftToEdit.value =
    zeitgutschrift;

  /*
   * Edit-Dialog öffnen.
   */
  editZeitgutschriftDialog.value =
    true;
}

/*
 * ============================================================
 * DELETE ZEITGUTSCHRIFT
 * ============================================================
 */

async function deleteZeitgutschrift(
  zeitgutschrift: Zeitgutschrift
) {
  if (!canWriteZeitgutschrift.value) {
    return;
  }

  if (zeitgutschrift.id === undefined) {
    console.error(
      "Zeitgutschrift kann nicht gelöscht werden: ID fehlt.",
      zeitgutschrift
    );

    return;
  }

  await zeitgutschriftApi.deleteZeitgutschrift(
    zeitgutschrift.id
  );

  /*
   * Danach Praktikum neu laden.
   *
   * Dadurch verschwinden:
   * - der Eintrag aus der Liste
   * - gegebenenfalls der gelbe Punkt im Kalender
   */
  await loadPraktikum();
}

/*
 * ============================================================
 * TÄTIGKEITSBLOCK
 * ============================================================
 */

function openCreateTaetigkeitDialog() {
  if (
    !canWrite.value ||
    !selectedDate.value
  ) {
    return;
  }

  console.debug(
    "Tätigkeitsblock anlegen für:",
    selectedDate.value
  );

  /*
   * TODO:
   * Tätigkeitsblock-Dialog ergänzen.
   */
}

/*
 * ============================================================
 * INITIALISIERUNG
 * ============================================================
 */

onMounted(async () => {
  await Promise.all([
    loadStudent(),
    loadPraktikum(),
  ]);
});
</script>