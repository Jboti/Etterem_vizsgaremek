<script lang="ts" setup>
import { useGetDishes } from '@/api/menuItems/itemsQuery';


const { data } = useGetDishes()

</script>
<template>
  <h1>Menu</h1>
  {{ data }}
</template>
