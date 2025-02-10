<script lang="ts" setup>
import { useCartStore } from '@/stores/cartStore';
import { computed } from 'vue';

const cartStore = useCartStore()
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

</script>
<template>
  <!-- <pre>{{cartStore.items}}</pre> -->
  <div v-if="cartStore.items.length==0">
    <h1 style="color: white;">A kosár üres!</h1>
  </div>
  <div v-else>
    <h1 style="color: white;">total: {{cartStore.totalPrice}} Ft</h1>
    <div v-for="(items, type) in groupedItems" :key="type">
      <v-field style="color: white;">{{ type }}:</v-field>
      
      <v-row class="cart">
        <v-col 
          v-for="item in items" 
          :key="item.cartId"  
          cols="12" sm="12" md="12" xl="12">
          <v-card>
            <v-card-item>
              <v-card-title>{{ item.name }}</v-card-title>
              <v-card-subtitle>szósz: {{ item.sause }}</v-card-subtitle>
              <v-card-subtitle v-if="item.options">Módosítások: {{ item.options }}</v-card-subtitle>
              <v-card-title>{{ item.price }} Ft</v-card-title>
            </v-card-item>
            <v-btn @click="cartStore.removeItem(item.cartId)">Törlés</v-btn>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
  
</template>
<style scoped>

.cart{
  margin:auto;
  margin-bottom: 7%;
  width: 75%;
}

@media screen and (max-width: 950px){
  .cart{
    width: 90%;
    margin-bottom: 30%;
  }
}
</style>