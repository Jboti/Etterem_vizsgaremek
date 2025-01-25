<script lang="ts" setup>
import { useGetDishes } from '@/api/menuItems/itemsQuery'

const { data } = useGetDishes()
</script>

<template>
  
  <div class="pb-2 text-center" style="background: linear-gradient(90deg, black 0%, #B71C1C 50%, black 100%);">
    <h1 class="pb-2">Étlap</h1>
    <v-btn class="bg-red-darken-4 mr-3 mb-1 mt-1" rounded="xl">Menük</v-btn>
    <v-btn class="bg-red-darken-4 mr-3 mb-1 mt-1" rounded="xl">Kebabok</v-btn>
    <v-btn class="bg-red-darken-4 mr-3 mb-1 mt-1" rounded="xl">Köretek</v-btn>
    <v-btn class="bg-red-darken-4 mr-3 mb-1 mt-1" rounded="xl">Üdítők</v-btn>
  </div>

  <v-container style="margin-bottom: 150px;">
    <v-row>
      <v-col 
        v-for="(dish, index) in data" 
        :key="index" 
        cols="12" sm="6" md="4" xl="3"
      >
        <v-card class="mx-auto" max-width="344">
          <v-img 
            :src="dish.image" 
            height="200px"
          ></v-img>

          <v-card-text>
            <div class="text-h6">{{ dish.name }}</div>
            <div class="text-subtitle1">{{ dish.price }} Ft</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
