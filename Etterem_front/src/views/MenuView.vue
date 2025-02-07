<script lang="ts" setup>
import type { cartItem } from '@/api/menuItems/items';
import { useGetDishes } from '@/api/menuItems/itemsQuery'
import { useGetUserInfo } from '@/api/user/userQuery';
import { useCartStore } from '@/stores/cartStore';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';

const { data } = useGetDishes()
const { isError } = useGetUserInfo()

const cartStore = useCartStore()
const selectedDish = ref<any>(null)
const sauceSelected = ref<boolean>(false)
const selectedSauce = ref<any>(null)
const selectedOptions = ref<any[]>([])
const isModalOpen = ref(false)

const notify = () => {
    toast.success("A termék a kosárba került!")
}

const handleAddToCart = (dish:any) => {
  if(isError.value)
    toast.error("Ahoz hogy a terméket a kosárba rakd be kell jelentkezned!")
  else{
    sauceSelected.value = false
    openModal(dish)
  }
}

const addToCart = (dish:any) =>{
  if(isError.value)
    toast.error("Ahoz hogy a terméket a kosárba rakd be kell jelentkezz!")
  else{
    const item = ref<cartItem>()
    if(dish.type == 'Drink'){
      item.value = {
        cartId: -1,
        dishId: dish.id,
        name: dish.name,
        price: dish.price+50,
        sause: selectedSauce.value,
        options: selectedOptions.value.map(o => o.name).join(', '),
        type: dish.type
      }
      cartStore.addItem(1,item.value)
    }else{
      if(JSON.parse(dish.sauceOptions).length == 1)
        selectedSauce.value = JSON.parse(dish.sauceOptions)[0].name
      if(selectedSauce.value){
        let value = 0
        value += dish.price
        selectedOptions.value.forEach(o => { value += o.price})

        item.value = {
          cartId: -1,
          dishId: dish.id,
          name: dish.name,
          price: value,
          sause: selectedSauce.value,
          options: selectedOptions.value.map(o => o.name).join(', '),
          type: dish.type
        }
        cartStore.addItem(1,item.value)
        toast.success("A termék a kosárba került!")
  
        closeModal()
      }else
        toast.error("Nincs kiválasztva szósz!")
    }
  }
}


const openModal = (dish:any) => {
  if(dish.type == 'Drink'){
    addToCart(dish)
    toast.success("A termék a kosárba került!")
  }else{
    selectedDish.value = dish
    isModalOpen.value = true
  }
}

const closeModal = () => {
  isModalOpen.value = false
  selectedSauce.value = null
  selectedOptions.value = []
}

const handleOptionSelected = (option: any) => {
  const index = selectedOptions.value.findIndex(o => o.name == option.name)
  
  if (index > -1) {
    selectedOptions.value.splice(index, 1);
  } else {
    selectedOptions.value.push(option)
  }
}


const handleSauceSelected = (sauce: any) => {
  if(!sauceSelected.value){
    sauceSelected.value = true
    selectedSauce.value = sauce.name
  }
  else{
    
    if(sauce.name != selectedSauce.value){
      toast.error("Csak egy féle szószt választhatsz!")
    }else{
      selectedSauce.value = null
      sauceSelected.value = false
    }

  }
    
}

</script>

<template>
  <div class="pb-2 mb-4 text-center topMenu" style="background: linear-gradient(90deg, black 0%, #B71C1C 50%, black 100%); border-bottom: solid 1px white;">
    <h1 class="pb-2 pt-2" style="font-weight: bold; color: whitesmoke;">Étlap</h1>
    <v-row style="width: 100%; margin: auto;">
      <v-col cols="6" sm="3">
        <v-btn class="bg-red-darken-4 mr-3 mb-1 mt-1 buttons" rounded="xl"><b>Wrappek</b></v-btn>
      </v-col>
      <v-col cols="6" sm="3">
        <v-btn class="bg-red-darken-4 mr-3 mb-1 mt-1 buttons" rounded="xl"><b>Csirke Kebabok</b></v-btn>  
      </v-col>
      <v-col cols="6" sm="3">
        <v-btn class="bg-red-darken-4 mr-3 mb-1 mt-1 buttons" rounded="xl"><b>Borjú Kebabok</b></v-btn>  
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
                <div v-if="dish.type == 'Drink'">{{ dish.price }}+50 Ft</div>
                <div v-else>{{ dish.price }} Ft</div>
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
   <v-dialog v-model="isModalOpen" max-width="800px" @click:outside="closeModal" style="background-color: rgba(0, 0, 0, 0.7);">
    <v-card>
      <div class="modalHeader">
        <div class="modalImg">
          <v-img v-if="selectedDish" :src="selectedDish.image" style="background-image: url(background.jpg); background-size: cover; width: 96%; height: 96%; border: 2px solid black; border-radius: 40px; border-top-right-radius: 4px; margin: 2%; box-shadow: 0 0 5px .5px black;"></v-img>
        </div>
        <div class="modalInfo">
          <v-card-title v-if="selectedDish" class="mb-10"><b>{{ selectedDish.name }}</b></v-card-title>
          <v-card-text v-if="selectedDish">
            <p class="mb-2"><b>Ár:</b> {{ selectedDish.price }} Ft</p>
            <p><b>Leírás:</b> {{ selectedDish.description }}</p>
          </v-card-text>
        </div>
      </div>
      <v-card-text>
        <p class="mt-2 mb-4"><b v-if="selectedDish.sauceOptions" style="margin-bottom: 2%;">Szósz:</b></p>
        <v-row style="border-bottom: solid 2px black; padding-bottom: 3%;">
          <v-col v-if="selectedDish.sauceOptions" v-for="(sauce,index) in JSON.parse(selectedDish.sauceOptions)" :key="index" cols="12" sm="6" md="6" lg="6" xl="4">
            <div style="display: flex; border: 2px solid rgba(0, 0, 0, 0.4); box-shadow: 0 0 5px .5px rgba(0, 0, 0, 0.4); border-radius: 10px; width: 100%; align-items: center; padding: 3%;">
              <p style="width: 80%;"><b>{{ sauce.name }}: </b></p>
              <v-btn style="width: 20%; padding: 0; border: 1px solid black; box-shadow: 0 0 5px .25px black" @click="handleSauceSelected(sauce)" :class="{ 'selected-button': selectedSauce == sauce.name || JSON.parse(selectedDish.sauceOptions).length == 1}"><v-icon>mdi-check</v-icon></v-btn>
            </div>
          </v-col>
        </v-row>
        <p class="mt-4 mb-4" style="padding-top: 3%;"><b v-if="selectedDish.customizationOptions" style="margin-bottom: 2%;">Opciók:</b></p>
        <v-row style="border-bottom: solid 2px black; padding-bottom: 3%; align-items: center;">
          <v-col v-if="selectedDish.customizationOptions" v-for="(dishOption,index) in JSON.parse(selectedDish.customizationOptions)" :key="index" cols="12" sm="6" md="6" lg="6" xl="4">
            <div style="display: flex; border: 2px solid rgba(0, 0, 0, 0.4); box-shadow: 0 0 5px .5px rgba(0, 0, 0, 0.4); border-radius: 10px; width: 100%; align-items: center; padding-left: 2%; padding-right: 2%; flex-direction: column; padding-bottom: 2%;">
              <p style="width: 96%; padding: 2%;"><b>{{ dishOption.name }}: </b></p>
              <div style="display: flex; justify-content: space-evenly; align-items: center;width: 96%; padding: 2%;">
                <p style="width: 50%; ">{{ dishOption.price }} Ft</p>
                <v-btn style="width: 25%; border: 1px solid black; box-shadow: 0 0 5px .25px black" @click="handleOptionSelected(dishOption)" :class="{'selected-button': selectedOptions.some(o => o.name == dishOption.name) }"><v-icon>mdi-check</v-icon></v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="red" @click="closeModal" style="float: left;">Vissza</v-btn>
        <v-btn color="green" @click="addToCart(selectedDish)">Kosárba</v-btn>
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
  box-shadow: 0 0 2px 0.25px black inset, 0 0 5px .5px black !important; 
  transition: .7s ease-in-out;
}
.cartButtons:hover{
  box-shadow: 0 0 2px 0.25px black inset, 0 0 5px .5px black;
  transform: scale(1.2);
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

.modalHeader{
  display: flex;
  flex-direction: row-reverse;
  width: 100%; border-bottom:
  solid 2px black;
  padding-bottom: 2%;
}

.modalInfo{
  width: 70%;
}

.modalImg{
  width: 30%;
  visibility: visible;
}

.selected-button{
  background-color: green;
  color: white;
}



@media screen and (max-width: 800px){
  .modalInfo{
    width: 100%;
  }
  .modalHeader{
    display: block;
  }
   .modalImg{
    visibility: hidden;
    width: 0;
   }
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