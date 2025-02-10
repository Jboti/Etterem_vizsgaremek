<script lang="ts" setup>
import { useGetUserInfo } from '@/api/user/userQuery';
import { useCartStore } from '@/stores/cartStore';
import { computed, onMounted } from 'vue';

onMounted(() => {
  window.scrollTo(0, 0);
})

const cartStore = useCartStore()
const { isError } = useGetUserInfo()
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
  cartStore.clearCart()
  console.log("Rendelés leadva")
}

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
          <div class="clear-cart-div">
            <v-btn @click="cartStore.clearCart()" class="clear-cart" >Kosár kiürítése</v-btn>
          </div>
          <div class="place-order-div">
            <v-btn @click="placeOrder()" class="place-order">Rendelés</v-btn>
          </div>
        </div>
      </div>
      <div style="margin-bottom: 17.5dvh;">
          <div v-for="(items, type) in groupedItems" :key="type">
            <h2 class="mt-4 mb-2 pl-4" style="color: whitesmoke; border-bottom: 2px solid whitesmoke; width: 95%; margin: auto; text-shadow: 2px 2px black; max-width: 1250px;">{{ type === 'Drink' ? "Üdítő" : type}}:</h2>
            
            <v-row class="cart">
              <v-col 
                v-for="item in items" 
                :key="item.cartId"  
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
                  <v-btn class="mt-5 ml-8 mb-5 remove-button" @click="cartStore.removeItem(item.cartId)" color="red"><v-icon>mdi-delete</v-icon></v-btn>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </div>
      </div>
  </div>
</template>
<style scoped>

.order-options{
  margin: auto;
  height: 20dvh;
  max-width: 1250px;
  display: flex;
  width: 100%;
  align-items: center;
}

.order-buttons{
  width: 50%;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-evenly;
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
}

.total-price-div{
  width: 50%;
  
}

.totla-price-card{
  text-shadow: 1px 2px black;
  width: 75%;
  margin: auto;
  background-color: #B71C1C ;
  box-shadow: 0 0 20px 8px black inset, 0 0 5px 2px black;
  padding: 1dvw;
}


.total-price{
  color: whitesmoke;
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
}


.place-order, .clear-cart{
  text-shadow: 1px 2px black;
  width: 50%;
  color: whitesmoke;
  padding: 1dvw;
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
}

.cart{
  margin: auto;
  width: 75%;
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
}

@media screen and (max-width: 950px){
  .cart{
    width: 95%;
  }
  .order-options{
    flex-direction: column;
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
</style>