<script lang="ts" setup>
import { useGetUserInfo } from "@/api/user/userQuery"

const { data, isError, error, isLoading } = useGetUserInfo()

</script>

<template>
  <div>
    <div v-if="isLoading" class="spinner"></div>

    <div v-else-if="isError">
      <v-card>
        <h1>Hiba a validáció során, kérlek jelentkezz be újra!</h1>
        <h2>{{ data }}</h2>
      </v-card>
      <!-- <p>{{ error?.response?.data?.errmessage || "An error occurred." }}</p> -->
    </div>

    
    <div v-else>
      <p>Data: {{ data }}</p>
    </div>
  </div>
</template>

<style scoped>
.spinner {
  margin: auto;
  margin-top: 10vh;
  width: 50px;
  height: 50px;
  border: 6px solid #f3f3f3; 
  border-top: 6px solid #B71C1C; 
  border-radius: 50%; 
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>