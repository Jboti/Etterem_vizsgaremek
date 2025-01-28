<script lang="ts" setup>
import type { RegistrationData } from '@/api/auth/auth';
import { useRegistration } from '@/api/auth/authQuery';
import { ref } from 'vue';

const registrationDataRef = ref<RegistrationData>({
   userName: '',
   fullName: '',
   email: '',
   password: '',
   passwordRe: ''
})

const errorMessage = ref<string | null>(null)
const { mutate, isPending} = useRegistration()
const handleRegister = (registrationDataRef : RegistrationData) => {
    console.log(registrationDataRef.email)
    errorMessage.value = null
    if(registrationDataRef.email == '' || registrationDataRef.fullName == '' || registrationDataRef.password == '' || registrationDataRef.userName == '' || registrationDataRef.passwordRe == ''){
        errorMessage.value = "Hiányzó adatok, kérlek töltsd ki az összes mezőt mielőtt tovább haladsz!"
    }else if(registrationDataRef.password != registrationDataRef.passwordRe){
        errorMessage.value = "A két jelsző eltérő!"
    }else{
        mutate(registrationDataRef,{
        onError(error: any){
            errorMessage.value = error.response?.data?.errmessage || "Valami hiba történt, kérjük próbáld meg újra!"
            }
        })
    }
}

</script>
<template>
    <v-card>
        <v-card-title>Regisztráció</v-card-title>
        <v-card-text>
            <v-text-field v-model="registrationDataRef.userName" label="Felhasználó név" variant="outlined"></v-text-field>
            <v-text-field v-model="registrationDataRef.fullName" label="Teljes név" variant="outlined"></v-text-field>
            <v-text-field v-model="registrationDataRef.email" label="Email" variant="outlined"></v-text-field>
            <v-text-field v-model="registrationDataRef.password" label="Jelszó" variant="outlined"></v-text-field>
            <v-text-field v-model="registrationDataRef.passwordRe" label="Jelszó megerősítése" variant="outlined"></v-text-field>
        </v-card-text>
        <v-card-actions>
            <v-btn @click="handleRegister(registrationDataRef)" :loading="isPending ">
                Regisztráció
            </v-btn>
        </v-card-actions>
    </v-card>
    <p style="color: red;">{{ errorMessage }}</p>
</template>