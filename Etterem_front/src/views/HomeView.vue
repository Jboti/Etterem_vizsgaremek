<script lang="ts" setup>
import { useLogout } from '@/api/auth/authQuery';
import { useGetUserInfo } from '@/api/user/userQuery';
import { useRouter } from 'vue-router';

const links = [
  { name: 'Bejelentkezés', icon: 'mdi-login' },
  { name: 'Regisztráció', icon: 'mdi-account-plus' },
]
const { push } = useRouter()
const { data, isError } = useGetUserInfo()
const { mutate, isPending} = useLogout()

const handleLogout = () => {
  mutate()
}

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
        <v-card-title class="pb-6 pt-4"><h2 style="font-size: clamp(16px, 4vw, 50px);"><b>{{ data?.userName }}</b></h2></v-card-title>
        <v-btn
                class="mx-1 mt-2 mb-2 pl-5 pr-5 auth-buttons"
                color="white"
                variant="text"
                @click="handleLogout()" :loading="isPending">
                <v-icon class="mx-1" style="line-height: 0;">mdi-logout</v-icon>
                <span class="ml-1" style="line-height: 1.5; font-weight: bold;">Kijelentkezés</span>
          </v-btn>
      </v-card>
  </v-container>
</template>
<style scoped>

.main-page-tp{
  background-color: rgba(255, 255, 255, .75);
  box-shadow: 0 0 20px 5px #B71C1C;
  max-height: 150px;
  min-height: 100px; 
  max-width: 1750px;
  border-bottom-left-radius: 20px; 
  border-bottom-right-radius: 20px; 
  padding: .1%; 
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  animation: 1s ease-out 0s 1 fade;
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
  animation: 1.5s ease-in slideInFromRight;
}

.logo{
  min-height:100px;
  max-height: 150px;
  width: 25%;
  filter: drop-shadow(0 0 20px brown);
  animation: 1s ease-out 0s 1 slideInFromLeft;
}


.auth-buttons{
  background-image: linear-gradient(to right, #B71C1C 10%,  black 100%);
  background-size: 200% auto;
  transition: all .3s ease-in-out;
  padding:2%;
  transform: scale(90%);
  font-size: clamp(10px, 3vw, 20px);
  box-shadow: 0 0 5px 2px black inset, 0 0 5px .5px black;
  display: flex !important;
  flex-wrap: nowrap;
  align-items: center;
}

.auth-buttons:hover{
  transform: scale(1.1);
  background-position: right;
}

.v-card-title {
  background: linear-gradient(280deg, black 0%,#B71C1C 30%,#B71C1C 70%, black 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

@keyframes slideInFromLeft {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes slideInFromRight {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
}
@keyframes fade {
  0%   { opacity:0; }
  50%  { opacity:.5; }
  100% { opacity:1; }
}

</style>