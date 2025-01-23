<script lang="ts" setup>
import type { LoginData } from '@/api/auth/auth';
import { useLogin } from '@/api/auth/authQuery';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const LoginDataRef = ref<LoginData>({
    email: '',
    password:''
})

const { push } = useRouter()
const { mutate, isPending} = useLogin()

</script>
<template>
    <v-card>
        <v-card-title>Login</v-card-title>
        <v-card-text>
            <v-text-field v-model="LoginDataRef.email" label="Email" variant="outlined"></v-text-field>
            <v-text-field v-model="LoginDataRef.password" label="Password" type="password" variant="outlined"></v-text-field>
        </v-card-text>
        <v-card-actions>
            <v-btn @click="mutate(LoginDataRef)" :loading="isPending ">
                Login
            </v-btn>
            <v-btn @click="push({name:'PasswordResetEmail'})">
                Forgot password
            </v-btn>
        </v-card-actions>
    </v-card>
</template>