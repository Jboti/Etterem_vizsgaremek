<script lang="ts" setup>
import type { emailVerifyData } from '@/api/auth/auth';
import { useEmailVertification } from '@/api/auth/authQuery';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const { query } = useRoute()
const token = query.token as string

const emailverifyDataRef = ref<emailVerifyData>({
    token:'',
})
emailverifyDataRef.value.token = token

const {mutate, isPending} = useEmailVertification()
</script>


<template>
  <v-container class="d-flex justify-center align-center" style="min-height: 90%;">
    <v-card max-width="500" class="pt-8 pb-8 pl-6 pr-6 bg-red-darken-4 card" outlined>
      <v-card-text class="text-center">
        <h1 class="headline white--text" style="text-shadow: 2px 2px 2px black;">Megerősítés!</h1>
      </v-card-text>
      <v-card-text class="text-center">
        <h3 class="white--text" style="text-shadow: 2px 2px 2px black;">A gombra kattintva igazolhatja email címet és aktiválhatja a felhasználóját:</h3>
      </v-card-text>
      <v-card-text class="text-center">
          <v-btn 
            @click="mutate(emailverifyDataRef)"
            :loading="isPending"
            class="white pl-4 pr-4 mt-4 button"
          >
            <p class="mr-2">Aktiválás</p><v-icon style="color: green;" class="mb-1">mdi-check</v-icon>
          </v-btn>
        </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>

.card{
  box-shadow: 0 0 40px 8px black inset, 0 0 5px 2px black; 
  animation: .7s ease-in-out fade;
}

.button{
  font-weight: bolder;
  box-shadow: 0 0 5px 2px black;
  transition: transform 0.7s ease-in-out;
}
.button:hover{
  box-shadow: 0 0 5px .5px black inset, 0 0 10px 5px black !important;
  transform: scale(1.2);
}

@keyframes fade {
  0%   { opacity:0; }
  100% { opacity:1; }
}
</style>