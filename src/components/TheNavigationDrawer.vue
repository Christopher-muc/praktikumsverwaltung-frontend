<template>
  <v-navigation-drawer
    v-model="showDrawer"
    temporary
  >
    <v-list>
      <v-list-item to="/">
        <v-list-item-title> Studenten </v-list-item-title>
      </v-list-item>

      <v-list-item to="/studiengaenge">
        <v-list-item-title> Studiengänge </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
const showDrawer = defineModel<boolean>({ required: true });
</script>
