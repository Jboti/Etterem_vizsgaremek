<script setup lang="ts">
import { useRouter } from 'vue-router';
  const links = [
    'Home',
    'Rendeles',
    'Menu',
    'Felhasznalo',
    'Regisztráció',
    'Bejelentkezés'
  ]

  const {push} = useRouter()
</script>

<template>
  <v-app>
  <v-main class="fill-height">
    <RouterView />
  </v-main>
  <v-navigation-drawer location="bottom">
    <v-footer class="bg-red-darken-4">
    <v-row justify="center" no-gutters>
      <v-btn
        v-for="link in links"
        :key="link"
        class="mx-2"
        color="white"
        rounded="xl"
        variant="text"
        @click="push({name:link})"
      >
        {{ link }}
      </v-btn>
      <v-col class="text-center mt-4" cols="12">
        <strong>2024 - Döner Cegléd</strong>
      </v-col>
    </v-row>
  </v-footer>
  </v-navigation-drawer>
</v-app>
</template>
