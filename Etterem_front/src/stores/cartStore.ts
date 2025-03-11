import type { cartItem } from '@/api/menuItems/items';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCartStore = defineStore('cart', () => {
  let items = ref<cartItem[]>([])
  let totalItems = ref(0)
  let totalPrice = ref(0)
  let cartId = ref(0)
  
  function addItem(item:cartItem) {
    const index = items.value.findIndex((Eitem) => {
      
      const sortedEitemOptions = Eitem.options?.split(',').map(opt => opt.trim()).sort().join(',')
      const sortedItemOptions = item.options?.split(',').map(opt => opt.trim()).sort().join(',')
      
      return Eitem.dishId === item.dishId && Eitem.sause === item.sause && sortedEitemOptions === sortedItemOptions
    })
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

  function reOrder(purchase: any)
  {
    for(let i = 0; i< purchase.order_dishes.length;i++)
    {
      const tempItem:cartItem = {
        cartId: -1,
        dishId: -1,
        name: '',
        price: 0,
        sause: '',
        options: '',
        type: '',
        quantity: 0
      }

      if(purchase.order_dishes[i].dish.type == "Drink")
      {
        tempItem.dishId = purchase.order_dishes[i].dish_id
        tempItem.name = purchase.order_dishes[i].dish.name
        tempItem.price = purchase.order_dishes[i].dish.price+50
        tempItem.sause = null
        tempItem.options = null
        tempItem.type = purchase.order_dishes[i].dish.type
        tempItem.quantity = purchase.order_dishes[i].amount
      }
      else if(purchase.order_dishes[i].dish.type == "SideDish")
      {
        tempItem.dishId = purchase.order_dishes[i].dish_id
        tempItem.name = purchase.order_dishes[i].dish.name
        tempItem.price = purchase.order_dishes[i].dish.price
        tempItem.sause = null
        tempItem.options = null
        tempItem.type = purchase.order_dishes[i].dish.type
        tempItem.quantity = purchase.order_dishes[i].amount
      }
      else{
        let additionalPrice = 0
        const optionPrices = JSON.parse(purchase.order_dishes[i].dish.customizationOptions)
        const customizationsMade = purchase.order_dishes[i].customizations.split(',').splice(1).join(',').slice(0,-1).split(',')
  
        customizationsMade.forEach((customization:any) => {
          const option = optionPrices.find((opt:any) => opt.name.replace(/\s/g, '') === customization.replace(/\s/g, ''))
            if (option) {
                additionalPrice += option.price
            }
        })
  
        tempItem.dishId = purchase.order_dishes[i].dish_id,
        tempItem.name = purchase.order_dishes[i].dish.name,
        tempItem.price = purchase.order_dishes[i].dish.price+additionalPrice,
        tempItem.sause = purchase.order_dishes[i].customizations.split(',')[0].slice(1),
        tempItem.options = purchase.order_dishes[i].customizations.split(',').splice(1).join(',').slice(0,-1),
        tempItem.type = purchase.order_dishes[i].dish.type,
        tempItem.quantity = purchase.order_dishes[i].amount
      
      }
      addItem(tempItem)
    }
  }


  return { items, totalPrice, totalItems, addItem, removeItem, clearCart, reOrder}
})
