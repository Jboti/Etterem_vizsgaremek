<script lang="ts" setup>
import type { RegistrationData } from '@/api/auth/auth';
import { useRegistration } from '@/api/auth/authQuery';
import { ref } from 'vue';

const registrationDataRef = ref<RegistrationData>({
    fullName: '',
    userName:'',
    email: ''
})

const { mutate: registration, isPending} = useRegistration()

</script>
<template>
    <v-card>
        <v-card-title>Regisztráció</v-card-title>
        <v-card-text>
            <v-text-field v-model="registrationDataRef.fullName" label="Teljes név" variant="outlined"></v-text-field>
            <v-text-field v-model="registrationDataRef.userName" label="felhasználó név" variant="outlined"></v-text-field>
            <v-text-field v-model="registrationDataRef.email" label="Email" variant="outlined"></v-text-field>
        </v-card-text>
        <v-card-actions>
            <v-btn @click="() => {
                registration(registrationDataRef)
            }" :loading="isPending">
                Regisztráció
            </v-btn>
        </v-card-actions>
    </v-card>
</template>