<template>
  <div>
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
      class="mb-2"
    />

    <v-text-field
      v-model="email"
      label="E-Mail"
      type="email"
      variant="outlined"
      :rules="[required]"
      class="mb-2"
    />

    <v-text-field
      v-model.number="wochenarbeitszeit"
      label="Wochenarbeitszeit"
      type="number"
      variant="outlined"
      suffix="h"
      min="1"
      :rules="[requiredNumber]"
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

const required = (value: string) =>
  !!value?.trim() || "Dieses Feld ist erforderlich";

const requiredNumber = (value: number | undefined) =>
  (value !== undefined && value > 0) || "Der Wert muss größer als 0 sein.";
</script>
