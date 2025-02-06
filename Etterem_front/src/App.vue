<script setup lang="ts">
import { useRouter } from 'vue-router'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'

const links = [
  { name: 'Főoldal', icon: 'mdi-home'},
  { name: 'Rendelés', icon: 'mdi-food-takeout-box'},
  { name: 'Étlap', icon: 'mdi-silverware'},
  { name: 'Felhasználó', icon: 'mdi-account'},
]

const { push } = useRouter();
</script>

<template>
  <v-app>
    <v-main class="fill-height background-image" style=" --v-layout-bottom: 0px; font-family: 'Times New Roman', Times, serif;">
      <!-- <VueQueryDevtools /> -->
      <RouterView />
    </v-main>
    <v-navigation-drawer style="transform: translateY(0%)" location="bottom" app>
      <v-footer class="pt-1" style="background: linear-gradient(to right, black, #B71C1C, black);">
        <v-row justify="center" no-gutters cols="12">
          <v-col v-for="link in links" :key="link.name"
            cols="6" sm="3" md="3"
            class="d-flex flex-column align-center buttons">
          <v-btn class="mx-3 d-flex align-center"
            color="white"
            rounded="xl"
            variant="text"
            @click="push({ name: link.name })">
            <v-icon class="mx-1" style="line-height: 0;">{{ link.icon }}</v-icon>
            <span class="ml-1" style="line-height: 1.5; font-weight: bold;">{{ link.name }}</span>
          </v-btn>
          </v-col>
          <v-col class="text-center" cols="12">
            <strong>2025 - Döner Cegléd</strong>
          </v-col>
        </v-row>
      </v-footer>
    </v-navigation-drawer>
  </v-app>
</template>

<style scoped>
.background-image {
  background-image: linear-gradient(135deg, black, rgb(50,50,50), black);
  background-size: 300% 300%;
  animation: anim-bg 12s ease-in-out infinite;
}

.buttons{
  width: 100%;
  display: flex !important;
  flex-wrap: nowrap;
  align-items: center;
  transition: all 0.5s ease-in-out;
}
.buttons:hover{
  transform: scale(1.3);
}

@keyframes anim-bg {
  0% {
    background-position: 0 50%;
  }
  50%{
    background-position: 100% 50%;
  }
  100%{
    background-position: 0 50%;
  }
}
</style>
