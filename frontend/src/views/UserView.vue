<script lang="ts" setup>
import type { ResetPasswordData } from '@/api/auth/auth';
import { useLogout, usePasswordResetEmail, useValidateToken } from '@/api/auth/authQuery';
import { useDeleteUser, useDeleteUserPwConfirm, useGetUserInfo, useUpdateAllergies, useUserNameChange } from "@/api/user/userQuery"
import {useGetAllPurchaseUserInfo} from "@/api/user/userQuery" 
import { useRouter } from 'vue-router'
import type { ChangeUserName } from '@/api/auth/auth';
import { onMounted, ref, watch} from 'vue';
import { toast } from 'vue3-toastify';
import type { allergies, DeleteUserData } from '@/api/user/user';
import { useCartStore } from '@/stores/cartStore';

const { push } = useRouter()
const cartStore = useCartStore()
const notify = () => {}

// Api hívások

// Query hook-ok
const { isError, mutate: validateToken } = useValidateToken()
const { data: purchaseData } = useGetAllPurchaseUserInfo()
const { data: userInfoData, isLoading } = useGetUserInfo()

// Mutation hook-ok
const { mutate: changeUserNameMutate } = useUserNameChange()
const { mutate: resetPasswordMutate } = usePasswordResetEmail()
const { mutate: deleteUserMutate } = useDeleteUser()
const { mutate: deleteUserPwConfirmMutate } = useDeleteUserPwConfirm()
const { mutate: updateAllergies } = useUpdateAllergies()
const { mutate: logout} = useLogout()


const showPassword = ref<boolean>(false)

const ChangeUserNameRef = ref<ChangeUserName>({
  userName:'',
  password:'',
})

const ResetPasswordDataRef = ref<ResetPasswordData>({
  email: '',
})

const DeleteUserDataRef = ref<DeleteUserData>({
  email: '',
  password: '',
})

const userAllergiesRef = ref<allergies>({
  gluten: false,
  lactose: false,
  egg: false,
  nuts: false,
})

watch(() => userInfoData.value, (newUserData) => {
  if (newUserData && newUserData.allergenables) {
    userAllergiesRef.value = {
      gluten: newUserData.allergenables.some((a: any) => a.allergy.name === 'gluten'),
      lactose: newUserData.allergenables.some((a: any) => a.allergy.name === 'lactose'),
      egg: newUserData.allergenables.some((a: any) => a.allergy.name === 'egg'),
      nuts: newUserData.allergenables.some((a: any) => a.allergy.name === 'nuts'),
    };
  }
}, { immediate: true })

// Handler-ek

const handlePwResetEmailSend = () => {
  ResetPasswordDataRef.value.email = userInfoData.value.email
  resetPasswordMutate(ResetPasswordDataRef.value,{
    onSuccess(){
        logout()
        push({name:'email-sent-pw-change'})
        setTimeout(() => {
          toast.success("Email sikeresen elküldve!")
        }, 100)
    },
    onError(error: any){
        toast.error(error.response?.userInfoData?.errmessage || "Valami hiba történt, kérjük próbáld meg újra!")
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
                  toast.success("Sikeres felhasználónév módosítás!")
              }, 100)
          },
          onError(error: any){
              toast.error(error.response?.userInfoData?.errmessage || "Valami hiba történt, kérjük próbáld meg újra!")
          }
      })
  }
}

const reOrderHandler = (purchase : any) =>{
  cartStore.reOrder(purchase.purchase)
  push({name:'Order'})
  setTimeout(() => {
    toast.success("Sikeresen a kosárba rakta az előzőleg is megrendelt termekeket!")
  },100)
}

const handleDeleteUser = (data : DeleteUserData) =>{
  if(data.password == '' || data.password == ' ')
    toast.error("Üres mező!")
  else
  {
    data.email = userInfoData.value.email
    deleteUserPwConfirmMutate(data,{
      onSuccess(){
        deleteUserMutate(undefined,{
          onSuccess(){
            push({name:'Main'})
            setTimeout(() => {
              toast.success("A felhasználó törölve lett!")
            }, 100)
          },
          onError(){
            toast.error("Valami hiba történt kérlek próbáld újra!")
          }
        })
      },
      onError(error){
        toast.error("Hibás jelszó!")
      }
    })
  }
}

const handleAllergiesChange = (algs: allergies) => {
  updateAllergies(algs,{
    onSuccess(){
      toast.success("Sikeres módosítás!")
    },
    onError(err){
      toast.error("Valami hiba történt kérlek próbáld újra!")
    }
  })
}


onMounted(() => {
  window.scrollTo(0, 0)
  validateToken()
})
</script>


<template>
  <div v-if="isError">
    <v-card class="mt-8 logged-out" style="text-align: center;">
      <h1 style="font-size: clamp(12px, 2.5vh, 30px);">
        <b>Ahoz hogy megnézd és módosítsd az adataidat először be kell hogy jelentkezz!</b>
      </h1>
    </v-card>
  </div>
  
  <div v-else-if="isLoading" class="spinner"></div>
    
  <div v-else class="page">
      
    <!-- Felhasználó adatok -->
    <v-card class="user-info-box">
      <v-card class="user-info" v-if="userInfoData">
        <v-card-title><b>Felhasználó:</b> {{userInfoData.userName }}</v-card-title>
        <v-card-title><b>Teljes név:</b> {{userInfoData.fullName}}</v-card-title>
        <v-card-title><b>Email:</b> {{userInfoData.email}}</v-card-title>
        <v-card-title><b>Fiók készítése:</b> {{userInfoData.created}}</v-card-title>
        <v-card-title style="display: flex;"><b>Pontok:</b>&nbsp;{{userInfoData.points}}
          <v-tooltip text="Pontokat minden elköltött 100 Ft után kapsz!">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                style="background-color: transparent; box-shadow: none; border-radius: 100%; height: auto;"
              >
                <v-icon>mdi-help</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </v-card-title>
      </v-card>
  
      <!-- Rendelési előzmények -->
      <v-card class="order-info">
        <v-card-title><b>Rendelési előzmények:</b></v-card-title>
        <v-dialog style="background-color: rgba(0, 0, 0, 0.6);" @click:outside="">
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
            <v-card style="width: 100%; margin: auto;max-width:1250px; background-color: rgba(255, 255, 255, .9);  box-shadow: 0 0 10px 5px black;">
              <v-toolbar title="Rendelések" color="#B71C1C" style="height: auto; text-align: center; color: black; position: sticky; top: 0; z-index: 10; box-shadow: 0 5px 15px -3px black,  0 5px 15px -3px  black inset; border-bottom-left-radius: 15px; border-bottom-right-radius: 15px; box-shadow: 0 0 10px .5px black; ">
                <v-btn
                @click="isActive.value = false"
                style="color: black; "><v-icon>mdi-close</v-icon></v-btn>
              </v-toolbar>
              <v-card-text>
                <v-row>
                  <v-col 
                    v-for="purchase in [...purchaseData].reverse()" 
                    :key="purchase.id"  
                    cols="12" sm="12" md="12" xl="12">
                    <v-card color="#B71C1C" style="box-shadow: 0 0 8px 4px black inset, 0 0 5px 2px black; color: whitesmoke; max-width: 1000px; margin: auto; padding: 1%;">
                      <v-card-title class="multiline-text">Dátum: {{ new Date(purchase.purchase.date).toLocaleString('hu-HU', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}}</v-card-title>
                      <div v-if="purchase.purchase.takeAway">
                        <v-card-title class="multiline-text">Összeg: {{ purchase.purchase.totalPrice-100 }} + 100 Ft</v-card-title>
                        <v-card-subtitle class="multiline-text mb-4">Elvitel</v-card-subtitle>
                      </div>
                      
                      <v-card-title class="multiline-text mb-4" v-else>Összeg: {{ purchase.purchase.totalPrice }} Ft</v-card-title>
                      <v-row>
                        <v-col 
                          v-for="dish in purchase.purchase.order_dishes" 
                          :key="dish.dish_id"
                          style="padding: 1dvh;"  
                          cols="12" sm="12" md="12" xl="12">
                          <v-card class="ml-4 mr-4" style="background-color: rgba(255, 255, 255, .9); border-radius: 10px; box-shadow: 0 0 5px 2px black;">
                            <v-card-title v-if="dish.amount > 1" class="multiline-text">{{ dish.dish.name }} x {{ dish.amount }}</v-card-title>
                            <v-card-title v-else class="multiline-text">{{ dish.dish.name }}</v-card-title>
                            <div v-if="dish.dish.type != 'Drink' && dish.dish.type != 'SideDish'">
                              <div v-if="String(dish.customizations).split(',').length > 1">
                                <v-card-title>Szósz: <v-card-subtitle class="multiline-text">{{ String(dish.customizations).split(',')[0].substring(1) }}</v-card-subtitle></v-card-title>
                                <v-card-title>Módosítás: <v-card-subtitle class="multiline-text">{{ String(dish.customizations).split(',').splice(1).join(',').slice(0,-1) }}</v-card-subtitle></v-card-title>
                              </div>
                              <v-card-title v-else>Szósz: <v-card-subtitle class="multiline-text">{{ String(dish.customizations).split(',')[0].slice(1,-1) }}</v-card-subtitle></v-card-title>
                            </div>
                          </v-card>
                        </v-col>
                      </v-row>

                      <v-btn @click="reOrderHandler(purchase)" class="mx-4 mb-4 mt-6 re-order-button" color="success">Újra rendelés</v-btn>
                    </v-card>
                  </v-col>
                </v-row>
                
              </v-card-text>
              </v-card>
            </template>
          </v-dialog>
        </v-card>
      </v-card>



   
      <v-card class="user-info-change-box">

        <!-- Fiók beállítások -->
        <v-card class="user-info-change">
          <v-card-title><b>Fiókbeállítások:</b></v-card-title>
          <v-dialog>
            <!-- FELHNÉV MÓDOSÍTÁS GOMB -->
            <template v-slot:activator="{ props: activatorProps }">
              <div style="width: 100%; text-align: center;">
                <v-btn
                v-bind="activatorProps"
                text="Felhasználónév megváltoztatása"
                class="button mb-4 mt-4"
                ></v-btn>
              </div>
            </template>
            <!-- FELHNÉV MÓDOSÍTÁS MODAL -->
            <template v-slot:default="{ isActive }">
              <v-card style="width: 100%; margin: auto;max-width:500px; background-color: rgba(255, 255, 255, .9);  box-shadow: 0 0 10px 5px black;">
                <v-toolbar title="Felhasználónév változtatás" style="height: auto; text-align: center; background: linear-gradient(to right, black, rgb(183, 28, 28), black); color: white;"></v-toolbar>
                <v-card-text class="text-h4 pa-12" style="background-color: whitesmoke;">
                  <v-text-field v-model="ChangeUserNameRef.userName" label="Új Felhasználónév" variant="outlined" class="field"></v-text-field>
                  <v-text-field class="field"
                    v-model="ChangeUserNameRef.password"
                    label="Jelszó"
                    variant="outlined"
                    :type="showPassword ? 'text' : 'password'"
                    :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="showPassword = !showPassword"
                  ></v-text-field>
                </v-card-text>
                
                <v-card-actions style="display: flex; justify-content: space-between; height: auto; background-color: whitesmoke; border-top: 2px solid black; width: 95%; margin: auto;">
                  <v-btn
                  color="error"
                  text="Bezárás"
                  @click="isActive.value = false"
                  style="font-size: clamp(.6rem, 1.4dvw, 1rem); font-weight: bold;"
                  ></v-btn>
                  <v-btn
                  color="success"
                  text="Megerősítés"
                  @click="handleUserNameChange(ChangeUserNameRef)"
                  style="font-size: clamp(.6rem, 1.4dvw, 1rem); font-weight: bold;"
                  ></v-btn>
                  
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>

          
          
          <div style="width: 100%; text-align: center;">
            <v-btn
            class="button"
            @click="handlePwResetEmailSend()">
            Jelszó megváltoztatása</v-btn>
          </div>
          

          <v-dialog>
            <!-- USER TÖRLÉS GOMB -->
            <template v-slot:activator="{ props: activatorProps }">
              <div style="width: 100%; text-align: center;">
                <v-btn
                v-bind="activatorProps"
                text="Fiók törlése"
                class="button mb-6 mt-8"
                color="red"
                ></v-btn>
              </div>
            </template>
            <!-- USER TÖRLÉS MODAL -->
            <template v-slot:default="{ isActive }">
              <v-card style="width: 100%; margin: auto;max-width:750px; background-color: rgba(255, 255, 255, .9);  box-shadow: 0 0 10px 5px black;">
                <div style="padding: 2.5%; text-align: center;">
                  <v-card-title class="multiline-text">Biztos törölni akarod a felhasználódat?</v-card-title>
                  <v-card-title class="multiline-text" style="color: red; text-shadow: 0 1px 1px black;"><b>A művelet nem visszafordítható!</b></v-card-title>
                  <v-text-field v-model="DeleteUserDataRef.password" label="Jelszó" type="password" variant="outlined" class="field pt-4" style="width: 50%; margin: auto;"></v-text-field>
                </div>
                <v-card-actions style="display: flex; justify-content: space-between; height: auto; background-color: whitesmoke; border-top: 2px solid black; width: 95%; margin: auto;">
                  <v-btn
                  color="error"
                  text="Bezárás"
                  @click="isActive.value = false"
                  style="font-size: clamp(.6rem, 1.4dvw, 1rem); font-weight: bold;"
                  ></v-btn>
                  <v-btn
                  class="delete-button"
                  color="success"
                  text="Megerősités"
                  @click="handleDeleteUser(DeleteUserDataRef)"
                  ></v-btn>
                  
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>

        </v-card>
                
        <!-- Allergia beállítások -->
        <v-card class="allergy-box">
            <v-card style="background-color: transparent; box-shadow: none; display: flex; flex-direction: column; align-items: center; width: 100%; height: 100%;">
              <v-card-title style="text-align: center;"><b>Allergiák beállítása:</b></v-card-title>
              
              <v-card-text class="allergy-grid px-2">
                <v-checkbox label="Glutén érzékenység" color="success" v-model="userAllergiesRef.gluten"  hide-details></v-checkbox>
                <v-checkbox label="Laktóz érzékenység" color="success" v-model="userAllergiesRef.lactose"  hide-details></v-checkbox>
                <v-checkbox label="Tojás érzékenység" color="success" v-model="userAllergiesRef.egg"  hide-details></v-checkbox>
                <v-checkbox label="Földimogyoró érzékenység" color="success" v-model="userAllergiesRef.nuts"  hide-details></v-checkbox>
              </v-card-text>
              <div style="text-align: center; margin-top: 10px;">
                <v-btn class="button" color="success" style="width: 100%;" @click="handleAllergiesChange(userAllergiesRef)">Mentés</v-btn>
              </div>
              <v-card-subtitle class="multiline-text my-2" style="display: flex; align-items: center;">
              <v-icon class="mr-2" color="error">mdi-exclamation-thick</v-icon> Ez az icon fogja jelölni az ételeket, amikre allergiás lehetsz!
                </v-card-subtitle>
            </v-card>
        </v-card>
      </v-card>
  </div>
  <div>
      <button @click="notify"></button>
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
  animation: .25s ease-in-out fade;
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
  background-color: transparent;
  box-shadow: none;
}

.user-info, .order-info, .user-info-change, .allergy-box{
  width: 46%;
  height: 96%;
  margin: 2%;
  margin: auto;
  box-shadow: 0 0 5px .5px #B71C1C inset,0 0 2.5px 5px #B71C1C;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.order-info,.user-info-change{
  align-items: center;
}

.allergy-grid{
  display: grid;
  justify-items: center;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  padding: 0;
}

.button{
  width: 75%;
  font-size: clamp(.6rem, 1.4dvw, 1.5rem);
  text-shadow: 1px 1px 0.5px rgba(0,0,0,0.2);
}

.button:hover{
  transform: scale(1.2);
}

.multiline-text{
  margin: auto;
  word-wrap: break-word;
  white-space: normal;
  overflow: visible;
  opacity: 1;
}

.re-order-button{
  font-weight: bold;
  box-shadow: 0 0 4px 2px black;
}
.re-order-button:hover{
  transform: scale(1.1);
  box-shadow: 0 0 4px 2px black;
}

.delete-button{
  font-size: clamp(.6rem, 1.4dvw, 1rem);
  font-weight: bold;
}

.delete-button:hover{
  animation: warn 1.5s ease-in-out infinite;
  color: red !important;
}

/* Media query */
@media only screen and (max-width: 800px) {
  .page{
    padding: 5%;
    margin-bottom: 15dvh;
    height: 100%;
  }
  .user-info-box, .user-info-change-box{
    flex-direction: column;
    height: auto;
    margin-bottom:  4dvh;
  }
  .user-info, .order-info, .user-info-change, .allergy-box{
    width: 96%;
    height: auto;
    padding-bottom: 2dvh;
    margin-top: 1dvh;
    margin-bottom: 2dvh;
  }
  
  .user-info-change,.order-info{
    justify-content: flex-start;
  }

  .allergy-grid {
    grid-template-columns: 1fr;
    width: 100%;
  }

  .allergy-grid .v-checkbox {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}

/* Animations */
@keyframes fade {
  0%   { opacity:0.01; }
  100% { opacity:1; }
}

@keyframes warn {
  0% { transform: scale(1);}
  50% { transform: scale(1.25);}
  100% { transform: scale(1);}
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
</style>