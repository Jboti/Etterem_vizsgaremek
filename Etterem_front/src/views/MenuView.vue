<script lang="ts" setup>
import { useGetDishes } from '@/api/menuItems/itemsQuery'
import { useGetUserInfo } from '@/api/user/userQuery';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';

const { data } = useGetDishes()
const { isError } = useGetUserInfo()

const selectedDish = ref<any>(null)
const isModalOpen = ref(false)


const notify = () => {
    toast.success("A termék a kosárba került!")
}

const handleAddToCart = (dish:any) => {
  if(isError.value)
    toast.error("Ahoz hogy a terméket a kosárba rakd be kell jelentkezned!")
  else
      openModal(dish)
}

const addToCart = () =>{
  if(isError.value)
    toast.error("Ahoz hogy a terméket a kosárba rakd be kell jelentkezned!")
  else{
    toast.success("A termék a kosárba került!")
    closeModal()
  }
}


const openModal = (dish:any) => {
  selectedDish.value = dish;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};


</script>

<template>
  <div class="pb-2 mb-4 text-center topMenu" style="background: linear-gradient(90deg, black 0%, #B71C1C 50%, black 100%); border-bottom: solid 1px white;">
    <h1 class="pb-2 pt-2" style="font-weight: bold; color: whitesmoke;">Étlap</h1>
    <v-row style="width: 100%; margin: auto;">
      <v-col cols="6" sm="3">
        <v-btn class="bg-red-darken-4 mr-3 mb-1 mt-1 buttons" rounded="xl"><b>Menük</b></v-btn>
      </v-col>
      <v-col cols="6" sm="3">
        <v-btn class="bg-red-darken-4 mr-3 mb-1 mt-1 buttons" rounded="xl"><b>Kebabok</b></v-btn>  
      </v-col>
      <v-col cols="6" sm="3">
        <v-btn class="bg-red-darken-4 mr-3 mb-1 mt-1 buttons" rounded="xl"><b>Köretek</b></v-btn>  
      </v-col>
      <v-col cols="6" sm="3">
        <v-btn class="bg-red-darken-4 mr-3 mb-1 mt-1 buttons" rounded="xl"><b>Üdítők</b></v-btn>
      </v-col>
    </v-row>
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
          <v-card-text style="border-top: solid whitesmoke 3px; border-top-left-radius: 40px; border-top-right-radius: 40px; background-color: whitesmoke; box-shadow: 0 0 3px 1px whitesmoke;">
            <div class="mt-4 dish-data-box">
              <div class="ml-2 mr-2 dish-data">
                <div><b>{{ dish.name }}</b></div>
                <div>{{ dish.price }} Ft</div>
              </div>
              <v-btn class="pl-4 pr-4 pt-2 pb-2 cartButtons" @click="handleAddToCart(dish)">
                <b>Kosárba</b>
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <div>
    <button @click="notify"></button>
  </div>

  
  <!-- Modal -->
   <v-dialog v-model="isModalOpen" max-width="500px">
    <v-card>
      <v-img v-if="selectedDish" :src="selectedDish.image" height="200px"></v-img>
      <v-card-title v-if="selectedDish">{{ selectedDish.name }}</v-card-title>
      <v-card-text v-if="selectedDish">
        <p><b>Ár:</b> {{ selectedDish.price }} Ft</p>
        <p><b>Leírás:</b> {{ selectedDish.description }}</p>
        <v-row>
          <v-col v-for="(dishOption,index) in JSON.parse(selectedDish.customizationOptions)" :key="index" >
            <p>{{ dishOption.name }}</p>
            <p>{{ dishOption.price }}</p>
            <v-btn><v-icon>mdi-check</v-icon></v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="red" @click="closeModal">Vissza</v-btn>
        <v-btn color="green" @click="addToCart">Kosárba</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
  transition: transform .5s ease-in-out, box-shadow .7s ease-in-out;
}

.dish-card:has(.cartButtons:hover) {
  transform: scale(1.05);
  box-shadow: 0 0 2px 1px black inset, 0 0 5px 2px black;
  border: black;
}

.dish-data{
  max-height: 3em; 
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center
}

.dish-data-box{
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: space-around;  
  justify-content: space-between;
  align-items: center;
  height: 4em;
}


.cartButtons{
  background-color: rgb(22, 139, 22);
  box-shadow: 0 0 2px 0.25px black inset, 0 0 5px .5px black; 
}
.cartButtons:hover{
  box-shadow: 0 0 2px 0.25px black inset, 0 0 5px .5px black;
}



.topMenu{
  animation: 1s ease-in fade;
}

.buttons{
  border-radius: 8px !important;
  width: 75%;
  box-shadow: 0 0 5px .5px whitesmoke;
  transition: all .7s ease-in-out, box-shadow .7s ease-in-out;
  animation: 1s ease-in slideInFromTop;
}

.buttons:hover{
  transform: scale(1.2);
  box-shadow: 0 0 2px .5px whitesmoke inset, 0 0 10px 2px whitesmoke;

}

@keyframes slideInFromTop {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes sizeUp {
  0%   { transform:scale(0); }
  100% { transform:scale(1); }
}

@keyframes fade {
  0% {opacity: 0;}
  100% {opacity: 1;}
}
</style>