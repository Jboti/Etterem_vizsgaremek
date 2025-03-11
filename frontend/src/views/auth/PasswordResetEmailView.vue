<script lang="ts" setup>
import type { ResetPasswordData } from '@/api/auth/auth';
import { usePasswordResetEmail } from '@/api/auth/authQuery';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

const { push } = useRouter()
const notify = () => {}

const { mutate, isPending} = usePasswordResetEmail()

const ResetPasswordDataRef = ref<ResetPasswordData>({
    email: '',
})

const handlePwResetEmailSent = (ResetPasswordDataRef: ResetPasswordData) => {
    if(ResetPasswordDataRef.email == ''){
        toast.error("Hiányzó adatok, kérlek töltsd ki az összes mezőt mielőtt tovább haladsz!")
    }else{
        mutate(ResetPasswordDataRef,{
            onSuccess(){
                push({name:'email-sent-pw-change'})
                setTimeout(() => {
                        toast.success("Email sikeresen elküldve!")
                }, 100)
            },
            onError(error: any){
                toast.error(error.response?.data?.errmessage || "Valami hiba történt, kérjük próbáld meg újra!")
            }
        })
    }
}
</script>


<template>
    <v-container class="pt-0 mt-10" style=" height: 50dvh; width: 90%; max-width: 1000px; min-width: 375px; min-height: 100px; max-height: 600px;">
        <v-card class="bg-red-darken-4 mt-2 card" outlined>
            <v-card-title style="text-align: center;" class="pb-6 pt-4"><h2 style="text-shadow: 2px 2px 2px black; color: whitesmoke; font-size: clamp(20px, 6vw, 50px);"><b>Add meg az email címed!</b></h2></v-card-title>
            <v-card-text>
                <v-text-field v-model="ResetPasswordDataRef.email" label="Email" variant="outlined" class="mr-10 ml-10"></v-text-field>
            </v-card-text>
            <div style="display: flex;
                flex-direction: column;
                align-items: center;">
                <div style="text-align: center;">
                </div>
                <div style="text-align: center;">
                    <v-btn @click="handlePwResetEmailSent(ResetPasswordDataRef)" :loading="isPending" class="white pl-4 pr-4 mt-2 mb-6 button">
                        Email küldése
                    </v-btn>
                </div>
            </div>
        </v-card>
    </v-container>
    <div>
        <button @click="notify"></button>
    </div>
</template>

<style scoped>

.card{
    box-shadow: 0 0 40px 8px black inset, 0 0 5px 2px black; 
    min-height: 62.5%;
    width: 100%;
    border-radius: 10px;
    animation: .7s ease-in-out fade;
}

.button{
    font-weight: bolder;
    box-shadow: 0 0 5px 2px black;
    background-color: whitesmoke;
    color: black;
    transition: transform 0.7s ease-in-out;
}

.button:hover{
    box-shadow: 0 0 5px .5px black inset, 0 0 10px 5px black !important;
    transform: scale(1.2);
}

@keyframes fade {
  0%   { opacity:0; }
  100% { opacity:1; }
}
</style>