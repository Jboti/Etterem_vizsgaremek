<script lang="ts" setup>
import { useGetDishes } from '@/api/menuItems/itemsQuery'

const { data } = useGetDishes()
</script>

<template>
  <h1 class="bg-red-darken-4 text-center">Menu</h1>

  <div class="bg-red-darken-4 pt-3 pb-3 text-center">
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
            <div class="text-subtitle1">{{ dish.price }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
