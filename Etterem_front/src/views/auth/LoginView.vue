<script lang="ts" setup>
import type { LoginData } from '@/api/auth/auth';
import { useLogin } from '@/api/auth/authQuery';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const LoginDataRef = ref<LoginData>({
    email: '',
    password:''
})

const errorMessage = ref<string | null>(null)
const { push } = useRouter()
const { mutate, isPending} = useLogin()

const handleLogin = (LoginDataRef: LoginData) => {
    errorMessage.value = null
    mutate(LoginDataRef,{
        onError(error: any){
            errorMessage.value = error.response?.data?.errmessage || "Valami hiba történt, kérjük próbáld meg újra!"
        }
    })
}

</script>
<template>
    <v-card>
        <v-card-title>Login</v-card-title>
        <v-card-text>
            <v-text-field v-model="LoginDataRef.email" label="Email" variant="outlined"></v-text-field>
            <v-text-field v-model="LoginDataRef.password" label="Password" type="password" variant="outlined"></v-text-field>
        </v-card-text>
        <v-card-actions>
            <v-btn @click="handleLogin(LoginDataRef)" :loading="isPending ">
                Login
            </v-btn>
            <v-btn @click="push({name:'PasswordResetEmail'})">
                Forgot password
            </v-btn>
        </v-card-actions>
    </v-card>
    <p style="color: red;">{{ errorMessage }}</p>
</template>