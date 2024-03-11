<template>
    <div class="gamesContainer">
        <button @click="addGame" class="primaryAction addGameBtn">
            New game
        </button>
        <div v-for="game in games" class="gamesPillContainer">
            <div
                v-if="game.status != 'stable'"
                class="gamePill gamePillInvalid"
            >
                <div class="pillContent titleContent">
                    Title: {{ game.name }}
                </div>
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

            <div
                @click="editGame(game.id)"
                v-else
                class="gamePill gamePillValid"
            >
                <div class="pillContent titleContent">
                    Title: {{ game.name }}
                </div>
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
        </div>
        <button v-if="!loadedAll" @click="loadMoreGames">Show 5 more</button>
        <div v-else class="loadedAllInfoField">All games already loaded...</div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getGames, createEmptyGame } from "../../firebase.js";

const router = useRouter();

const games = ref(null);
let lastViewed = null;

const loadedAll = ref(false);

getGames().then((data) => {
    games.value = data[0];
    lastViewed = data[1];
});

function editGame(gid) {
    router.push("/dev/games/" + gid);
}

function loadMoreGames() {
    getGames(lastViewed).then((data) => {
        const returnedGames = data[0];
        returnedGames.forEach((game) => {
            games.value.push(game);
        });

        lastViewed = data[1];

        if (!lastViewed) {
            loadedAll.value = true;
        }
    });
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
.addGameBtn {
    border: none;
    width: 50px;
    float: right;
}

.gamePill {
    height: 50px;
    border-radius: 8px;
    padding: 8px 24px;
    display: grid;
    align-items: center;
    grid-template-columns: 1fr 1fr 1fr 1fr;
}

.gamePillValid {
    background-color: var(--background-color-alternate);
    cursor: pointer;
    border: 2px solid var(--accent-color-main);
}

.gamePillInvalid {
    cursor: not-allowed;
    border: 2px solid black;
}

.gamePillValid:hover {
    background-color: var(--accent-color-main);
}

.gamesPillContainer {
    margin: 4px 0px;
}

.pillContent {
    box-sizing: border-box;
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
