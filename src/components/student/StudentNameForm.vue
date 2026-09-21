<template>
  <div>
    <v-text-field
      v-model="firstName"
      label="Vorname"
      variant="outlined"
      :error-messages="validationStore.getFieldErrors('vorname')"
      class="mb-2"
    />

    <v-text-field
      v-model="lastName"
      label="Nachname"
      variant="outlined"
      :error-messages="validationStore.getFieldErrors('nachname')"
      class="mb-2"
    />

    <v-text-field
      v-model="email"
      label="E-Mail"
      type="email"
      variant="outlined"
      :error-messages="validationStore.getFieldErrors('email')"
      class="mb-2"
    />

    <v-text-field
      v-model.number="wochenarbeitszeit"
      label="Wochenarbeitszeit"
      type="number"
      variant="outlined"
      suffix="h"
      :error-messages="validationStore.getFieldErrors('wochenarbeitszeit')"
    />
  </div>
</template>

<script setup lang="ts">
import { useValidationStore } from "@/stores/validation";

const validationStore = useValidationStore();

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
