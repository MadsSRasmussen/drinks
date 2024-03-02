<template>
    <div class="gamesContainer">
        <div
            v-for="game in games"
            class="gamesPillContainer"
            :class="game.status == 'processing' ? 'unstablePill' : ''"
            @click="editGame(game.id)"
        >
            <div class="pillContent titleContent">Title: {{ game.name }}</div>
            <div class="pillContent categoryContent">
                Category: {{ game.category }}
            </div>
            <div class="pillContent imageContent">
                Logo Image: {{ game.image ? game.image : "N/A" }}
            </div>
            <div class="pillContent statusContent">
                Status: {{ game.status }}
            </div>
        </div>
        <button @click="addGame">Add game</button>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getGames, createEmptyGame } from "../../firebase.js";

const router = useRouter();

const games = ref(null);

getGames().then((data) => {
    games.value = data;
});

function editGame(gid) {
    router.push("/dev/games/" + gid);
}

function addGame() {
    createEmptyGame()
        .then((docRef) => {
            console.log(docRef);
            router.push("/dev/games/" + docRef.id);
        })
        .catch((error) => {
            console.error(error);
        });
}
</script>

<style scoped>
.gamesPillContainer {
    border: 2px solid var(--accent-color-main);
    box-sizing: border-box;
    border-radius: 8px;
    padding: 8px 24px;
    height: 50px;
    width: 100%;
    background-color: var(--background-color-alternate);
    cursor: pointer;
    display: flex;
    align-items: center;
    margin: 8px 0px;
    transition: 400ms;
}

.gamesPillContainer:hover {
    background-color: var(--accent-color-main);
}

.pillContent {
    box-sizing: border-box;
    width: 25%;
}

.unstablePill {
    background-color: var(--proccessing-color);
    border: none;
    cursor: default;
}

.unstablePill:hover {
    background-color: var(--proccessing-color);
}

.gamesContainer {
    display: flex;
    flex-direction: column;
    width: 100%;
}
</style>
