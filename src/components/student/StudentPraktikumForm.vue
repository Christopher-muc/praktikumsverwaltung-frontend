<template>
  <div>
    <v-progress-linear
      v-if="loading"
      indeterminate
      class="mb-4"
    />

    <template v-else>
      <div
        v-if="!praktikumExists"
        class="text-medium-emphasis mb-4"
      >
        Für diesen Studenten ist noch kein Praktikum angelegt. Beim Speichern
        wird ein neues Praktikum erstellt.
      </div>

      <v-text-field
        v-model="beginnDatum"
        label="Beginn"
        type="date"
        variant="outlined"
        class="mb-2"
      />

      <v-text-field
        v-model="endDatum"
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
        class="mb-2"
      />

      <v-text-field
        v-model.number="benoetigteWochen"
        label="Benötigte Wochen"
        type="number"
        variant="outlined"
        suffix="Wochen"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  loading: boolean;
  praktikumExists: boolean;
}>();

const beginnDatum = defineModel<string>("beginnDatum", {
  required: true,
});

const endDatum = defineModel<string>("endDatum", {
  required: true,
});

const wochenarbeitszeit = defineModel<number | undefined>("wochenarbeitszeit");

const benoetigteWochen = defineModel<number | undefined>("benoetigteWochen");
</script>
