<template>
  <div>
    <v-text-field
      v-model="firstName"
      label="Vorname"
      variant="outlined"
      class="mb-2"
    />

    <v-text-field
      v-model="lastName"
      label="Nachname"
      variant="outlined"
      class="mb-2"
    />

    <v-text-field
      v-model="email"
      label="E-Mail"
      type="email"
      variant="outlined"
      class="mb-2"
    />

    <v-text-field
      v-model.number="wochenarbeitszeit"
      label="Wochenarbeitszeit"
      type="number"
      variant="outlined"
      suffix="h"
    />
  </div>
</template>

<script setup lang="ts">
const firstName = defineModel<string>("firstName", {
  required: true,
});

const lastName = defineModel<string>("lastName", {
  required: true,
});

const email = defineModel<string>("email", {
  required: true,
});

const wochenarbeitszeit = defineModel<number | undefined>("wochenarbeitszeit", {
  required: true,
});
</script>
