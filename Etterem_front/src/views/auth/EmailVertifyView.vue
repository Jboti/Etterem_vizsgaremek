<script lang="ts" setup>
import type { emailVerifyData } from '@/api/auth/auth';
import { useEmailVertification } from '@/api/auth/authQuery';
import { ref } from 'vue';
import { useRoute } from 'vue-router';


const {query} = useRoute()
const token = query.token as string

const emailverifyDataRef = ref<emailVerifyData>({
    token:'',
})
emailverifyDataRef.value.token = token

const {mutate, isPending} = useEmailVertification()

</script>
<template>
    <h1>Erősítsd meg</h1>
    <v-btn @click="mutate(emailverifyDataRef)" :loading="isPending">
        Megerősítés
    </v-btn>
</template>