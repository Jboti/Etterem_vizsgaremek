<script lang="ts" setup>
import { useRoute } from 'vue-router';

const { params } = useRoute()

</script>

<template>
 <v-container class="d-flex justify-center align-center" style="min-height: 90%; max-height: 90%;">
    <v-card max-width="500" class="pt-8 pb-8 pl-6 pr-6 bg-red-darken-4 card" outlined>
      <v-card-text class="text-center">
          <h1 class="headline white--text my-6" style="text-shadow: 2px 2px 2px black;">Rendelés leadva!</h1>
          <h2 class="headline white--text my-4" style="text-shadow: 2px 2px 2px black;">Fizetendő: {{params.price || 'Hiba'}} Ft</h2>
          <h2 class="headline white--text my-4" style="text-shadow: 2px 2px 2px black;">Rendelésed száma: <p style="color:black; text-shadow: none;">{{params.id}}</p></h2>
          <h3 class="headline white--text my-4" style="text-shadow: 2px 2px 2px black;">Köszönjük rendelésed, az étel elkészítéséhez már neki is álltunk!</h3>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.card{
  box-shadow: 0 0 40px 8px black inset, 0 0 5px 2px black;
  animation: .7s ease-in-out fade;
}


@keyframes fade {
  0%   { opacity:0; }
  100% { opacity:1; }
}
</style>