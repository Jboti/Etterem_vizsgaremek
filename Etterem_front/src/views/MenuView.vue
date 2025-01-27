<script lang="ts" setup>
import { useGetDishes } from '@/api/menuItems/itemsQuery'

const { data } = useGetDishes()
</script>

<template>
  
  <div class="pb-2 text-center" style="background: linear-gradient(90deg, black 0%, #B71C1C 50%, black 100%);">
    <h1 class="pb-2" style="font-weight: 700;">Étlap</h1>
    <v-btn class="bg-red-darken-4 mr-3 mb-1 mt-1" rounded="xl"><b>Menük</b></v-btn>
    <v-btn class="bg-red-darken-4 mr-3 mb-1 mt-1" rounded="xl"><b>Kebabok</b></v-btn>
    <v-btn class="bg-red-darken-4 mr-3 mb-1 mt-1" rounded="xl"><b>Köretek</b></v-btn>
    <v-btn class="bg-red-darken-4 mr-3 mb-1 mt-1" rounded="xl"><b>Üdítők</b></v-btn>
  </div>

  <v-container style="margin-bottom: 150px;">
    <v-row>
      <v-col 
        v-for="(dish, index) in data" 
        :key="index" 
        cols="12" sm="6" md="4" xl="3"
      >
        <v-card class="mx-auto" max-width="344" style="background-image: url(background.jpg); background-size: cover; background-position: center; background-repeat: no-repeat;">
          <v-img 
            :src="dish.image" 
            height="200px"
          ></v-img>

          <v-card-text style="border-top: solid black 3px; border-top-left-radius: 30px; border-top-right-radius: 30px; background-color: whitesmoke !important;">
            <div style=" display: flex;
                        flex-direction: row;
                        flex-wrap: nowrap;
                        align-content: space-around;
                        justify-content: space-between;
                        align-items: center;
                        max-height: 5em;
                        min-height: 4em;">
              <div class="ml-2 mr-2" style="max-height: 4em; 
                          display: flex;
                          flex-direction: column;
                          align-items: flex-start;
                          justify-content: center">
                <div><b>{{ dish.name }}</b></div>
                <div>{{ dish.price }} Ft</div>
              </div>
              <v-btn class="pl-4 pr-4 pt-2 pb-2" style="background-color: rgb(22, 139, 22); box-shadow: 0 0 2px 0.25px black inset, 0 0 5px .5px black; "><b>Kosárba</b></v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
