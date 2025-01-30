<script lang="ts" setup>
import { useRouter } from 'vue-router';

const links = [
  { name: 'Bejelentkezés', icon: 'mdi-login' },
  { name: 'Regisztráció', icon: 'mdi-account-plus' },
];
const { push } = useRouter()

</script>
<template>
  <v-container fluid
    style="background-color: rgba(255, 255, 255, .65);
    height: 20%; 
    max-height: 1200px; 
    border-bottom-left-radius: 20px; 
    border-bottom-right-radius: 20px; 
    padding: .1%; 
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;">
      <v-img src="../../public/donerlogoNobg.png" style="height: 100%; width: 20%; filter: drop-shadow(0 0 15px black);" ></v-img>
      <v-card class=" mt-4" 
        style="display: flex;
        align-content: stretch;
        flex-direction: row;
        box-shadow: none;
        background: transparent;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        flex-wrap: nowrap;">
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
  </v-container>
</template>
