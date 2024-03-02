<script setup>
import { RouterLink } from 'vue-router'
</script>
<template>
  <div class="background">
    <section class="title">
      <h1>101-Drukspil</h1>
    </section>
    <section class="middle">
      <p>- Kommer snart! -</p>
    </section>
    <section class="bottom">
      <p>Vil du vide <RouterLink to="/about">mere</RouterLink> om 101-drukspil?</p>
      <p>Er du en af vores udvalgte udviklere? Log på vores <RouterLink to="/dev">udviklerplatform</RouterLink>.</p>
    </section>

  </div>
</template>
<style scoped>
.title h1{
  font-size: max(3.5vw, 56px);
  margin-bottom: 0px;
}

.bottom{
  display: flex;
  flex-direction: column;
  align-items: center;
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