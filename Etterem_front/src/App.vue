<script setup lang="ts">
import { useRouter } from 'vue-router';

const links = [
  { name: 'Főoldal', icon: 'mdi-home'},
  { name: 'Rendelés', icon: 'mdi-food-takeout-box'},
  { name: 'Menü', icon: 'mdi-menu'},
  { name: 'Felhasználó', icon: 'mdi-account'},
]

const { push } = useRouter();
</script>

<template>
  <v-app>
    <v-main class="fill-height background-image" style="--v-layout-bottom: 0px;">
      <RouterView />
    </v-main>
    <v-navigation-drawer style="transform: translateY(0%)" location="bottom" app>
      <v-footer class="pt-1" style="background: linear-gradient(90deg, black, #B71C1C, black);">
        <v-row justify="center" no-gutters cols="12">
          <v-btn
            v-for="link in links"
            :key="link.name"
            class="mx-3 d-flex flex-column align-center"
            color="white"
            rounded="xl"
            variant="text"
            @click="push({ name: link.name })" 
            style="display: flex !important; 
            flex-wrap: nowrap;
            align-content: space-between;
            justify-content: space-around;
            align-items: flex-end !important;">
            <div class="flex-grow-1 flex-shrink-0" cols="1">
              <v-icon class="mx-1">{{ link.icon }}</v-icon>
              {{ link.name }}
            </div>
          </v-btn>
          <v-col class="text-center mt-2" cols="12">
            <strong>2025 - Döner Cegléd</strong>
          </v-col>
        </v-row>
      </v-footer>
    </v-navigation-drawer>
  </v-app>
</template>

<style scoped>
.background-image {
  background-image: url(background.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;

}
</style>
