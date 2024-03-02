<template>
    <div class="background">
        <Navbar current-path="/dev/dashboard"/>
        <div class="dashboardContent">
          <h1>Developer Dashboard!</h1>
        </div>
    </div>

</template>
<style scoped>
.dashboardContent{
  display: flex;
  flex-direction: column;
  align-items: center;
}

.background{
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: var(--background-color-main);
}
</style>

<script setup>
import Navbar from '@/components/Navbar.vue';
</script>