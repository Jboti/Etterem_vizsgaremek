<script lang="ts" setup>
import type { RegistrationData } from '@/api/auth/auth'
import { useRegistration } from '@/api/auth/authQuery'
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const { push } = useRouter()
const { mutate, isPending } = useRegistration()
const showPassword = ref<boolean>(false)
const showPasswordRe = ref<boolean>(false)

const registrationDataRef = ref<RegistrationData>({
   userName: '',
   fullName: '',
   email: '',
   password: '',
   passwordRe: ''
})


const notify = () => {
    toast.success("Sikeres regisztráció!")
}


const validateUsername = (userName: string): boolean => {
    const userNameRegex = /^[A-Za-záÁéÉöÖőŐóÓüÜűŰúÚ][A-Za-z0-9_áÁéÉöÖőŐóÓüÜűŰúÚ]{5,18}$/ //min 6 hosszú, max 18 hosszú, ne kezdődjön számmal
    return userNameRegex.test(userName)
}

const validateEmail = (email: string): boolean => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
    return emailRegex.test(email)
}

const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/ //min 8 hosszú, min 1 kis betű, min 1 nagy betű, min 1 szám
    return passwordRegex.test(password)
}
    
const handleRegister = (registrationDataRef: RegistrationData) => {
    if (registrationDataRef.email == '' || registrationDataRef.fullName == '' || registrationDataRef.password == '' || registrationDataRef.userName == '' || registrationDataRef.passwordRe == '') {
        toast.error("Hiányzó adatok, kérlek töltsd ki az összes mezőt mielőtt tovább haladsz!")
    } else if (registrationDataRef.password != registrationDataRef.passwordRe) {
        toast.error("A két jelszó eltérő!")
    }else if (!validateUsername(registrationDataRef.userName)){
        toast.error("A felhasználónév hossza 6-18 között kell hogy legyen, illetve csak betűvel kezdődhet és nem tartalamzhat speciális karaktereket!")
    } else if (!validateEmail(registrationDataRef.email)){
        toast.error("Nem megfelelő formátumú email!")
    } else if (!validatePassword(registrationDataRef.password)){
        toast.error("Nem megfelelő formátumú jelszó!")
    }else {
        mutate(registrationDataRef, {
            onSuccess(){
                push({ name: 'email-sent' })
                setTimeout(() => {
                    toast.success("Sikeres regisztráció!")
                }, 100)
            },
            onError(error: any) {
                toast.error(error.response?.data?.errmessage || "Valami hiba történt, kérjük próbáld meg újra!")
            },
        })
    }
}


</script>

<template>
    <v-container style=" width: 100%; max-width: 1000px;">
        <v-card class="bg-red-darken-4 pb-4 card" outlined>
        <v-card-title style="text-align: center;" class="pb-6 pt-4 title"><h2 style="text-shadow: 2px 2px 2px black; color: whitesmoke; font-size: clamp(20px, 6vw, 50px);"><b>Regisztráció</b></h2></v-card-title>
            <v-card-text class="form">
                <div style="width: 50%;">
                    <v-text-field v-model="registrationDataRef.userName" label="Felhasználó név" variant="outlined" class="field"></v-text-field>
                    <v-text-field v-model="registrationDataRef.fullName" label="Teljes név" variant="outlined" class="field"></v-text-field>
                    <v-text-field v-model="registrationDataRef.email" label="Email" variant="outlined" class="field"></v-text-field>
                </div>
                <div style="width: 50%;">
                    <div class="field" style="text-align: center; margin-bottom: 1%;">
                        <div tabindex="-1" class="Tooltip">
                            <v-icon class="TooltipIcon">mdi-help-circle-outline</v-icon>
                            <span class="TooltipText">Minimum 8 karakter hosszú,</br> Minimum 1 kis és nagy betű,</br> Minimum 1 szám</span>
                        </div>
                    </div>
                    <v-text-field class="field"
                    v-model="registrationDataRef.password"
                    label="Jelszó"
                    variant="outlined"
                    :type="showPassword ? 'text' : 'password'"
                    :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="showPassword = !showPassword"
                    ></v-text-field>
                    <v-text-field class="field"
                    v-model="registrationDataRef.passwordRe"
                    label="Jelszó megerősítése"
                    variant="outlined"
                    :type="showPasswordRe ? 'text' : 'password'"
                    :append-inner-icon="showPasswordRe ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="showPasswordRe = !showPasswordRe"
                    ></v-text-field>
                </div>
            </v-card-text> 
            <div class="button" style="text-align: center;">
                <v-btn @click="handleRegister(registrationDataRef)" :loading="isPending" class="white pl-4 pr-4 mt-4 regButton">
                    Regisztráció
                </v-btn>
            </div>
        </v-card>
    </v-container>
    <div>
        <button @click="notify"></button>
    </div>
</template>

<style scoped>

.Tooltip {
    position: relative;
    display: inline-block;
    width: 100%;
    color: white;
    animation: 2s ease fade;
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
    left: 0em;
    
}
  
.Tooltip:hover .TooltipText {
    visibility: visible;
}

.title{
    animation: 1s ease-in slideInFromTop;
}

.button{
    animation: 1s ease-in slideInFromBottomAndFade;

}

.card{

    animation-fill-mode: forwards;
    box-shadow: 0 0 40px 8px black inset, 0 0 5px 2px black; 
    min-height: 62.5%;
    width: 100%;
    border-radius: 10px;
    animation: 1.5s ease-out 0s 1 fade;
    will-change: opacity, transform;
}

.form{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;
    padding: 0;
}

.regButton{
    font-weight: bolder;
    box-shadow: 0 0 5px 2px black;
    transition: transform 0.7s ease-in-out;
}

.regButton:hover{
    box-shadow: 0 0 5px .5px black inset, 0 0 10px 5px black !important;
    transform: scale(1.2);
}

.field{
    width: 80%;
    margin-left: 10%;
    margin-right: 10%;
}
@media screen and (max-width: 500px){
   .form{
        flex-direction: column;
    }
   .field{
        width: 100%;
        margin: 0;
    }
    .card{
        margin: auto;
        margin-bottom: 30% !important;
        width: 80%;
    }
}
@keyframes fade {
  0%   { opacity:0.01; }
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