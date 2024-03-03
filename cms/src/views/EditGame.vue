<template>
    <div class="background">
        <Navbar current-path="/dev/games" />
        <div class="editContent">
            <div class="topInputsContainer">
                <input
                    @change="updateGameName"
                    @keyup.enter="updateGameName"
                    type="text"
                    class="nameInput"
                    placeholder="Title..."
                    v-model="gameName"
                />
                <div class="rightSideInputs">
                    <select
                        @change="updateGameCategory"
                        v-model="gameCategory"
                        class="gameSelect"
                    >
                        <option value="outdoor">Outdoor</option>
                        <option value="cards">Cards</option>
                        <option value="nude">Nude</option>
                        <option value="dice">Dice</option>
                    </select>
                    <button class="btn">Edit image</button>
                    <button @click="showCardDelete = true" class="btn danger">
                        Delete game
                    </button>
                </div>
            </div>
            <CardsList
                ref="cardsList"
                @create-card="createCard"
                @edit-card="editCard"
            />
        </div>
        <EditCard
            v-if="showCardEdit"
            :show="showCardEdit"
            :gameId="$route.params.id"
            :card="cardToEdit"
            :newCard="newCard"
            :index="indexOfCardToEdit"
            @created-card="
                showCardEdit = false;
                cardsList.update();
            "
            @updated-card="
                showCardEdit = false;
                cardsList.update();
            "
            @deleted-card="
                showCardEdit = false;
                cardsList.update();
            "
            @cancel-edit="
                showCardEdit = false;
                cardsList.update();
            "
        />
        <DeleteCard
            v-if="showCardDelete"
            :show="showCardDelete"
            @cancel-delete="showCardDelete = false"
        />
    </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getGame, getCardsForGame, updateGame } from "../firebase.js";

import Navbar from "@/components/Navbar.vue";
import CardsList from "@/components/lists/CardsList.vue";
import EditCard from "@/components/popups/EditCard.vue";
import DeleteCard from "@/components/popups/DeleteCard.vue";

const game = ref(null);
const gameName = ref("");
const gameCategory = ref("");

const cardsList = ref(null);

const showCardEdit = ref(false);
const showCardDelete = ref(false);
const newCard = ref(null);

// Values emitted from cardsList:
const cardToEdit = ref(null);
const indexOfCardToEdit = ref(null);

const route = useRoute();

getGame(route.params.id)
    .then((gameResult) => {
        game.value = gameResult;
        gameName.value = gameResult.name;
        gameCategory.value = gameResult.category;
    })
    .catch((error) => {
        console.error(error);
    });

function createCard(indexOfNewCard) {
    newCard.value = true;
    cardToEdit.value = null;
    indexOfCardToEdit.value = indexOfNewCard;
    showCardEdit.value = true;
}

function editCard(cardIndex, card) {
    newCard.value = false;
    cardToEdit.value = card;
    indexOfCardToEdit.value = cardIndex;
    showCardEdit.value = true;
}

function updateGameName() {
    updateGame(route.params.id, {
        name: gameName.value ? gameName.value : "",
    })
        .then(() => {
            console.log("successfully updated name!");
        })
        .catch((error) => {
            console.error(error);
        });
}

function updateGameCategory() {
    updateGame(route.params.id, {
        category: gameCategory.value ? gameCategory.value : "",
    })
        .then(() => {
            console.log("Successfully updated category!");
        })
        .catch((error) => {
            console.error(error);
        });
}
</script>

<style scoped>
.rightSideInputs {
    align-items: center;
}
.btn {
    height: 48px;
}
.danger {
    background-color: var(--warning-color);
}

.danger:hover {
    background-color: var(--background-color-alternate-hover);
}
.gameSelect {
    font-size: 16px;
    font-weight: bold;
    padding: 10px;
    width: 150px;
    height: 50px;
    border: 2px solid var(--accent-color-main);
    border-radius: 8px;
    margin: 0px 6px;
}
.topInputsContainer {
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.nameInput {
    width: 300px;
    background: none;
    border: none;
    font-size: 28px;
    font-weight: bold;
}

.nameInput:focus {
    outline: none;
}
.editContent {
    padding: 25px;
    max-height: calc(100vh - 125px);
    overflow: auto;
}
.background {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background-color: var(--background-color-main);
}
</style>
