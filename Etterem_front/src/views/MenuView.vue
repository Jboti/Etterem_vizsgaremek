<script lang="ts" setup>
import { useGetDishes } from '@/api/menuItems/itemsQuery'
import { useGetUserInfo } from '@/api/user/userQuery';
import { toast } from 'vue3-toastify';

const { data } = useGetDishes()
const { isError } = useGetUserInfo()

const notify = () => {
    toast.success("A termék a kosárba került!")
}

const handleAddToCart = () => {
  if(isError.value)
    toast.error("Ahoz hogy a terméket a kosárba rakd be kell jelentkezned!")
  else
    toast.success("A termék a kosárba került!")
}



</script>

<template>
  <div class="pb-2 mb-4 text-center" style="background: linear-gradient(90deg, black 0%, #B71C1C 50%, black 100%);">
    <h1 class="pb-2" style="font-weight: 700;">Étlap</h1>
    <v-btn class="bg-red-darken-4 mr-3 mb-1 mt-1" rounded="xl"><b>Menük</b></v-btn>
    <v-btn class="bg-red-darken-4 mr-3 mb-1 mt-1" rounded="xl"><b>Kebabok</b></v-btn>
    <v-btn class="bg-red-darken-4 mr-3 mb-1 mt-1" rounded="xl"><b>Köretek</b></v-btn>
    <v-btn class="bg-red-darken-4 mr-3 mb-1 mt-1" rounded="xl"><b>Üdítők</b></v-btn>
  </div>
  <div>
    <button @click="notify"></button>
  </div>
  
  <v-container style="margin-bottom: 150px;">
    <v-row>
      <v-col 
        v-for="(dish, index) in data" 
        :key="index" 
        cols="12" sm="6" md="4" xl="3"
      >
        <v-card class="mx-auto mb-6 dish-card" max-width="344" style="background-image: url(background.jpg);">
          <v-img height="275px"></v-img>
          <v-card-text class="pt-2" style="border-top: solid whitesmoke 3px; border-top-left-radius: 40px; border-top-right-radius: 40px; background-color: whitesmoke; box-shadow: 0 0 3px 1px whitesmoke; ">
            <div class="mt-4" style=" display: flex;
                        flex-direction: row;
                        flex-wrap: nowrap;
                        align-content: space-around;
                        justify-content: space-between;
                        align-items: center;
                        height: 4em;">
              <div class="ml-2 mr-2" style="max-height: 3em; 
                          display: flex;
                          flex-direction: column;
                          align-items: flex-start;
                          justify-content: center">
                <div><b>{{ dish.name }}</b></div>
                <div>{{ dish.price }} Ft</div>
              </div>
              <v-btn class="pl-4 pr-4 pt-2 pb-2" style="background-color: rgb(22, 139, 22); box-shadow: 0 0 2px 0.25px black inset, 0 0 5px .5px black; " @click="handleAddToCart()">
                <b>Kosárba</b>
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

.dish-card{
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: solid 2px whitesmoke;
  border-radius: 3px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  box-shadow: 0 0 2px 1px whitesmoke inset, 0 0 5px 2px whitesmoke;
  animation: 1s ease-in-out sizeUp;
}


@keyframes sizeUp {
  0%   { transform:scale(0); }
  100% { transform:scale(1); }
}
</style>