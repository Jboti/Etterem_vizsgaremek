<script setup lang="ts">
import { useRouter } from 'vue-router';
  const links = [
    'Home',
    'Rendeles',
    'Team',
    'Services',
    'Blog',
    'Contact Us',
  ]

  const {push} = useRouter()
</script>

<template>
  <v-app>
  <v-main class="fill-height">
    <RouterView />
    Ez a Rendelés
  </v-main>
  <v-navigation-drawer location="bottom">
    <v-footer class="bg-grey-lighten-1">
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
        {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
      </v-col>
    </v-row>
  </v-footer>
  </v-navigation-drawer>
</v-app>
</template>
