<script lang="ts" setup>
import type { ResetPasswordData } from '@/api/auth/auth';
import { usePasswordResetEmail } from '@/api/auth/authQuery';
import { useGetUserInfo, useUserNameChange } from "@/api/user/userQuery"
import {useGetAllPurchaseUserInfo} from "@/api/user/userQuery" 
import { useRouter } from 'vue-router'
import type { ChangeUserName } from '@/api/auth/auth';
import { onMounted, ref, computed} from 'vue';
import { toast } from 'vue3-toastify';

onMounted(() => {
  window.scrollTo(0, 0);
})


const notify = () => {
  toast.success("Sikeres felhasználónév változtatás!")
}


const { mutate: changeUserNameMutate, isPending: isUserNameChangePending } = useUserNameChange()
const { mutate: resetPasswordMutate, isPending: isPasswordResetPending } = usePasswordResetEmail()
const showPassword = ref<boolean>(false)
const showPasswordRe = ref<boolean>(false)
const { data: useGetUserInfodata, isError, error, isLoading } = useGetUserInfo()
const {data: purchases} = useGetAllPurchaseUserInfo();
const { push } = useRouter();

const ChangeUserNameRef = ref<ChangeUserName>({
  userName:'',
  password:'',
})

const ResetPasswordDataRef = ref<ResetPasswordData>({
    email: '',
})


const handlePwResetEmailSent = (ResetPasswordDataRef: ResetPasswordData) => {
    if(ResetPasswordDataRef.email == ''){
        toast.error("Hiányzó adatok, kérlek töltsd ki az összes mezőt mielőtt tovább haladsz!")
    }else{
        resetPasswordMutate(ResetPasswordDataRef,{
            onSuccess(){
                push({name:'email-sent-pw-change'})
                setTimeout(() => {
                        toast.success("Email sikeresen elküldve!")
                }, 100)
            },
            onError(error: any){
                toast.error(error.response?.useGetUserInfodata?.errmessage || "Valami hiba történt, kérjük próbáld meg újra!")
            }
        })
    }
}

const handleUserNameChange = (ChangeUserNameRef: ChangeUserName) => {
  if(ChangeUserNameRef.userName == '' || ChangeUserNameRef.password == ''){
      toast.error("Hiányzó adatok, kérlek töltsd ki az összes mezőt mielőtt tovább haladsz!")
  }else{
      changeUserNameMutate(ChangeUserNameRef,{
          onSuccess(){
              push({name:'Main'})
              setTimeout(() => {
                      toast.success("Sikeres bejelentkezés!");
              }, 100)
          },
          onError(error: any){
              toast.error(error.response?.useGetUserInfodata?.errmessage || "Valami hiba történt, kérjük próbáld meg újra!")
          }
      })
  }
}
const formattedPurchases = computed(() => {
  return JSON.stringify(purchases.value, null, 2); // JSON format with indentation
});

console.log("API Response:", JSON.stringify(purchases.value, null, 2));

</script>

<template>
  <div>
    <div v-if="isLoading" class="spinner"></div>

    <div v-else-if="isError">
      <v-card class="mt-8 logged-out" style="text-align: center;"><h1 style="font-size: clamp(12px, 2.5vh, 30px);"><b>Ahoz hogy megnézd és módosítsd az adataidat először be kell hogy jelentkezz!</b></h1></v-card>
    </div>

    
    <div v-else class="egesz">
      <div style=" width: 100%; padding: 10px;font-size: 2vw; height: auto; width: 95%; text-shadow: 1px 1px 0.5px rgba(0,0,0,0.2);">
      <div data-v-b4e148ca class="v-card v-theme--light v-card--density-default v-card--variant-elevated info2 text-h5 pa-12"
      style=" width: 100%">
      <div style="width: 100%;">
      <b>Felhasználó:</b> {{useGetUserInfodata.userName }} <br>
      <b>Teljes név:</b> {{useGetUserInfodata.fullName}}<br>
      <b>Email:</b> {{useGetUserInfodata.email}}<br>
      <b>Fiók készítése:</b> {{useGetUserInfodata.created}} <br>
      </div>
      <div style="width: 50%; flex: none; justify-items: center;">

      <b>Rendelési előzmények:</b><br>
      <v-container style="height: 100%;">
        <v-row style="display: flex;flex-direction: row-reverse; align-items: center;">
          <v-col cols="12" md="12" >
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
                  <v-toolbar title="Rendelések" style="height: auto; text-align: center; background: linear-gradient(to right, black, rgb(183, 28, 28), black); color: white;"></v-toolbar>
                  <v-card-text class="text-h4 pa-12" style="background-color: whitesmoke;">
                    <table>
                      <td>
                        <tr>
                          {{formattedPurchases}}
                        </tr>
                      </td>
                    </table>
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
      <div data-v-b4e148ca class=" v-card v-theme--light v-card--density-default v-card--variant-elevated info2 text-h5 pa-12"
      style="align-items: center; padding: 10px; width: 55%; font-size: 2vw; ">
      
      <b>Pontok:</b> {{useGetUserInfodata.points}}<br>
      <div class="field" style="text-align: center;">
      <div tabindex="-1" class="Tooltip" style="width: 10%;">
          <v-icon class="TooltipIcon">mdi-help-circle-outline</v-icon>
          <span class="TooltipText" style="overflow: visible;">Pontok a weboldalon lévő vásárlással érhetőek el</span>
      </div>
      </div>
      
      </div>
      <div data-v-b4e148ca class="div2 v-card v-theme--light v-card--density-default v-card--variant-elevated info2 text-h5 pa-12" 
      style="text-align: center; display: block; width: 55%; font-size: 2vw">
      <p><b>Fiókbeállítások:</b></p><br>
      <v-container style="height: auto;">
        <v-row style="display: flex;flex-direction: row-reverse; align-items: center;">
          <v-col cols="12" md="12" >
            <v-dialog
              transition="dialog-top-transition"
              width="auto"
            >
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                v-bind="activatorProps"
                text="Felhasználónév megváltoztatása"
                block
                style="padding-left: 20px; padding-right: 20px; width: 100%; font-size: 1vw; text-shadow: 1px 1px 0.5px rgba(0,0,0,0.2);"
              ></v-btn><br>
              </template>
              <template v-slot:default="{ isActive }">
                <v-card>
                  <v-toolbar title="Felhasználónév változtatás" style="height: auto; text-align: center; background: linear-gradient(to right, black, rgb(183, 28, 28), black); color: white;"></v-toolbar>
                  <v-card-text class="text-h4 pa-12" style="background-color: whitesmoke;">
                    <v-text-field v-model="ChangeUserNameRef.userName" label="Új Felhasználónév" variant="outlined" class="field"></v-text-field>
                    <v-text-field v-model="ChangeUserNameRef.password" label="Jelszó" variant="outlined" class="field" type="password"></v-text-field>
                  </v-card-text>

                  <v-card-actions class="justify-end" style="height: auto; background: linear-gradient(to right, black, rgb(183, 28, 28), black);">
                    <v-btn
                      text="MEGERŐSÍTÉS"
                      @click="handleUserNameChange(ChangeUserNameRef)"
                      style="color: whitesmoke; font-size: 1vw;"
                    ></v-btn>
                    <v-btn
                      text="Bezárás"
                      @click="isActive.value = false"
                      style="color: whitesmoke; font-size: 1vw; text-align: end;"
                    ></v-btn>
                    
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
            <v-dialog>
              <template v-slot:activator="{ props: activatorProps }">
              <v-btn 
                v-bind="activatorProps"
                text="Jelszó megváltoztatása"
                block
                style="padding-left: 20px; padding-right: 20px; width: 100%; font-size: 1vw; text-shadow: 1px 1px 0.5px rgba(0,0,0,0.2);"
                
              ></v-btn><br>
              </template>
              
              <template v-slot:default="{ isActive }">
                <v-card>
                  <v-toolbar title="Jelszó megváltoztatás" style="height: auto; text-align: center; background: linear-gradient(to right, black, rgb(183, 28, 28), black); color: white;"></v-toolbar>
                  <v-card-text class="text-h4 pa-12" style="background-color: whitesmoke;">
                    <v-text-field v-model="ResetPasswordDataRef.email" label="Email" variant="outlined" class="field" type="email"></v-text-field>
                  </v-card-text>

                  <v-card-actions class="justify-end" style="height: auto; background: linear-gradient(to right, black, rgb(183, 28, 28), black);">
                    <v-btn
                      text="MEGERŐSÍTÉS"
                      @click="handlePwResetEmailSent(ResetPasswordDataRef)"
                      style="color: whitesmoke; font-size: 1vw;"
                    ></v-btn>
                    <div>
                        <button @click="notify"></button>
                    </div>
                    <v-btn
                      text="Bezárás"
                      @click="isActive.value = false"
                      style="color: whitesmoke; font-size: 1vw; text-align: end;"
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

.logged-out{
  margin: auto;
  width: 90%;
  max-width: 1000px;
  height: 20dvh;
  background-color: #B71C1C;
  box-shadow: 0 0 40px 8px black inset, 0 0 5px 2px black;
  color: whitesmoke;
  text-shadow: 0 3px black;
  display: flex;
  align-items: center;
  justify-content: center;
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

.info2[data-v-b4e148ca] {
    width: 70%;
    margin: 2%;
    height:auto;
    display: flex;
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0 0 10px .5px #B71C1C;
}

.justify-end {
    justify-content: space-around !important;
}
</style>