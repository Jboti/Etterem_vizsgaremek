<script lang="ts" setup>
import type { ResetPasswordData } from '@/api/auth/auth';
import { usePasswordResetEmail } from '@/api/auth/authQuery';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

const ResetPasswordDataRef = ref<ResetPasswordData>({
    email: '',
})


const { push } = useRouter()
const { mutate, isPending} = usePasswordResetEmail()


const notify = () => {
    toast.success("Sikeres bejelentkezés!")
}


const handlePwResetEmailSent = (ResetPasswordDataRef: ResetPasswordData) => {
    if(ResetPasswordDataRef.email == ''){
        toast.error("Hiányzó adatok, kérlek töltsd ki az összes mezőt mielőtt tovább haladsz!")
    }else{
        mutate(ResetPasswordDataRef,{
            onSuccess(){
                push({name:'password-reset-email'})
                setTimeout(() => {
                        toast.success("Sikeres bejelentkezés!")
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
    <div>
        <button @click="notify"></button>
    </div>
    <v-container class="pt-0 mt-0 d-flex justify-center align-center " style=" height: 75%; width: 90%; max-width: 1000px; min-width: 375px; min-height: 600px;">
        <v-card class="bg-red-darken-4" 
                style=" box-shadow: 0 0 40px 8px black inset, 0 0 5px 2px black; 
                min-height: 62.5%;
                width: 100%;
                border-radius: 10px;
                top: -10%;" outlined>
            <v-card-title style="text-align: center;" class="pb-6 pt-4"><h2 style="text-shadow: 2px 2px 2px black; color: whitesmoke; font-size: clamp(20px, 6vw, 50px);"><b>Add meg az emaied</b></h2></v-card-title>
            <v-card-text>
                <v-text-field v-model="ResetPasswordDataRef.email" label="Email" variant="outlined" class="mr-10 ml-10"></v-text-field>
            </v-card-text>
            <div style="display: flex;
                flex-direction: column;
                align-items: center;">
                <div style="text-align: center;">
                </div>
                <div style="text-align: center;">
                    <v-btn @click="handlePwResetEmailSent(ResetPasswordDataRef)" variant="plain" style="font-size: xx-small; font-weight: bolder; width: 100%;">
                        Elfelejtett jelszó
                    </v-btn>
                </div>
            </div>
        </v-card>
    </v-container>
</template>