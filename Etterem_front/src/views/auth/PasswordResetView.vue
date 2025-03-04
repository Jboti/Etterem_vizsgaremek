<script lang="ts" setup>
import type {  emailVerifyData, SetPasswordData } from '@/api/auth/auth';
import { usePasswordReset } from '@/api/auth/authQuery';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

const { push } = useRouter()
const notify = () => {}
const {query} = useRoute()

const { mutate, isPending} = usePasswordReset()

const token = query.token as string
const showPassword = ref<boolean>(false)
const showPassword2 = ref<boolean>(false)

const PasswordResetDataRef = ref<SetPasswordData>({
    password: '',
    password_confirmation: ''
})


const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/ //min 8 hosszú, min 1 kis betű, min 1 nagy betű, min 1 szám
    return passwordRegex.test(password)
}

const handlePasswordReset = (PasswordResetDataRef : SetPasswordData) => {
    if( PasswordResetDataRef.password == '' || PasswordResetDataRef.password_confirmation == ''){
        toast.error("Hiányzó adatok, kérlek töltsd ki az összes mezőt mielőtt tovább haladsz!")
    }else if(PasswordResetDataRef.password != PasswordResetDataRef.password_confirmation){
        toast.error("A két jelszó eltérő!")   
    }else if (!validatePassword(PasswordResetDataRef.password)){
        toast.error("Nem megfelelő formátumú jelszó!")
    }else{
        mutate({token:token, data: PasswordResetDataRef},{
            onSuccess(){
                push({ name: 'Bejelentkezés' })
                setTimeout(() => {
                    toast.success("Sikeres jelszó módosítás!")
                }, 100)
            },
            onError(error: any){
                toast.error(error)
            }
        })
    }
}
</script>


<template>
    <v-container class="" style=" height: 75%; width: 90%; max-width: 1000px; min-width: 375px; min-height: 600px;">
        <v-card class="bg-red-darken-4 card" outlined>
            <v-card-title class="pb-6 pt-4 title"><h2 style="text-shadow: 2px 2px 2px black; color: whitesmoke; font-size: clamp(20px, 6vw, 50px);"><b>Jelszó megváltoztatása</b></h2></v-card-title>
            <v-card-text>
                <v-text-field class="ml-10 mr-10"
                        v-model="PasswordResetDataRef.password"
                        label="Jelszó"
                        variant="outlined"
                        :type="showPassword ? 'text' : 'password'"
                        :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append-inner="showPassword = !showPassword"
                ></v-text-field>
                <v-text-field class="ml-10 mr-10"
                        v-model="PasswordResetDataRef.password_confirmation"
                        label="Jelszó újra"
                        variant="outlined"
                        :type="showPassword2 ? 'text' : 'password'"
                        :append-inner-icon="showPassword2 ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append-inner="showPassword2 = !showPassword2"
                ></v-text-field>
            </v-card-text>
            <div class="buttons">
                <div style="text-align: center;">
                    <v-btn @click="handlePasswordReset(PasswordResetDataRef)" :loading="isPending" class="white pl-4 pr-4 mt-2 mb-6 logButton" style="font-weight: bolder; box-shadow: 0 0 5px 2px black; background-color: whitesmoke; color: black;">
                        Jelszó megváltoztatása
                    </v-btn>
                </div>

            </div>
        </v-card>
    </v-container>
    <div>
        <button @click="notify"></button>
    </div>
</template>

<style scoped>

.card{
    box-shadow: 0 0 40px 8px black inset, 0 0 5px 2px black; 
    min-height: 62.5%;
    width: 100%;
    border-radius: 10px;
    animation: 1.5s ease-out 0s 1 fade;
}

.title{
    text-align: center;
    animation: 1s ease-in slideInFromTop;
}

.buttons{
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: 1s ease-in slideInFromBottomAndFade;
}

.logButton{
    box-shadow: 0 0 5px 2px black;
    transition: transform 0.7s ease-in-out;
}

.logButton:hover{
    box-shadow: 0 0 5px .5px black inset, 0 0 10px 5px black !important;
    transform: scale(1.2);
}

/* Animations */
@keyframes fade {
  0%   { opacity:0; }
  100% { opacity:1; }
}
@keyframes slideInFromTop {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0);
  }
}
@keyframes slideInFromBottomAndFade {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>