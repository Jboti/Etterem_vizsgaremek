<script lang="ts" setup>
import type {  SetPasswordData } from '@/api/auth/auth';
import { usePasswordReset } from '@/api/auth/authQuery';
import { ref } from 'vue';

const PasswordResetDataRef = ref<SetPasswordData>({
    password: '',
    password_confirmation: ''
})

const errorMessage = ref<string | null>(null)
const { mutate, isPending} = usePasswordReset()
const handlePasswordReset = (PasswordResetDataRef : SetPasswordData) => {
    errorMessage.value = null
    if( PasswordResetDataRef.password == '' || PasswordResetDataRef.password_confirmation == ''){
        errorMessage.value = "Hiányzó adatok, kérlek töltsd ki az összes mezőt mielőtt tovább haladsz!"
    }else if(PasswordResetDataRef.password != PasswordResetDataRef.password_confirmation){
        errorMessage.value = "A két jelsző eltérő!"
    }else{
        mutate(PasswordResetDataRef,{
        onError(error: any){
            errorMessage.value = error.response?.data?.errmessage || "Valami hiba történt, kérjük próbáld meg újra!"
            }
        })
    }
}

</script>
<template>
    <v-card>
        <v-card-title>Új jelszó beállítása</v-card-title>
        <v-card-text>
            <v-text-field v-model="PasswordResetDataRef.password" label="Új jelszó" variant="outlined"></v-text-field>
            <v-text-field v-model="PasswordResetDataRef.password_confirmation" label="Új jelszó megerősítése" variant="outlined"></v-text-field>
        </v-card-text>
        <v-card-actions>
            <v-btn @click="handlePasswordReset(PasswordResetDataRef)" :loading="isPending ">
                Új jelszó
            </v-btn>
        </v-card-actions>
    </v-card>
    <p style="color: red;">{{ errorMessage }}</p>
</template>