<script lang="ts" setup>
import type { ResetPasswordData } from '@/api/auth/auth';
import { usePostPasswordReset } from '@/api/auth/authQuery';
import { ref } from 'vue';


const ResetPasswordDataRef = ref<ResetPasswordData>({
    email:''
})

const {mutate,isPending} = usePostPasswordReset()

</script>
<template>
   <v-card>
    <v-card-title>Reset password</v-card-title>
        <v-card-text>
            <v-text-field v-model="ResetPasswordDataRef.email" label="Email" variant="outlined"></v-text-field>
        </v-card-text>
        <v-card-actions>
            <v-btn @click="() =>{
                mutate(ResetPasswordDataRef)
            }" :loading="isPending">
                Küldés
            </v-btn>
        </v-card-actions>
   </v-card>
</template>