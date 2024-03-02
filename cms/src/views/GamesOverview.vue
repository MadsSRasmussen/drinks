<template>
    <div class="background">
        <Navbar current-path="/dev/games" />
        <div class="gamesContent">
            <GamesList />
        </div>
    </div>
</template>

<style scoped>
.background {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background-color: var(--background-color-main);
}

.gamesContent {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 25px;
}
</style>

<script setup>
import Navbar from "@/components/Navbar.vue";
import GamesList from "@/components/lists/GamesList.vue";
</script>
