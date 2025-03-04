<script lang="ts" setup>
import { useValidateToken } from '@/api/auth/authQuery';
import type { placeOrderData } from '@/api/menuItems/items';
import { useGetUserInfo, usePlaceOrder } from '@/api/user/userQuery';
import { useCartStore } from '@/stores/cartStore';
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

const { push } = useRouter()
const cartStore = useCartStore()
const notify = () => {}

// API hívások
const { isError, mutate: validateToken } = useValidateToken()
const { data: userInfoData } = useGetUserInfo()
const { mutate, isPending } = usePlaceOrder()

// Állapot változók
const isModalOpen = ref<boolean>(false)
const takeAway = ref<boolean>(false)
const usePoints = ref<boolean>(false)
const pointsUsed = ref<number>(0)
const message = ref<string>("")

// Modal actions
const openModal = () => { isModalOpen.value = true }
const closeModal = () => { isModalOpen.value = false }


function removeItemFromCart(itemId : number) {
  const index = cartStore.items.findIndex((item) => item.cartId === itemId)
  if(cartStore.items[index].quantity == 1){
    const item = document.getElementById(String(itemId))
    item?.classList.add('cart-item-remove')
    setTimeout(() => {
      cartStore.removeItem(itemId)
    }, 500);
  }else
  cartStore.removeItem(itemId)
}

// Szűrés
const categoryOrder = ['Wrap', 'Kebab', 'Drink']
const groupedItems = computed(() => {
  const groups: Record<string, typeof cartStore.items> = {};
  cartStore.items.forEach((item) => {
    if (!groups[item.type]) {
      groups[item.type] = []
    }
    groups[item.type].push(item)
  })
  return Object.fromEntries(
    categoryOrder.filter((category) => groups[category]).map((category) => [category, groups[category]])
  )
})


function placeOrder() {
  const placeOrderDataRef = ref<placeOrderData>({
    totalPrice: cartStore.totalPrice,
    message: message.value == "" ? " " :  message.value, 
    takeAway: takeAway.value,
    dishIds: [],
    dishAmounts: [],
    dishCustomizations: [],
    pointsUsed: pointsUsed.value
  })

  for (let i = 0; i < cartStore.items.length; i++) {
    placeOrderDataRef.value.dishIds.push(cartStore.items[i].dishId)
    placeOrderDataRef.value.dishAmounts.push(cartStore.items[i].quantity)
    const options = (cartStore.items[i].sause ? cartStore.items[i].sause : '') + (cartStore.items[i].options ? ', '+cartStore.items[i].options : '')
    placeOrderDataRef.value.dishCustomizations.push(options)
  }

  mutate(placeOrderDataRef.value,{
    onSuccess(data) {
      push({name:"order-placed",params:{id:data.id, price: (cartStore.totalPrice-pointsUsed.value)}})
      cartStore.clearCart()
      setTimeout(() => 
        toast.success("Rendelés leadva!")
      ,100)
      
    },
    onError(error: any) {
      toast.error(error.response?.data?.errmessage || "Valami hiba történt, kérjük próbáld meg újra!")
    }
})
}

onMounted(() => {
  window.scrollTo(0, 0);
  validateToken()
})
</script>


<template>
  <div v-if="isError">
    <v-card class="mt-8 logged-out" style="text-align: center;"><h1><b>Ahoz hogy rendelj be kell jelentkezned!</b></h1></v-card>
  </div>

  <div v-else>
    <div v-if="cartStore.items.length==0">
      <v-card class="mt-8 empty-cart"><h1><b>A kosár üres!</b></h1></v-card>
    </div>
    <div v-else>
      <div class="order-options">
        <div class="total-price-div">
          <v-card class="totla-price-card">
            <h1 class="total-price">Összeg: {{cartStore.totalPrice}} Ft</h1>
          </v-card>
        </div>
        <div class="order-buttons">
          <div class="place-order-div">
            <v-btn @click="openModal()" class="place-order" :loading="isPending" size="x-large">Rendelés</v-btn>
          </div>
          <div class="clear-cart-div">
            <v-btn @click="cartStore.clearCart()" class="clear-cart" size="x-large">Kosár kiürítése</v-btn>
          </div>
        </div>
      </div>
      <div style="margin-bottom: 17.5dvh;">
          <div v-for="(items, type) in groupedItems" :key="type">
            <h2 class="mt-4 mb-2 pl-4 groups">{{ type === 'Drink' ? "Üdítő" : type}}:</h2>
            
            <v-row class="cart">
              <v-col 
                v-for="item in items" 
                :key="item.cartId"  
                :id="item.cartId.toString()"
                cols="12" sm="12" md="12" xl="12">
                <v-card color="#B71C1C" style="box-shadow: 0 0 20px 8px black inset, 0 0 5px 2px black; color: whitesmoke; text-shadow: 1px 2px black; max-width: 1000px; margin: auto;">
                  <v-card-item class="ml-5">
                    <v-card-title v-if="item.quantity>1" class="multiline-text">{{ item.name }} x{{ item.quantity }}</v-card-title>
                    <v-card-title v-else class="multiline-text">{{ item.name }}</v-card-title>
                    <v-card-subtitle v-if="item.sause" class="multiline-text mt-2" style="opacity: 1;">Szósz: {{ item.sause }}</v-card-subtitle>
                    <v-card-subtitle v-if="item.options" class="multiline-text" style="opacity: 1;">Módosítások: {{ item.options }}</v-card-subtitle>
                    <v-card-title v-if="item.type != 'Drink'" class="multiline-text">{{ item.price*item.quantity }} Ft</v-card-title>
                    <v-card-title v-else class="multiline-text">{{ item.price*item.quantity-50*item.quantity }}+{{50*item.quantity}} Ft</v-card-title>
                  </v-card-item>
                  <v-btn class="mt-5 ml-8 mb-5 remove-button"  @click="removeItemFromCart(item.cartId)" color="red"><v-icon>mdi-delete</v-icon></v-btn>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </div>
      </div>
  </div>
  <div>
      <button @click="notify"></button>
  </div>


   <!-- Modal -->
   <v-dialog v-model="isModalOpen" max-width="800px" @click:outside="closeModal" style="background-color: rgba(0, 0, 0, 0.7);">
    <v-card style="background-color:  rgba(255, 255, 255, .9); box-shadow: 0 0 10px 5px white;">
      <v-card-title style="text-align: center; font-weight: bold; font-size: clamp(1rem, 3.5dvh, 3rem);">Rendelés</v-card-title>
      <v-divider class="mb-6 border-opacity-50"></v-divider>
      <v-textarea v-model="message" label="Megjegyzés" style=" width: 90%; margin: auto;" variant="solo-filled" clearable auto-grow ></v-textarea>
      <v-checkbox v-model="takeAway" label="Elvitel (+100 Ft)" color="success" style="width: 92.5%; margin: auto;" @change="takeAway ? cartStore.totalPrice += 100 : cartStore.totalPrice -= 100"></v-checkbox>
      <v-checkbox v-model="usePoints" label="Pont beváltás" color="success" style="width: 92.5%; margin: auto;" @change="!usePoints ? pointsUsed = 0 : pointsUsed"></v-checkbox>
      <div v-if="usePoints"  style="width: 92.5%; margin: auto;">
        <v-card-title>Pontok: {{ userInfoData.points }}</v-card-title>
        <v-number-input
          style=" width: 50%; margin: 1%;"
          control-variant="stacked"
          v-model="pointsUsed"
          :max="Math.min(cartStore.totalPrice, userInfoData.points)"
          :min="0"
          :step="5"
          @onchange="pointsUsed ? pointsUsed : 0"
          ></v-number-input>
      </div>
      <v-card-title style="width: 100%; text-align: center;" v-if="usePoints">Végösszeg: {{cartStore.totalPrice - pointsUsed}} Ft</v-card-title>
      <v-card-title style="width: 100%; text-align: center;" v-else>Végösszeg: {{cartStore.totalPrice}} Ft</v-card-title>
      <v-divider class="border-opacity-50"></v-divider>
      <v-card-actions style="display: flex;">
        <v-btn color="red" @click="closeModal" style="width: 25%;"><b>Vissza</b></v-btn>
        <div style="width: 40%;"></div>
        <v-btn color="green" @click="placeOrder()" style="width: 35%;"><b>Megrendel</b></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

.order-options{
  margin: auto;
  margin-top: 2dvh;
  height: 20dvh;
  max-width: 1250px;
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
}

.order-buttons{
  width: 50%;
  display: flex;
  flex-direction: row;
  height: 50%;
  align-items: center;
}

.clear-cart-div{
  width: 95%;
  text-align: center;
}

.clear-cart{
  font-size: clamp(8px, 1.5dvh, 20px);
  width: 75%;
  max-width: 300px;
  background-image: linear-gradient(to right, red 10%,  black 100%);
  background-size: 200% auto;
  animation: .7s ease-in-out slideInFromRight;
}

.total-price-div{
  width: 50%;
  height: 50%;
  animation: .7s ease-in-out slideInFromTop;
}

.totla-price-card{

  width: 95%;
  margin: auto;
  background-color: rgba(255, 255, 255, 0.8) ;
  box-shadow: 0 0 10px 5px black;
  padding: 1dvw;
}

.total-price{
  color: black;
  width: 100%;
  text-align: center;
}

.place-order-div{
  width: 95%;
  text-align: center;
}

.place-order{
  width: 75%;
  max-width: 300px;
  background-image: linear-gradient(to right, green 10%,  black 100%);
  background-size: 200% auto;
  animation: .7s ease-in-out slideInFromLeft;
}

.place-order, .clear-cart{
  text-shadow: 1px 2px black;
  width: 100%;
  color: whitesmoke;
  transition: all .7s ease-in-out;
  transform: scale(90%);
  font-size: clamp(10px, 3vw, 20px);
  box-shadow: 0 0 5px 2px black inset, 0 0 5px .5px black;
  display: flex !important;
  flex-wrap: nowrap;
  align-items: center;
  margin: auto;
}

.place-order:hover, .clear-cart:hover{
  transform: scale(1.1);
  background-position: right;
  box-shadow: 0 0 5px 2px black inset, 0 0 5px .5px black;
}

.cart{
  margin: auto;
  width: 75%;
  animation: 1.2s ease-in-out fade;
}

.groups{
  color: whitesmoke;
  border-bottom: 2px solid whitesmoke;
  width: 95%;
  margin: auto;
  text-shadow: 2px 2px black;
  max-width: 1250px;
  animation: .7s ease-in-out slideInFromLeft;
}

.multiline-text{
  word-wrap: break-word;
  white-space: normal;
  overflow: visible;
}

.remove-button{
  width: 50%;
  float: left;
  max-width: 150px;
  box-shadow: 0 0 5px .5px black inset, 0 0 10px .5px black;
  margin:2%;
  margin-left: 0;
  transition: all .7s ease-in-out;
}

.remove-button:hover{
  transform: scale(1.2);
  box-shadow: 0 0 5px .5px black inset, 0 0 10px .5px black;
}

.cart-item-remove{
  animation: slideOutLeft .7s forwards
}

.logged-out{
  margin: auto;
  width: 90%;
  max-width: 1000px;
  height: 20dvh;
  background-color: #B71C1C;
  box-shadow: 0 0 40px 8px black inset, 0 0 5px 2px black;
  color: whitesmoke;
  text-shadow: 0 3px black;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: .7s ease-in-out fade;
}

.empty-cart{
  margin: auto;
  width: 90%;
  max-width: 1000px;
  height: 20dvh;
  background-color: #B71C1C;
  box-shadow: 0 0 40px 8px black inset, 0 0 5px 2px black;
  color: whitesmoke;
  text-shadow: 0 3px black;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: .7s ease-in-out fade;
}

/* Media query */
@media screen and (max-width: 950px){
  .cart{
    width: 95%;
  }
  .order-options{
    margin-bottom: 5dvh;
    width: 100%;
  }
  .order-buttons{
    width: 100%;
  }
  .clear-cart-div,.place-order-div, .total-price-div{
    width: 100%;
    margin: 1.5%;
  }
  .clear-cart, .place-order{
    padding: 2dvh;
  }
  .totla-price-card{
    width: 90%;
  }
}

/* Animations */
@keyframes fade {
  0%   { opacity:0; }
  100% { opacity:1; }
}

@keyframes slideInFromLeft {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes slideInFromRight {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
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

@keyframes slideOutLeft {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(-100%);
    opacity: 0;
  }
}
</style>