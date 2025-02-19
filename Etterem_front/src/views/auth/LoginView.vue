<script lang="ts" setup>
import type { LoginData } from '@/api/auth/auth';
import { useLogin } from '@/api/auth/authQuery';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

const LoginDataRef = ref<LoginData>({
    email: '',
    password:''
})


const { push } = useRouter()
const { mutate, isPending} = useLogin()
const showPassword = ref<boolean>(false)


const notify = () => {
    toast.success("Sikeres bejelentkezés!")
}


const handleLogin = (LoginDataRef: LoginData) => {
    if(LoginDataRef.email == '' || LoginDataRef.password == ''){
        toast.error("Hiányzó adatok, kérlek töltsd ki az összes mezőt mielőtt tovább haladsz!")
    }else{
        mutate(LoginDataRef,{
            onSuccess(){
                push({name:'Main'})
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
    <v-container class="" style=" height: 75%; width: 90%; max-width: 1000px; min-width: 375px; min-height: 600px;">
        <v-card class="bg-red-darken-4 card" outlined>
            <v-card-title class="pb-6 pt-4 title"><h2 style="text-shadow: 2px 2px 2px black; color: whitesmoke; font-size: clamp(20px, 6vw, 50px);"><b>Bejelentkezés</b></h2></v-card-title>
            <v-card-text>
                <v-text-field v-model="LoginDataRef.email" label="Email" variant="outlined" class="mr-10 ml-10"></v-text-field>
                <v-text-field class="ml-10 mr-10"
                        v-model="LoginDataRef.password"
                        label="Jelszó"
                        variant="outlined"
                        :type="showPassword ? 'text' : 'password'"
                        :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append-inner="showPassword = !showPassword"
                ></v-text-field>
            </v-card-text>
            <div class="buttons">
                <div style="text-align: center;">
                    <v-btn @click="handleLogin(LoginDataRef)" :loading="isPending" class="white pl-4 pr-4 mt-2 mb-6 logButton" style="font-weight: bolder; box-shadow: 0 0 5px 2px black; background-color: whitesmoke; color: black;">
                        Bejelentkezés
                    </v-btn>
                </div>
                <div style="text-align: center;">
                    <v-btn @click="push({name:'password-reset-email'})" variant="plain" style="font-size: xx-small; font-weight: bolder; width: 100%;">
                        Elfelejtett jelszó
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
    animation: 1.5s ease-out 0s 1 fade;
}

.title{
    text-align: center;
    animation: 1s ease-in slideInFromTop;
}

.buttons{
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: 1s ease-in slideInFromBottomAndFade;
}

.logButton{
    box-shadow: 0 0 5px 2px black;
    transition: transform 0.7s ease-in-out;
}

.logButton:hover{
    box-shadow: 0 0 5px .5px black inset, 0 0 10px 5px black !important;
    transform: scale(1.2);
}

@keyframes fade {
  0%   { opacity:0; }
  100% { opacity:1; }
}
@keyframes slideInFromTop {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0);
  }
}
@keyframes slideInFromBottomAndFade {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>