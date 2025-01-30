<script lang="ts" setup>
import { useGetUserInfo } from '@/api/user/userQuery';
import { useRouter } from 'vue-router';

const links = [
  { name: 'Bejelentkezés', icon: 'mdi-login' },
  { name: 'Regisztráció', icon: 'mdi-account-plus' },
]
const { push } = useRouter()

const { data, isError } = useGetUserInfo()

</script>
<template>
  <v-container fluid class="main-page-tp">
      <v-img src="../../donerlogoNobg.png" class="ml-6 mr-3 logo"></v-img>
      <v-card v-if="isError" class="mr-8 ml-3 logo-buttons-placement">
        <v-btn v-for="link in links" :key="link.name"
                class="mx-1 mt-2 mb-2 pl-5 pr-5 auth-buttons"
                color="white"
                variant="text"
                @click="push({ name: link.name })">
                <v-icon class="mx-1" style="line-height: 0;">{{ link.icon }}</v-icon>
                <span class="ml-1" style="line-height: 1.5; font-weight: bold;">{{ link.name }}</span>
          </v-btn>
      </v-card>
      <v-card v-else class="mr-8 ml-3 logo-buttons-placement">
        <v-card-title style="text-align: center;" class="pb-6 pt-4"><h2 style="font-size: clamp(16px, 4vw, 50px);"><b>{{ data?.userName }}</b></h2></v-card-title>
        <v-btn
                class="mx-1 mt-2 mb-2 pl-5 pr-5 auth-buttons"
                color="white"
                variant="text"
                @click="push({name:'Főoldal'})">
                <v-icon class="mx-1" style="line-height: 0;">mdi-logout</v-icon>
                <span class="ml-1" style="line-height: 1.5; font-weight: bold;">Kijelentkezés</span>
          </v-btn>
      </v-card>
  </v-container>
</template>
<style scoped>

.main-page-tp{
  background-color: rgba(255, 255, 255, .85);
  box-shadow: 0 0 20px 5px #B71C1C;
  max-height: 250px;
  min-height: 150px; 
  max-width: 1750px;
  border-bottom-left-radius: 20px; 
  border-bottom-right-radius: 20px; 
  padding: .1%; 
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
}

.logo-buttons-placement{
  width: 75%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  box-shadow: none;
  background: transparent;
  flex-direction: column;
  align-content: stretch;
  flex-wrap: nowrap;
}

.logo{
  min-height:150px;
  max-height: 250px;
  width: 25%;
  filter: drop-shadow(0 0 20px brown);
}

.auth-buttons{
  background-image: linear-gradient(to right, #B71C1C 10%,  black 100%);
  background-size: 200% auto;
  transition: all .3s ease-in-out;
  padding:2%;
  font-size: clamp(10px, 3vw, 20px);
  box-shadow: 0 0 5px 2px black inset, 0 0 5px .5px black;
  display: flex !important;
  flex-wrap: nowrap;
  align-items: center;
}

.auth-buttons:hover{
  background-position: right;
}

</style>