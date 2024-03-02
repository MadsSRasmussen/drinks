<script setup>
import { RouterLink } from 'vue-router'
</script>
<template>
  <div class="background">
    <section class="title">
      <h1>This is an about page</h1>
    </section>
    <section class="middle">
      <p>Meget vigtig information om applikationen...</p>
    </section>
    <section class="end">
      <p>Her er lidt mere information, vil du tilbage til <RouterLink to="/">hovedsiden</RouterLink>? Den er nemlig også rigtig fed!</p>
    </section>
    
  </div>
</template>
<style scoped>
.title h1{
  font-size: max(3.5vw, 56px);
}

section.middle p {
  background-color: var(--accent-color-main);
  color: var(--foreground-color-alternate);
  border-radius: 25px;
  box-sizing: border-box;
  padding: 8px 12px;
}
.background{
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: var(--background-color-main);
  /*font-family: var(--font-family)*/
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
