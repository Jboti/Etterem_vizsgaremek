<script lang="ts" setup>
import { useRouter } from 'vue-router';

const links = [
  { name: 'Bejelentkezés', icon: 'mdi-login' },
  { name: 'Regisztráció', icon: 'mdi-account-plus' },
];
const { push } = useRouter();
</script>
<template>
  <h1>Home</h1>
  <v-card style="display: flex;
    align-content: stretch;
    flex-direction: row;
    justify-content: center;
    box-shadow: none;">
    <v-btn
            v-for="link in links"
            :key="link.name"
            class="mx-1 d-flex flex-column align-center bg-red-darken-4"
            color="white"
            variant="text"
            @click="push({ name: link.name })">
            <div class="flex-grow-0 flex-shrink-1" cols="2">
              <v-icon>{{ link.icon }}</v-icon>
              {{ link.name }}
            </div>
          </v-btn>
  </v-card>
</template>
