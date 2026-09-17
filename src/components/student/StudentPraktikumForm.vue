<template>
  <div>
    <v-progress-linear
      v-if="loading"
      indeterminate
      class="mb-4"
    />

    <template v-else>
      <v-alert
        v-if="!praktikumExists"
        type="info"
        variant="tonal"
        class="mb-4"
      >
        Für diesen Studenten ist noch kein Praktikum angelegt. Beim Speichern
        wird ein neues Praktikum erstellt.
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
        v-model="wochenarbeitszeit"
        label="Wochenarbeitszeit"
        type="number"
        variant="outlined"
        suffix="Stunden"
        min="0"
        class="mb-2"
      />

      <v-text-field
        v-model="benoetigteWochen"
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
</template>

<script setup lang="ts">
defineProps<{
  loading: boolean;
  praktikumExists: boolean;
  dateError: string;
}>();

const beginnDatum = defineModel<string>("beginnDatum", {
  required: true,
});

const endeDatum = defineModel<string>("endeDatum", {
  required: true,
});

const wochenarbeitszeit = defineModel<number | undefined>("wochenarbeitszeit");

const benoetigteWochen = defineModel<number | undefined>("benoetigteWochen");
</script>
