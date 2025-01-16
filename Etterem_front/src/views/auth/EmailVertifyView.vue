<script lang="ts" setup>
import type { emailVertifyData } from '@/api/auth/auth';
import { useEmailVertification } from '@/api/auth/authQuery';
import { ref } from 'vue';
import { useRoute } from 'vue-router';


const {query} = useRoute()
const token = query.token as string
const uid = query.uid as string 

const emailVertifyDataRef = ref<emailVertifyData>({
    token:'',
    uid:0
})
emailVertifyDataRef.value.token = token
emailVertifyDataRef.value.uid = Number(uid)

const {mutate, isPending} = useEmailVertification()

</script>
<template>
    <h1>Erősítsd meg</h1>
    <v-btn @click="mutate(emailVertifyDataRef)" :loading="isPending">
        Megerősítés
    </v-btn>
</template>