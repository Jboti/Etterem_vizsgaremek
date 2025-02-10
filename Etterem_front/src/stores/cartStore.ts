import type { cartItem } from '@/api/menuItems/items';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCartStore = defineStore('cart', () => {
  let items = ref<cartItem[]>([])
  let totalPrice = ref(0)
  let cartId = ref(0)
  
  function addItem(amount:number,item:cartItem) {
    totalPrice.value += item.price
    item.cartId = cartId.value
    cartId.value++
    for (let i = 0; i < amount; i++) {
      items.value.push(item)
    }
    console.log(items.value)
  }

  function removeItem(Id:number) {
    const index = items.value.findIndex((item) => item.cartId === Id)
    if (index !== -1) {
      totalPrice.value -= items.value[index].price
      items.value.splice(index, 1)
    }
  }

  return { items, totalPrice,  addItem, removeItem }
})
