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

const required = (value: string) =>
  !!value?.trim() || "Dieses Feld ist erforderlich";
</script>
