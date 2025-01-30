<script lang="ts" setup>
import type {  emailVerifyData, SetPasswordData } from '@/api/auth/auth';
import { usePasswordReset } from '@/api/auth/authQuery';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { toast } from 'vue3-toastify';

const PasswordResetDataRef = ref<SetPasswordData>({
    password: '',
    password_confirmation: ''
})

const {query} = useRoute()
const token = query.token as string

const emailverifyDataRef = ref<emailVerifyData>({
    token:'',
})
emailverifyDataRef.value.token = token


const notify = () => {
    toast.success("Email Sikeresen elküldve!")
}

const { mutate, isPending} = usePasswordReset()

const handlePasswordReset = (PasswordResetDataRef : SetPasswordData) => {
    if( PasswordResetDataRef.password == '' || PasswordResetDataRef.password_confirmation == ''){
        toast.error("Hiányzó adatok, kérlek töltsd ki az összes mezőt mielőtt tovább haladsz!")
    }else if(PasswordResetDataRef.password != PasswordResetDataRef.password_confirmation){
        toast.error("A két jelszó eltérő!")
    }else{
        mutate(PasswordResetDataRef,{
        onError(error: any){
            toast.error(error.response?.data?.errmessage || "Valami hiba történt, kérjük próbáld meg újra!")
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
                Jelszó változtatás
            </v-btn>
        </v-card-actions>
    </v-card>
</template>