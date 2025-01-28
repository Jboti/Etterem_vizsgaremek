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
    } else if (!validateEmail(registrationDataRef.email)){
        toast.error("Nem megfelelő formátumú email!")
    } else if (!validatePassword(registrationDataRef.password)){
        toast.error("Nme megfelelő formátumú jelszó!")
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
    <div>
        <button @click="notify"></button>
    </div>
    <v-container class="pt-0 mt-0 d-flex justify-center align-center " style=" height: 90%; width: 90%; max-width: 1000px;">
        <v-card class="bg-red-darken-4 pb-4" 
                style=" box-shadow: 0 0 40px 8px black inset, 0 0 5px 2px black; 
                min-height: 62.5%;
                width: 100%;
                border-radius: 10px;
                top: -6.5%;" outlined>
        <v-card-title style="text-align: center;" class="pb-6 pt-4"><h2 style="text-shadow: 2px 2px 2px black; color: whitesmoke; font-size: clamp(20px, 6vw, 50px);"><b>Regisztráció</b></h2></v-card-title>
        <v-card-text class="pb-1 pl-0">
            <v-text-field v-model="registrationDataRef.userName" label="Felhasználó név" variant="outlined" class="mr-10 ml-10"></v-text-field>
            <v-text-field v-model="registrationDataRef.fullName" label="Teljes név" variant="outlined" class="mr-10 ml-10"></v-text-field>
            <v-text-field v-model="registrationDataRef.email" label="Email" variant="outlined" class="mr-10 ml-10"></v-text-field>
            <div class="Tooltip">
                <v-icon class="mx-1 pl-12 pb-2" tyle="line-height: 0;">mdi-help-circle-outline</v-icon>
                <span class="TooltipText">Minimum 8 karakter hosszú,</br> Minimum 1 kis és nagy betű,</br> Minimum 1 szám</span>
            </div>
            <v-text-field class="ml-10"
            v-model="registrationDataRef.password"
            label="Jelszó"
            variant="outlined"
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
            ></v-text-field>
            <v-text-field class="ml-10"
                v-model="registrationDataRef.passwordRe"
                label="Jelszó megerősítése"
                variant="outlined"
                :type="showPasswordRe ? 'text' : 'password'"
                :append-icon="showPasswordRe ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPasswordRe = !showPasswordRe"
            ></v-text-field>
        </v-card-text>
        <div style="text-align: center;">
            <v-btn @click="handleRegister(registrationDataRef)" :loading="isPending" class="white pl-4 pr-4 mt-4" style="font-weight: bolder; box-shadow: 0 0 5px 2px black;">
                    Regisztráció
            </v-btn>
        </div>
        </v-card>
    </v-container>
</template>

<style scoped>

.Tooltip {
    position: relative;
    display: inline-block;
    width: 3%;
    color: white;
}

.Tooltip:hover{
    cursor: pointer;
}

.Tooltip .TooltipText {
    visibility: hidden;
    width: 40vw;
    max-width: 370px;
    min-width: 220px;
    font-size: medium;
    background-color: rgba(255, 255, 255, 0.85);
    color: black;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;
    position: absolute;
    top: -50%;
    left: 210%;
}
  
.Tooltip:hover .TooltipText {
    visibility: visible;
}

</style>