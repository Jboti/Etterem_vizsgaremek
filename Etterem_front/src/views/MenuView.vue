<script lang="ts" setup>
import { useValidateToken } from '@/api/auth/authQuery';
import type { cartItem, dishData } from '@/api/menuItems/items';
import { useGetDishes } from '@/api/menuItems/itemsQuery'
import { useGetUserInfo } from '@/api/user/userQuery';
import { useCartStore } from '@/stores/cartStore';
import { computed, onMounted, ref, watch } from 'vue';
import { toast } from 'vue3-toastify';

const notify = () => {}
const cartStore = useCartStore()

// API hívások
const { isError, mutate: validateToken } = useValidateToken()
const { data:dishesData } = useGetDishes()
const { data:userData } = useGetUserInfo()

// Állapot változók
const selectedDish = ref<dishData | null>(null)
const selectedSauce = ref<string | null>(null)
const selectedOptions = ref<any[]>([])
const isModalOpen = ref(false)
const amount = ref(1)
const selectedCategory = ref<string | null>(null)
const selectedData = ref<any>(null)
const dishTypes = [
  { name: 'Wrap', display:'Wrappek'},
  { name: 'Kebab', display:'Kebabok'},
  { name: 'SideDish', display:'Köretek'},
  { name: 'Drink', display: 'Üdítők'},
]

// Szűrés
const groupedItems = computed(() => {
  const groups: Record<string, dishData[]> = {}

  dishTypes.forEach(({ name }) => {
    groups[name] = []
  })

  dishesData.value?.forEach((item) => {
    if (groups[item.type]) {
      groups[item.type].push(item)
    }
  })

  return groups
})

// Helper: JSON parse
const parseJSON = (str: string) => {
  try {
    return JSON.parse(str)
  } catch (error) {
    console.error('JSON parse error:', error)
    return []
  }
}

// Kosár lekezelés
const addToCart = (dish:any) =>{
  if(isError.value){
    toast.error("Ahoz hogy a terméket a kosárba rakd be kell jelentkezz!")
    return
  }
  let price = dish.price
  if(dish.type == 'Drink'){
    price += 50
  }
  else if(dish.type !== 'SideDish'){
    const sauceOptions = parseJSON(dish.sauceOptions || '[]')
    if(sauceOptions.length == 1)
      selectedSauce.value = sauceOptions[0].name
    if(!selectedSauce.value){
      toast.error("Nincs kiválasztva szósz!")
      return
    }
    selectedOptions.value.forEach(option => {
      price += option.price
    })
  }
  const newItem:cartItem = 
  {
    cartId: -1,
    dishId: dish.id,
    name: dish.name,
    price,
    sause: selectedSauce.value,
    options: selectedOptions.value.map(o => o.name).join(', '),
    type: dish.type,
    quantity: dish.type === 'Drink' || dish.type === 'SideDish' ? 1 : amount.value,
  }
  cartStore.addItem(newItem)
  if (dish.type !== 'Drink' || dish.type !== 'SideDish') {
    toast.success('A termék a kosárba került!')
    closeModal()
  }
}

const handleAddToCartClicked = (dish:any) => {
  if(isError.value)
    toast.error("Ahoz hogy a terméket a kosárba rakd be kell jelentkezned!")
  else{
    openModal(dish)
  }
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
  if (!selectedSauce.value) {
    selectedSauce.value = sauce.name
  } else if (sauce.name !== selectedSauce.value) {
    toast.error('Csak egy féle szószt választhatsz!')
  } else {
    selectedSauce.value = null
  }
}

// Felhasználó allergiásE adott ételre

const isUserAllergic = (dish:any) : boolean =>{
  if(!userData.value || !userData.value.allergenables || !dish.allergenables) return false
  return dish.allergenables.some((dishAllergen: any) =>
    userData.value.allergenables.some((userAllergen: any) =>
      dishAllergen.allergy.name === userAllergen.allergy.name
    )
  )
}

// Rendezés
function selectedCategoryHandle(category:string){
  if(selectedCategory.value === category)
    selectedCategory.value = null
  else
  {
    selectedCategory.value = category
    selectedData.value = dishesData.value?.filter((item: dishData) => item.type === category)
  }
}

// Modal actions
const openModal = (dish:any) => {
  if(dish.type == 'Drink' || dish.type == 'SideDish'){
    addToCart(dish)
  }else{
    selectedDish.value = dish
    isModalOpen.value = true
  }
}

const closeModal = () => {
  isModalOpen.value = false
  selectedSauce.value = null
  selectedOptions.value = []
  amount.value = 1
}


onMounted(() => {
  window.scrollTo(0, 0);
  validateToken()
})
</script>


<template>
  <div class="pb-2 mb-4 text-center topMenu" style="background: linear-gradient(90deg, black 0%, #B71C1C 50%, black 100%); border-bottom: solid 1px white;">
    <h1 class="pb-2 pt-2" style="font-weight: bold; color: whitesmoke;">Étlap</h1>
    <v-row style="width: 100%; margin: auto;">
      <v-col cols="6" sm="3" v-for="type in dishTypes" :key="type.name">
        <v-btn class="bg-red-darken-4 mr-3 mb-1 mt-1 buttons" rounded="xl" @click="selectedCategoryHandle(type.name)" :class="{ 'selected-category': selectedCategory == type.name}"><b>{{type.display}}</b></v-btn>
      </v-col>
    </v-row>
  </div>
  <v-container style="margin-bottom: 150px;">
    <v-row>
      <template v-if="!selectedCategory" v-for="(dishes,index) in groupedItems" :key="index">
      <v-col 
        v-for="(dish, index) in dishes"
        :key="`${dish.id}`"
        cols="12" sm="6" md="4" xl="3"
      >
        <v-card class="mx-auto mb-6 dish-card" max-width="344" style="background-color: whitesmoke; box-shadow: 0 0 20px 8px black inset, 0 0 5px 2px black; color: black;" :style="`background-image: url(data:image/png;base64,${dish.img});`">
          <div style="width: 344px; height: 344px;">
            <v-icon 
              v-if="isUserAllergic(dish)" 
              color="red"
              title="Vigyázz: Valószínűleg allergiás vagy erre az ételre!"
              style="position: absolute; top: 15px; left: 15px; z-index: 2; font-size: 52px; padding-bottom: 4px; text-shadow: 1.5px 1.5px 2px darkred; border-radius: 25%; background-color: rgba(0, 0, 0, 0.6);"
            >
              mdi-exclamation-thick
            </v-icon>
          </div>
          <v-card-text style="border-top-left-radius: 40px; border-top-right-radius: 40px; background-color: rgba(255, 255, 255, 0.5); box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.4);">
            <div class="mt-4 dish-data-box">
              <div class="ml-2 mr-2 dish-data">
                <div><b>{{ dish.name }} <a v-if="isUserAllergic(dish)" style="color: red;">!</a></b></div>
                <div v-if="dish.type == 'Drink'">{{ dish.price }}+50 Ft</div>
                <div v-else>{{ dish.price }} Ft</div>
              </div>
              <v-btn class="pl-4 pr-4 pt-2 pb-2 cartButtons" @click="handleAddToCartClicked(dish)">
                <b>Kosárba</b>
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      </template>
      <template v-else>
        <v-col 
        v-for="(dish, index) in selectedData"
        :key="`${dish.id}`"
        cols="12" sm="6" md="4" xl="3"
      >
        <v-card class="mx-auto mb-6 dish-card" max-width="344" style="background-color: whitesmoke; box-shadow: 0 0 20px 8px black inset, 0 0 5px 2px black; color: black;" :style="`background-image: url(data:image/png;base64,${dish.img});`">
          <div style="width: 344px; height: 344px;">
            <v-icon 
              v-if="isUserAllergic(dish)" 
              color="error" 
              title="Vigyázz: Valószínűleg allergiás vagy erre az ételre!"
              style="position: absolute; top: 0px; left: 0px; z-index: 2; font-size: 54px; text-shadow: 1px 1.25px 1px black;"
            >
              mdi-bottle-tonic-skull
            </v-icon>
          </div>
          <v-card-text style="border-top-left-radius: 40px; border-top-right-radius: 40px; background-color: rgba(255, 255, 255, 0.5); box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.4);">
            <div class="mt-4 dish-data-box">
              <div class="ml-2 mr-2 dish-data">
                <div><b>{{ dish.name }} <a v-if="isUserAllergic(dish)" style="color: red;">!</a></b></div>
                <div v-if="dish.type == 'Drink'">{{ dish.price }}+50 Ft</div>
                <div v-else>{{ dish.price }} Ft</div>
              </div>
              <v-btn class="pl-4 pr-4 pt-2 pb-2 cartButtons" @click="handleAddToCartClicked(dish)">
                <b>Kosárba</b>
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      </template>
    </v-row>
  </v-container>
  <div>
    <button @click="notify"></button>
  </div>

  
  <!-- Modal -->
   <v-dialog v-model="isModalOpen" max-width="800px" @click:outside="closeModal" style="background-color: rgba(0, 0, 0, 0.7);">
    <v-card style="background-color:  rgba(255, 255, 255, .95); box-shadow: 0 0 10px 5px white;">
      <div class="modalHeader">
        <div class="modalInfo">
          <v-card-title v-if="selectedDish" class="mb-10"><b>{{ selectedDish.name }}</b></v-card-title>
          <v-card-text v-if="selectedDish">
            <p class="mb-2"><b>Ár:</b> {{ selectedDish.price }} Ft</p>
            <p><b>Leírás:</b> {{ selectedDish.description }}</p>
          </v-card-text>
        </div>
      </div>
      <v-card-text>
        <p class="mt-2 mb-4"><b v-if="selectedDish?.sauceOptions" style="margin-bottom: 2%;">Szósz:</b></p>
        <v-row style="border-bottom: solid 2px black; padding-bottom: 3%;">
          <v-col v-if="selectedDish?.sauceOptions" v-for="(sauce,index) in JSON.parse(String(selectedDish.sauceOptions))" :key="index" cols="12" sm="6" md="6" lg="6" xl="4">
            <div style="display: flex; border: 2px solid rgba(0, 0, 0, 0.4); box-shadow: 0 0 5px .5px rgba(0, 0, 0, 0.4); border-radius: 10px; width: 100%; align-items: center; padding: 3%;">
              <p style="width: 80%;"><b>{{ sauce.name }}: </b></p>
              <v-btn style="width: 20%; padding: 0; border: 1px solid black; box-shadow: 0 0 5px .25px black" @click="handleSauceSelected(sauce)" :class="{ 'selected-button': selectedSauce == sauce.name || JSON.parse(String(selectedDish.sauceOptions)).length == 1}"><v-icon>mdi-plus</v-icon></v-btn>
            </div>
          </v-col>
        </v-row>
        <p class="mt-4 mb-4" style="padding-top: 3%;"><b v-if="selectedDish?.customizationOptions" style="margin-bottom: 2%;">Opciók:</b></p>
        <v-row style="border-bottom: solid 2px black; padding-bottom: 3%; align-items: center;">
          <v-col v-if="selectedDish?.customizationOptions" v-for="(dishOption,index) in JSON.parse(selectedDish.customizationOptions)" :key="index" cols="12" sm="6" md="6" lg="6" xl="4">
            <div style="display: flex; border: 2px solid rgba(0, 0, 0, 0.4); box-shadow: 0 0 5px .5px rgba(0, 0, 0, 0.4); border-radius: 10px; width: 100%; align-items: center; padding-left: 2%; padding-right: 2%; flex-direction: column; padding-bottom: 2%;">
              <p style="width: 96%; padding: 2%;"><b>{{ dishOption.name }}: </b></p>
              <div style="display: flex; justify-content: space-evenly; align-items: center;width: 96%; padding: 2%;">
                <p style="width: 50%; ">{{ dishOption.price }} Ft</p>
                <v-btn style="width: 25%; border: 1px solid black; box-shadow: 0 0 5px .25px black" @click="handleOptionSelected(dishOption)" :class="{'selected-button': selectedOptions.some(o => o.name == dishOption.name) }"><v-icon>mdi-plus</v-icon></v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions style="display: flex;">
        <v-btn color="red" @click="closeModal" style="width: 25%;"><b>Vissza</b></v-btn>
        <div style="width: 50%; display: flex; margin: auto;">
          <div style="width: 33%;">
            <v-btn @click="amount > 1 ? amount-- : amount" style="width: 100%;" v-if="amount > 1" ><v-icon>mdi-minus</v-icon></v-btn>
          </div>
          <p color="black" style="width: 33%; margin: auto; text-align: center; font-weight: bolder;">{{amount}}</p>
          <v-btn @click="amount++" style="width: 33%;"><v-icon>mdi-plus</v-icon></v-btn>
        </div>
        <v-btn color="green" @click="addToCart(selectedDish)"  style="width: 25%;"><b>Kosárba</b></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

.selected-category{
  background-image: linear-gradient(320deg, black, #B71C1C, black);
  border-color: black;
  box-shadow: 0 0 2px .5px black inset, 0 0 10px 2px black !important;
}

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
  transition: transform .5s ease-in-out, box-shadow .5s ease-in-out, border-color .5s ease-in-out;
}

.dish-card:has(.cartButtons:hover) {
  transform: scale(1.05) translateY(-3%);
  box-shadow: 0 0 5px 5px black inset, 0 0 5px 2px black;
  border-color: black;
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
  box-shadow: 0 0 5px .5px whitesmoke !important;
  transition: all .7s ease-in-out, box-shadow .7s ease-in-out;
  animation: 1s ease-in slideInFromTop;
}

.buttons:hover{
  transform: scale(1.1);
  box-shadow: 0 0 2px .5px whitesmoke inset, 0 0 10px 2px whitesmoke;

}

.modalHeader{
  display: flex;
  flex-direction: row-reverse;
  width: 100%;
  height: 100%;
  border-bottom:solid 2px black;
}

.modalInfo{
  width: 100%;
}

.selected-button{
  background-color: green;
  color: white;
}


/* Animations */
@keyframes slideInFromTop {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes sizeUp {
  0%   { transform:scale(0); opacity: 0; }
  100% { transform:scale(1); opacity: 1; }
}

@keyframes fade {
  0% {opacity: 0;}
  100% {opacity: 1;}
}
</style>