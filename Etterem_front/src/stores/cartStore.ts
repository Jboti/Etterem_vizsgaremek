import type { cartItem } from '@/api/menuItems/items';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCartStore = defineStore('cart', () => {
  let items = ref<cartItem[]>([])
  let totalItems = ref(0)
  let totalPrice = ref(0)
  let cartId = ref(0)
  
  function addItem(item:cartItem) {
    const index = items.value.findIndex((Eitem) => Eitem.dishId === item.dishId && Eitem.sause === item.sause && Eitem.options === item.options)
    if(index !== -1) {
      totalPrice.value += item.price*item.quantity
      items.value[index].quantity += item.quantity
      totalItems.value += item.quantity
    }else{
      for(let i = 0;i<item.quantity;i++) {
        totalPrice.value += item.price      
        totalItems.value++
      }
      item.cartId = cartId.value
      cartId.value++
      items.value.push(item)
    }
  }

  function removeItem(Id:number) {
    const index = items.value.findIndex((item) => item.cartId === Id)
    if (index !== -1) {
      totalPrice.value -= items.value[index].price
      totalItems.value--
      if(items.value[index].quantity > 1 )
        items.value[index].quantity--
      else
        items.value.splice(index, 1)
    }
  }

  function clearCart(){
    items.value = []
    totalItems.value = 0
    totalPrice.value = 0
    cartId.value = 0
  }


  return { items, totalPrice, totalItems, addItem, removeItem, clearCart}
})
