<script lang="ts" setup>
import { useGetUserInfo } from "@/api/user/userQuery"
import { useRouter } from 'vue-router'

const { data, isError, error, isLoading } = useGetUserInfo()
const { push } = useRouter();
</script>

<template>
  <div>
    <div v-if="isLoading" class="spinner"></div>

    <div v-else-if="isError">
      <v-card>
        <h1>Hiba a validáció során, kérlek jelentkezz be újra!</h1>
        <h2>{{ data }}</h2>
      </v-card>
      <!-- <p>{{ error?.response?.data?.errmessage || "An error occurred." }}</p> -->
    </div>

    
    <div v-else class="egesz">
      <div style=" padding: 10px;font-size: 2vw; height: auto; width: 95%; text-shadow: 1px 1px 0.5px rgba(0,0,0,0.2);">
      <div data-v-b4e148ca class="v-card v-theme--light v-card--density-default v-card--variant-elevated info text-h5 pa-12"
      style="  width: 100%; ">
      <div style="width: 100%;">
      <b>Felhasználó:</b> {{data.userName }} <br>
      <b>Teljes név:</b> {{data.fullName}}<br>
      <b>Email:</b> {{data.email}}<br>
      <b>Fiók készítése:</b> {{data.created}} <br>
      </div>
      <div style="width: 50%; flex: none;">

      Rudolf<br>
      <v-container style="height: 100%;">
        <v-row style="display: flex;flex-direction: row-reverse; align-items: center;">
          <v-col cols="12" md="10" >
            <v-dialog
              transition="dialog-top-transition"
              width="auto"
            >
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                  v-bind="activatorProps"
                  text="További információ"
                  block
                  style="padding-left: 20px; padding-right: 20px; width: 100%; font-size: 1vw; text-shadow: 1px 1px 0.5px rgba(0,0,0,0.2);"

                ></v-btn>
              </template>
              <template v-slot:default="{ isActive }">
                <v-card>
                  <v-toolbar title="Kuponok" style="height: auto; text-align: center; background: linear-gradient(to right, black, rgb(183, 28, 28), black); color: white;"></v-toolbar>
                  <v-card-text class="text-h4 pa-12" style="background-color: whitesmoke;">
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                      exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                      dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                  </v-card-text>

                  <v-card-actions class="justify-end" style="height: auto; background: linear-gradient(to right, black, rgb(183, 28, 28), black);">
                    <v-btn
                      text="Bezárás"
                      @click="isActive.value = false"
                      style="color: whitesmoke;"
                    ></v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </v-col>
        </v-row>
      </v-container>
      </div>
      </div>
      <div  class="div1" style="display: inline-flex; width:104%; text-shadow: 1px 1px 0.5px rgba(0,0,0,0.2); overflow: visible;">
      <div data-v-b4e148ca class=" v-card v-theme--light v-card--density-default v-card--variant-elevated info text-h5 pa-12"
      style="align-items: center; padding: 10px; width: 55%; font-size: 2vw; ">
      
      <b>Pontok:</b> {{data.points}}<br>
      <div class="field" style="text-align: center;">
      <div tabindex="-1" class="Tooltip" style="width: 10%;">
          <v-icon class="TooltipIcon">mdi-help-circle-outline</v-icon>
          <span class="TooltipText" style="overflow: visible;">Pontok a weboldalon lévő vásárlással érhetőek el</span>
      </div>
      </div>
      
      </div>
      <div data-v-b4e148ca class="div2 v-card v-theme--light v-card--density-default v-card--variant-elevated info text-h5 pa-12" 
      style="text-align: center; display: block; width: 55%; font-size: 2vw">
      <p><b>Fiókbeállítások:</b></p><br>
      <v-btn
          text="Felhasználónév megváltoztatása"
          block
          style="padding-left: 20px; padding-right: 20px; width: 100%; font-size: 1vw; text-shadow: 1px 1px 0.5px rgba(0,0,0,0.2);"
          @click="push()"
        ></v-btn><br>
        <v-btn
          text="Jelszó megváltoztatása"
          block
          style="padding-left: 20px; padding-right: 20px; width: 100%; font-size: 1vw; text-shadow: 1px 1px 0.5px rgba(0,0,0,0.2);"
          @click="push({name:'password-reset-email'})"
        ></v-btn><br>

      </div>
      </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.spinner {
  margin: auto;
  margin-top: 10vh;
  width: 50px;
  height: 50px;
  border: 6px solid #f3f3f3; 
  border-top: 6px solid #B71C1C; 
  border-radius: 50%; 
  animation: spin 1s linear infinite;
}

.Tooltip {
    position: relative;
    display: inline-block;
    width: 100%;
    color: white;
    animation: 2s ease fade;
    overflow: visible;
    z-index: 1;
}

.TooltipIcon:hover{
    cursor: pointer;
}

.Tooltip .TooltipText {
    visibility: hidden;
    font-size: medium;
    background-color: rgba(255, 255, 255, .9);
    color: black;
    text-align: center;
    padding: 5%;
    border-radius: 6px;
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 2;
    
}
  
.Tooltip:hover .TooltipText {
    visibility: visible;
    display: block;
}

.egesz{
  animation: .25s ease-in-out fade;
  transition: transform .5s ease-in-out, box-shadow .7s ease-in-out;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes fade {
  0%   { opacity:0.01; }
  100% { opacity:1; }
}

.buttons{
  width: 100%;
  display: flex !important;
  flex-wrap: nowrap;
  align-items: center;
  transition: all 0.5s ease-in-out;
}

@media only screen and (max-width: 768px) {
   .div1{
    justify-items: center;
    width: 100% !important;
    display: inline-block !important;
  }
}

.info[data-v-b4e148ca] {
    width: 70%;
    margin: 2%;
    height:auto;
    display: flex;
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0 0 10px .5px #B71C1C;
}
</style>