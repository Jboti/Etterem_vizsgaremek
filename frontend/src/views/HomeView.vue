<script lang="ts" setup>
import { useLogout, useValidateToken } from '@/api/auth/authQuery';
import { useGetUserInfo } from '@/api/user/userQuery';
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const { push } = useRouter()

const authLinks = [
  { name: 'Bejelentkezés', icon: 'mdi-login' },
  { name: 'Regisztráció', icon: 'mdi-account-plus' },
]

// API hívások
const { isError, mutate: validateToken, isPending:validating } = useValidateToken()
const { mutate:logout, isPending:loggingOut} = useLogout()
const { data: userData } = useGetUserInfo()

const isLoggedIn = computed(() => !isError.value && userData.value)

const navigateTo = (routeName: string) => {
  push({ name: routeName })
}

onMounted(() => {
  window.scrollTo(0, 0)
  validateToken()
})
</script>


<template>
  <div v-if="validating" class="loader"></div>
  <div v-else>
    <v-container fluid class="main-page-tp mb-4">
        <v-img src="../../donerlogoNobg.png" class="ml-6 mr-3 logo"></v-img>

        <!-- Logged out view -->
        <v-card v-if="!isLoggedIn" class="mr-8 ml-3 logo-buttons-placement">
          <v-btn v-for="link in authLinks" :key="link.name"
                  class="mx-1 mt-2 mb-2 pl-5 pr-5 auth-buttons"
                  color="white"
                  variant="text"
                  @click="navigateTo(link.name)">
                  <v-icon class="mx-1" style="line-height: 0;">{{ link.icon }}</v-icon>
                  <span class="ml-1" style="line-height: 1.5; font-weight: bold;">{{ link.name }}</span>
            </v-btn>
        </v-card>
        
        <!-- Logged in view -->
        <v-card v-else class="mr-8 ml-3 logo-buttons-placement">
        <v-card-title class="user-welcome"><h2 style="font-size: clamp(16px, 4vw, 50px);"><b>Szia {{ userData?.userName }}!</b></h2></v-card-title>
        <v-btn
                class="mx-1 mt-2 mb-4 pl-5 pr-5 auth-buttons"
                color="white"
                variant="text"
                @click="logout()"
                :loading="loggingOut">
                <v-icon class="mx-1" style="line-height: 0;">mdi-logout</v-icon>
                <span class="ml-1" style="line-height: 1.5; font-weight: bold;">Kijelentkezés</span>
          </v-btn>
        </v-card>
      </v-container>


      <v-container class="infoBoxok">
        <v-card class="nyitvaTartas">
            <v-card-title style="font-size: clamp(.8rem, 3dvw, 3rem);">Nyitvatartás:</v-card-title>
            <v-card-text style="display: flex; align-items: center; flex-direction: column; justify-content: center;">
              <p style="font-size: clamp(.8rem, 2dvw, 3rem);"><b>H-P:</b> 8:00 - 23:00</p>
              <p style="font-size: clamp(.8rem, 2dvw, 3rem);"><b>Sz:</b> 10:00 - 21:00</p>
              <p style="font-size: clamp(.8rem, 2dvw, 3rem);"><b>V:</b> 11:00 - 20:00</p>
            </v-card-text>
        </v-card>
        <v-card class="info">
          <v-card-text class="infoCard">
            <p style="font-size: clamp(.8rem, 1.5dvw, 3rem);"><b>Email:</b> donercegled@gmail.com</p>
            <p style="font-size: clamp(.8rem, 1.5dvw, 3rem);"><b>Tel szám.:</b> 06 20 123 4567</p>
            <p style="font-size: clamp(.8rem, 1.5dvw, 3rem);"><b>Cím:</b> 2700 Cegléd, Szabadság tér</p>
          </v-card-text>
          
          <div class="terkepInfo">
            <div class="terkep">
              <iframe class="terkepMeret"
                    width="100%"
                    frameborder="0"
                    scrolling="no"
                    marginheight="0"
                    marginwidth="0"
                    src="https://maps.google.com/maps?width=100%25&amp;height=400&amp;hl=en&amp;q=2700%20Cegl%C3%A9d,%20szabads%C3%A1g%20t%C3%A9r+(D%C3%B6ner%20Cegl%C3%A9d)&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed">
                <a href="https://www.gps.ie/">gps handsets</a>
              </iframe>
            </div>
          </div>
        </v-card>
      </v-container>
  </div>
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
  animation: 1s ease-out fade;
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

.user-welcome{
  background: linear-gradient(280deg, black 0%,#B71C1C 30%,#B71C1C 70%, black 100%);
  background-clip: 0;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.infoBoxok{
  width: 100dvw;
  max-width: 2000px;
  display: flex; 
  height: 52dvh;
}

.nyitvaTartas{
  padding: 1%;
  display: flex;
  flex-direction: column;
  width: 30dvw;
  margin: 2%;
  height: 96%;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 10px 2px #B71C1C inset,0 0 10px 5px #B71C1C;
  border: solid 3px #B71C1C;
  animation: 1s ease-out slideInFromLeft;
}

.info{
  padding: 1dvw;
  width: 70dvw;
  margin: 2%;
  height: 96%;
  display: flex;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 10px 2px #B71C1C inset,0 0 10px 5px #B71C1C;
  border: solid 3px #B71C1C;
  animation: 1s ease-out slideInFromRight;
}

.infoCard {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-evenly;
}

.terkepInfo{
  width: 50%;
  height: 100%;
}

.terkep{
  background-color: #f5f3f3;
  height: 100%;
  width: 100%;
  box-shadow: 0 0 5px .5px black;
}

.terkepMeret{
  height: 42dvh;
}


/* Mediaquery */
@media screen and (max-width: 1060px){
  .infoBoxok{
    flex-direction: column;
    margin: auto;
    justify-content: space-around;
    height: auto;
  }
  .nyitvaTartas{
    margin: auto;
    width: 90dvw;
    height: 20dvh;
    margin-bottom: 2dvh;
  }
  .info{
    margin: auto;
    width: 90dvw;
    height: 45dvh;
    margin-bottom: 3dvh;
    flex-direction: column;
  }
  .infoCard{
    height: 40%;
    width: 100%;
    align-items: center;
  }
  .terkepInfo{
    height: 60%;
    width: 100%;
    margin: auto;
    padding: 1%;
  }
  .terkep{
    height: 100%;
  }
  .terkepMeret{
    height: 22dvh;
  }
}

/* Animations */
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
  100% { opacity:1; }
}

@keyframes rotate {
  0% {
    transform: translate(-50%, -50%) rotateZ(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotateZ(360deg);
  }
}

@keyframes rotateccw {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(-360deg);
  }
}

@keyframes spin {
  0%,
  100% {
    box-shadow: .2em 0px 0 0px currentcolor;
  }
  12% {
    box-shadow: .2em .2em 0 0 currentcolor;
  }
  25% {
    box-shadow: 0 .2em 0 0px currentcolor;
  }
  37% {
    box-shadow: -.2em .2em 0 0 currentcolor;
  }
  50% {
    box-shadow: -.2em 0 0 0 currentcolor;
  }
  62% {
    box-shadow: -.2em -.2em 0 0 currentcolor;
  }
  75% {
    box-shadow: 0px -.2em 0 0 currentcolor;
  }
  87% {
    box-shadow: .2em -.2em 0 0 currentcolor;
  }
}
   
/* Loader css */
.loader {
  margin: auto;
  margin-top: 20dvh;
  transform: rotateZ(45deg);
  perspective: 1000px;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  color: #B71C1C;
}
.loader:before,.loader:after {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: inherit;
  height: inherit;
  border-radius: 50%;
  transform: rotateX(70deg);
  animation: 1s spin linear infinite;
}
.loader:after {
  color: white;
  transform: rotateY(70deg);
  animation-delay: .4s;
}
</style>