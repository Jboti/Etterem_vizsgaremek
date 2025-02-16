<script lang="ts" setup>
import type { ResetPasswordData } from '@/api/auth/auth';
import { useLogout, usePasswordResetEmail, useValidateToken } from '@/api/auth/authQuery';
import { useGetUserInfo, useUserNameChange } from "@/api/user/userQuery"
import {useGetAllPurchaseUserInfo} from "@/api/user/userQuery" 
import { useRouter } from 'vue-router'
import type { ChangeUserName } from '@/api/auth/auth';
import { onMounted, ref, watch} from 'vue';
import { toast } from 'vue3-toastify';

const notify = () => {}

const { isError, mutate: validateToken } = useValidateToken()

const { mutate: changeUserNameMutate } = useUserNameChange()
const { mutate: resetPasswordMutate } = usePasswordResetEmail()
//majd még talán kell
// const showPassword = ref<boolean>(false)
// const showPasswordRe = ref<boolean>(false)
const { data: useGetUserInfodata, isLoading } = useGetUserInfo()
const { data: purchases } = useGetAllPurchaseUserInfo()
const { mutate: logout} = useLogout()
const { push } = useRouter()

const ChangeUserNameRef = ref<ChangeUserName>({
  userName:'',
  password:'',
})

const ResetPasswordDataRef = ref<ResetPasswordData>({
    email: '',
})


const handlePwResetEmailSent = () => {
  ResetPasswordDataRef.value.email = useGetUserInfodata.value.email
  resetPasswordMutate(ResetPasswordDataRef.value,{
    onSuccess(){
        logout()
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



onMounted(() => {
  window.scrollTo(0, 0)
  validateToken()
})
watch(isError, () => {})
</script>

<template>
  <div v-if="isError">
    <v-card class="mt-8 logged-out" style="text-align: center;"><h1 style="font-size: clamp(12px, 2.5vh, 30px);"><b>Ahoz hogy megnézd és módosítsd az adataidat először be kell hogy jelentkezz!</b></h1></v-card>
  </div>
  
  <div v-else-if="isLoading" class="spinner"></div>
    
    <div v-else class="page">
      
      <v-card class="user-info-box">
        <div class="user-info" v-if="useGetUserInfodata">
          <v-card-title><b>Felhasználó:</b> {{useGetUserInfodata.userName }}</v-card-title>
          <v-card-title><b>Teljes név:</b> {{useGetUserInfodata.fullName}}</v-card-title>
          <v-card-title><b>Email:</b> {{useGetUserInfodata.email}}</v-card-title>
          <v-card-title><b>Fiók készítése:</b> {{useGetUserInfodata.created}}</v-card-title>
          <v-card-title><b>Pontok:</b> {{useGetUserInfodata.points}}
          <v-tooltip text="Pontok a weboldalon lévő vásárlással érhetőek el">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" style="background-color: transparent; box-shadow: none; border-radius: 100%;"><v-icon>mdi-help</v-icon></v-btn>
            </template>
          </v-tooltip>
          </v-card-title>
          
        </div>
      
        <div class="order-info">
          <v-card-title><b>Rendelési előzmények:</b></v-card-title>
          <v-dialog>
            <!-- RENDELÉSI ELŐZMÉNY GOMB -->
            <template v-slot:activator="{ props: activatorProps }">
              <div style="text-align: center; width: 100%;">
                <v-btn
                  v-bind="activatorProps"
                  text="Megnyitás"
                  class="button"
                  ></v-btn>
              </div>
            </template>
            <!-- RENDELÉSI ELŐZMÉNY MODAL -->
            <template v-slot:default="{ isActive }">
              <v-card>
                <v-toolbar title="Rendelések" style="height: auto; text-align: center; background: linear-gradient(to right, black, rgb(183, 28, 28), black); color: white;"></v-toolbar>


                <v-card-text>
                  <v-row>
                    <v-col 
                      v-for="purchase in purchases" 
                      :key="purchase.id"  
                      cols="12" sm="12" md="12" xl="12">
                      <v-card color="#B71C1C" style="box-shadow: 0 0 20px 8px black inset, 0 0 5px 2px black; color: whitesmoke; max-width: 1000px; margin: auto;">
                        <v-card-title>Dátum: {{ purchase.purchase.date }}</v-card-title>
                        <v-card-title>Összeg: {{ purchase.purchase.totalPrice }} Ft</v-card-title>

                        <v-row>
                          <v-col 
                            v-for="dish in purchase.purchase.order_dishes" 
                            :key="dish.dish_id"  
                            cols="12" sm="12" md="12" xl="12">
                            <v-card>
                              <v-card-title v-if="dish.amount > 1">{{ dish.dish.name }} x {{ dish.amount }}</v-card-title>
                              <v-card-title v-else>{{ dish.dish.name }}</v-card-title>
                              <div v-if="dish.dish.type != 'Drink'">
                                <v-card-title>Szósz: {{ String(dish.customizations).split(',')[0] }}</v-card-title>
                                <div v-if="String(dish.customizations).split(',').length > 1">
                                  <v-card-title>Módosítás: {{ String(dish.customizations).split(',').splice(1,String(dish.customizations).split(',').length).join(', ') }}</v-card-title>
                                </div>
                              </div>
                            </v-card>
                          </v-col>
                        </v-row>

                        <v-btn>Újra rendelés</v-btn>
                      </v-card>
                    </v-col>
                  </v-row>
                  
                </v-card-text>
                
                <v-card-actions class="justify-end" style="height: auto; background: linear-gradient(to right, black, rgb(183, 28, 28), black);">

                  <v-btn
                  text="Bezárás"
                  @click="isActive.value = false"
                  style="color: whitesmoke;"></v-btn>

                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </div>
      </v-card>



   
      <v-card class="user-info-change-box">
        <v-card class="user-info-change">

          <v-card-title><b>Fiókbeállítások:</b></v-card-title>
          
          <v-dialog>
            <!-- FELHNÉV MÓDOSÍTÁS GOMB -->
            <template v-slot:activator="{ props: activatorProps }">
              <div style="width: 100%; text-align: center;">
                <v-btn
                v-bind="activatorProps"
                text="Felhasználónév megváltoztatása"
                class="button mb-6 mt-4"
                ></v-btn>
              </div>
            </template>
            <!-- FELHNÉV MÓDOSÍTÁS MODAL -->
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

          <div style="width: 100%; text-align: center;">
            <v-btn
              class="button"
              @click="handlePwResetEmailSent()">
            Jelszó megváltoztatása</v-btn>
          </div>
               
        </v-card>
                
          <div class="allergy-box">
            <v-card-title><b>Allergén beállítás:</b></v-card-title>
            <v-card style="padding: 1%; background-color: transparent; box-shadow: none;">
              <v-row>
                <v-checkbox label="Glutén érzékenység" color="success" style="width: 50%; margin: auto;" @change=""></v-checkbox>
                <v-checkbox label="Laktóz érzékenység" color="success" style="width: 50%; margin: auto;" @change=""></v-checkbox>
                <v-checkbox label="x érzékenység" color="success" style="width: 50%; margin: auto;" @change=""></v-checkbox>
                <v-checkbox label="y érzékenység" color="success" style="width: 50%; margin: auto;" @change=""></v-checkbox>
                <v-checkbox label="z érzékenység" color="success" style="width: 50%; margin: auto;" @change=""></v-checkbox>
                <v-checkbox label="dz érzékenység" color="success" style="width: 50%; margin: auto;" @change=""></v-checkbox>
                <div style="text-align: center; width: 100%; margin: 1%;">
                  <v-btn color="success">Mentés</v-btn>
                </div>
             
                
              </v-row>
            </v-card>
          </div>  
        
      </v-card>
  </div>
</template>

<style scoped>
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

.page{
  height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: .25s ease-in-out fade;
  transition: transform .5s ease-in-out, box-shadow .7s ease-in-out;
}

.user-info-box, .user-info-change-box{
  height: 40%;
  max-width: 1750px;
  width: 96%;
  margin: 2%;
  display: flex;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 10px .5px #B71C1C;
}

.user-info, .order-info, .user-info-change, .allergy-box{
  width: 50%;
  height: 100%;
}
.user-info{
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.order-info{
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.user-info-change{
  background-color: transparent;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.allergy-box{
  margin: auto;
  width: 46%;
  height: 96%;
}

.button{
  width: 75%;
  font-size: clamp(.6rem, 1.5dvw, 1.5rem);
  text-shadow: 1px 1px 0.5px rgba(0,0,0,0.2);
  
}

.button:hover{
  transform: scale(1.2);
}

.justify-end {
    justify-content: space-around !important;
}



@keyframes fade {
  0%   { opacity:0.01; }
  100% { opacity:1; }
}

@media only screen and (max-width: 800px) {
  .page{
    padding: 5%;
    margin-bottom: 15dvh;
    height: 100%;
  }
  .user-info-box, .user-info-change-box{
    flex-direction: column;
    margin-bottom:  5dvh;
  }
  .user-info-box{
    height: 35%;
  }
  .user-info-change-box{
    height: 47.5%;
    margin-bottom: 35%;
  }
  .user-info, .order-info, .user-info-change, .allergy-box{
    width: 98%;
    height: 100%;
  }
  .user-info, .user-info-change{
    margin: auto;
    border-bottom: solid black 2px;
    border-radius: 0;
  }
  .user-info-change,.order-info{
    justify-content: flex-start;
  }
}


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
.loader:before, .loader:after {
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
</style>