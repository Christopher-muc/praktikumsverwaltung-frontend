<template>
  <v-dialog
    v-model="dialog"
    max-width="600"
    persistent
  >
    <v-card rounded="xl">
      <v-card-title class="pa-6 pb-2"> Student bearbeiten </v-card-title>

      <v-card-text class="pa-6">
        <!-- Auswahl -->
        <v-btn-toggle
          v-model="editMode"
          mandatory
          divided
          class="mb-6"
        >
          <v-btn value="name"> Name </v-btn>

          <v-btn value="praktikum"> Praktikum </v-btn>

          <v-btn value="studiengang"> Studiengang </v-btn>
        </v-btn-toggle>

        <!-- ======================================== -->
        <!-- NAME -->
        <!-- ======================================== -->

        <div v-if="editMode === 'name'">
          <v-text-field
            v-model="firstName"
            label="Vorname"
            variant="outlined"
            :rules="[required]"
            class="mb-2"
          />

          <v-text-field
            v-model="lastName"
            label="Nachname"
            variant="outlined"
            :rules="[required]"
          />
        </div>

        <!-- ======================================== -->
        <!-- PRAKTIKUM -->
        <!-- ======================================== -->

        <div v-if="editMode === 'praktikum'">
          <v-progress-linear
            v-if="praktikumLoading"
            indeterminate
            class="mb-4"
          />

          <template v-else>
            <v-alert
              v-if="!praktikum"
              type="info"
              variant="tonal"
              class="mb-4"
            >
              Für diesen Studenten ist noch kein Praktikum angelegt. Beim
              Speichern wird ein neues Praktikum erstellt.
            </v-alert>

            <v-text-field
              v-model="beginnDatum"
              label="Beginn"
              type="date"
              variant="outlined"
              class="mb-2"
            />

            <v-text-field
              v-model="endeDatum"
              label="Ende"
              type="date"
              variant="outlined"
              class="mb-2"
            />

            <v-text-field
              v-model.number="wochenarbeitszeit"
              label="Wochenarbeitszeit"
              type="number"
              variant="outlined"
              suffix="Stunden"
              min="0"
              class="mb-2"
            />

            <v-text-field
              v-model.number="benoetigteWochen"
              label="Benötigte Wochen"
              type="number"
              variant="outlined"
              suffix="Wochen"
              min="0"
            />

            <v-alert
              v-if="dateError"
              type="error"
              variant="tonal"
              class="mt-4"
            >
              {{ dateError }}
            </v-alert>
          </template>
        </div>

        <!-- ======================================== -->
        <!-- STUDIENGÄNGE -->
        <!-- ======================================== -->

        <div v-if="editMode === 'studiengang'">
          <v-progress-linear
            v-if="studiengaengeLoading"
            indeterminate
            class="mb-4"
          />

          <template v-else>
            <div class="text-h6 mb-2">Studiengänge</div>

            <!-- Vorhandene Studiengänge -->
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

            <!-- Keine Studiengänge vorhanden -->
            <v-alert
              v-else
              type="info"
              variant="tonal"
              class="mb-4"
            >
              Für diesen Studenten ist noch kein Studiengang hinterlegt.
            </v-alert>

            <!-- Neuen Studiengang hinzufügen -->
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

        <!-- ======================================== -->
        <!-- AKTIONEN -->
        <!-- ======================================== -->

        <div class="d-flex justify-end ga-2 mt-6">
          <v-btn
            variant="text"
            :disabled="saving"
            @click="close"
          >
            Abbrechen
          </v-btn>

          <v-btn
            color="primary"
            :loading="saving"
            :disabled="praktikumLoading || studiengaengeLoading"
            @click="save"
          >
            Speichern
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type {
  FullPraktikumDTO,
  SimpleStudentDTO,
  Studiengang,
} from "@/api/generated/api-spec";

import { ref, watch } from "vue";

import { ApiFactory } from "@/api/ApiFactory";
import {
  PraktikumControllerApi,
  StudentControllerApi,
} from "@/api/generated/api-spec";

/*
 * Dialog
 */
const dialog = defineModel<boolean>({
  default: false,
});

/*
 * Props
 */
const props = defineProps<{
  student: SimpleStudentDTO | null;
}>();

/*
 * Events
 */
const emit = defineEmits<{
  updated: [];
}>();

/*
 * APIs
 */
const studentApi = ApiFactory.getInstance(StudentControllerApi);

const praktikumApi = ApiFactory.getInstance(PraktikumControllerApi);

/*
 * Bearbeitungsmodus
 */
const editMode = ref<"name" | "praktikum" | "studiengang">("name");

/*
 * Student
 */
const firstName = ref("");
const lastName = ref("");

/*
 * Praktikum
 */
const praktikum = ref<FullPraktikumDTO | null>(null);

const beginnDatum = ref("");
const endeDatum = ref("");

const wochenarbeitszeit = ref<number | undefined>(undefined);

const benoetigteWochen = ref<number | undefined>(undefined);

/*
 * Studiengänge
 */
const studiengaenge = ref<Studiengang[]>([]);

const newStudiengang = ref("");

/*
 * Status
 */
const praktikumLoading = ref(false);

const studiengaengeLoading = ref(false);

const saving = ref(false);

const dateError = ref("");

/*
 * Validierung
 */
const required = (value: string) =>
  !!value?.trim() || "Dieses Feld ist erforderlich";

/*
 * Wenn ein Student ausgewählt wird.
 */
watch(
  () => props.student,
  async (student) => {
    if (!student) {
      return;
    }

    /*
     * Die einfachen Studentendaten kommen direkt
     * aus dem SimpleStudentDTO.
     */
    firstName.value = student.vorname ?? "";
    lastName.value = student.nachname ?? "";

    editMode.value = "name";

    /*
     * Praktikum und vollständigen Studenten
     * parallel laden.
     */
    await Promise.all([loadPraktikum(), loadStudiengaenge()]);
  },
  {
    immediate: true,
  }
);

/*
 * ============================================
 * PRAKTIKUM LADEN
 * ============================================
 */

async function loadPraktikum() {
  if (props.student?.studentId === undefined) {
    return;
  }

  praktikumLoading.value = true;

  praktikum.value = null;

  resetPraktikumFields();

  try {
    const loadedPraktikum = await praktikumApi.getPraktikum(
      props.student.studentId
    );

    praktikum.value = loadedPraktikum;

    beginnDatum.value = toDateInputValue(loadedPraktikum.beginnDatum);

    endeDatum.value = toDateInputValue(loadedPraktikum.endeDatum);

    wochenarbeitszeit.value = loadedPraktikum.wochenarbeitszeit;

    benoetigteWochen.value = loadedPraktikum.benoetigteWochen;
  } catch (error) {
    console.debug(
      "Kein Praktikum für Student vorhanden:",
      props.student.studentId,
      error
    );

    praktikum.value = null;

    resetPraktikumFields();
  } finally {
    praktikumLoading.value = false;
  }
}

/*
 * ============================================
 * STUDIENGÄNGE LADEN
 * ============================================
 */

async function loadStudiengaenge() {
  if (props.student?.studentId === undefined) {
    return;
  }

  studiengaengeLoading.value = true;

  studiengaenge.value = [];

  try {
    /*
     * SimpleStudentDTO besitzt keine Studiengänge.
     *
     * Deshalb vollständigen StudentDTO laden.
     */
    const fullStudent = await studentApi.getStudent(props.student.studentId);

    /*
     * Eine Kopie des Arrays erstellen.
     *
     * Dadurch verändern wir nicht direkt
     * das vom Backend geladene Objekt.
     */
    studiengaenge.value = [...(fullStudent.studiengaenge ?? [])];
  } catch (error) {
    console.error(
      "Studiengänge konnten nicht geladen werden:",
      props.student.studentId,
      error
    );

    studiengaenge.value = [];
  } finally {
    studiengaengeLoading.value = false;
  }
}

/*
 * ============================================
 * STUDIENGANG LOKAL HINZUFÜGEN
 * ============================================
 */

function addStudiengang() {
  const name = newStudiengang.value.trim();

  /*
   * Leeren Studiengang nicht hinzufügen.
   */
  if (!name) {
    return;
  }

  /*
   * Prüfen, ob der Studiengang bereits
   * in der Liste vorhanden ist.
   */
  const alreadyExists = studiengaenge.value.some(
    (studiengang) => studiengang.name.toLowerCase() === name.toLowerCase()
  );

  if (alreadyExists) {
    return;
  }

  /*
   * Noch keine studiengangNr vorhanden,
   * da der Eintrag noch nicht im Backend
   * gespeichert wurde.
   */
  studiengaenge.value.push({
    name,
  });

  newStudiengang.value = "";
}

/*
 * ============================================
 * STUDIENGANG LOKAL LÖSCHEN
 * ============================================
 */

function removeStudiengang(index: number) {
  studiengaenge.value.splice(index, 1);
}

/*
 * ============================================
 * SPEICHERN
 * ============================================
 */

async function save() {
  if (editMode.value === "name") {
    await updateStudent();

    return;
  }

  if (editMode.value === "praktikum") {
    await savePraktikum();

    return;
  }

  if (editMode.value === "studiengang") {
    await saveStudiengaenge();
  }
}

/*
 * ============================================
 * STUDENT AKTUALISIEREN
 * ============================================
 */

async function updateStudent() {
  if (props.student?.studentId === undefined) {
    return;
  }

  if (!firstName.value.trim() || !lastName.value.trim()) {
    return;
  }

  saving.value = true;

  try {
    await studentApi.updateStudent(props.student.studentId, {
      vorname: firstName.value.trim(),
      nachname: lastName.value.trim(),
    });

    emit("updated");

    close();
  } finally {
    saving.value = false;
  }
}

/*
 * ============================================
 * PRAKTIKUM SPEICHERN
 * ============================================
 */

async function savePraktikum() {
  if (props.student?.studentId === undefined) {
    return;
  }

  dateError.value = "";

  /*
   * Datum validieren.
   *
   * YYYY-MM-DD kann hier direkt
   * miteinander verglichen werden.
   */
  if (
    beginnDatum.value &&
    endeDatum.value &&
    endeDatum.value < beginnDatum.value
  ) {
    dateError.value = "Das Enddatum darf nicht vor dem Beginndatum liegen.";

    return;
  }

  saving.value = true;

  try {
    const praktikumData = {
      beginnDatum: beginnDatum.value
        ? new Date(`${beginnDatum.value}T00:00:00`)
        : undefined,

      endeDatum: endeDatum.value
        ? new Date(`${endeDatum.value}T00:00:00`)
        : undefined,

      wochenarbeitszeit: wochenarbeitszeit.value,

      benoetigteWochen: benoetigteWochen.value,
    };

    /*
     * Praktikum existiert:
     * -> aktualisieren
     */
    if (praktikum.value) {
      await praktikumApi.updatePraktikum(
        props.student.studentId,
        praktikumData
      );
    } else {
      /*
       * Noch kein Praktikum:
       * -> neu anlegen
       */
      await praktikumApi.createPraktikum({
        studentId: props.student.studentId,
        ...praktikumData,
      });
    }

    emit("updated");

    close();
  } finally {
    saving.value = false;
  }
}

/*
 * ============================================
 * STUDIENGÄNGE SPEICHERN
 * ============================================
 */

async function saveStudiengaenge() {
  if (props.student?.studentId === undefined) {
    return;
  }

  /*
   * Der Backend-Endpunkt existiert aktuell
   * noch nicht.
   *
   * Deshalb NICHT so tun, als wären die
   * Änderungen gespeichert worden.
   */
  console.debug("Student:", props.student.studentId);

  console.debug("Zu speichernde Studiengänge:", studiengaenge.value);

  console.warn(
    "Studiengänge können noch nicht gespeichert werden, " +
      "da der Backend-Endpunkt noch fehlt."
  );

  /*
   * Sobald der Endpoint existiert,
   * kommt der API-Aufruf hier hinein.
   *
   * Danach:
   *
   * emit("updated");
   * close();
   */
}

/*
 * ============================================
 * HILFSFUNKTIONEN
 * ============================================
 */

/*
 * Date -> YYYY-MM-DD
 *
 * Wird für <input type="date"> benötigt.
 */
function toDateInputValue(value: Date | undefined): string {
  if (!value) {
    return "";
  }

  return value.toISOString().slice(0, 10);
}

/*
 * Praktikumsfelder leeren.
 */
function resetPraktikumFields() {
  beginnDatum.value = "";
  endeDatum.value = "";

  wochenarbeitszeit.value = undefined;

  benoetigteWochen.value = undefined;
}

/*
 * Dialog schließen.
 */
function close() {
  dialog.value = false;

  editMode.value = "name";

  dateError.value = "";

  newStudiengang.value = "";
}
</script>
