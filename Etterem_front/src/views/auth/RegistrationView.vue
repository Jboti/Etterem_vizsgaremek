<script lang="ts" setup>
import type { RegistrationData } from '@/api/auth/auth';
import { useRegistration } from '@/api/auth/authQuery';
import { ref } from 'vue';

const registrationDataRef = ref<RegistrationData>({
   userName: '',
   fullName: '',
   email: '',
   password: ''
})

const { mutate, isPending} = useRegistration()

</script>
<template>
    <v-card>
        <v-card-title>Regisztráció</v-card-title>
        <v-card-text>
            <v-text-field v-model="registrationDataRef.userName" label="Felhasználó név" variant="outlined"></v-text-field>
            <v-text-field v-model="registrationDataRef.fullName" label="Teljes név" variant="outlined"></v-text-field>
            <v-text-field v-model="registrationDataRef.email" label="Email" variant="outlined"></v-text-field>
            <v-text-field v-model="registrationDataRef.password" label="Jelszó" variant="outlined"></v-text-field>
        </v-card-text>
        <v-card-actions>
            <v-btn @click="mutate(registrationDataRef)" :loading="isPending ">
                Regisztráció
            </v-btn>
        </v-card-actions>
    </v-card>
</template>