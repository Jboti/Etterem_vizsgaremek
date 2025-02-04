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

    
    <div v-else>
      <div style=" padding: 10px; height: auto; width: 90%; text-shadow: 1px 1px 0.5px rgba(0,0,0,0.2);">
      <div data-v-b4e148ca class="v-card v-theme--light v-card--density-default v-card--variant-elevated info text-h5 pa-12"
      style="padding: 10px; width: 100%; font-size: 2vw; height: auto; ">
      <b>Felhasználó:</b> {{data.userName }} <br>
      <b>Teljes név:</b> {{data.fullName}}<br>
      <b>Email:</b> {{data.email}}<br>
      <b>Fiók készítése:</b> {{data.created}} <br>
      </div>
      <div style="display: flex; text-shadow: 1px 1px 0.5px rgba(0,0,0,0.2);">
      <div data-v-b4e148ca class="v-card v-theme--light v-card--density-default v-card--variant-elevated info text-h5 pa-12"
      style="padding: 10px; width: 50%; font-size: 2vw; ">
      <b>Pontok:</b> {{data.points}}<br>

      <v-container style="height: 100%;">
        <v-row >
          <v-col cols="12" md="6" >
            <v-dialog
              transition="dialog-top-transition"
              width="auto"
            >
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                  v-bind="activatorProps"
                  text="Beváltás"
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
      <div data-v-b4e148ca class="v-card v-theme--light v-card--density-default v-card--variant-elevated info text-h5 pa-12" 
      style="padding: 10px; width: 50%; font-size: 2vw">
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

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>