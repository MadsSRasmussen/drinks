<template>
    <div class="cardsContainer">
        <div
            v-for="card in cards"
            class="cardPillContainer"
            @click="$emit('edit-card', card.index, card)"
        >
            <div class="pillContent indexContent">{{ card.index + 1 }}</div>
            <div class="pillTextContentContainer">
                <div class="pillContent titleContent">
                    Title: {{ card.title }}
                </div>
                <div class="pillContent contentContent">
                    Content: {{ card.content }}
                </div>
            </div>
        </div>
        <button @click="$emit('create-card', cards ? cards.length : 0)">
            Add Card
        </button>
    </div>
</template>
<script setup>
import { ref } from "vue";
import { getCardsForGame } from "../../firebase.js";

import { useRoute } from "vue-router";

const emit = defineEmits(["create-card", "edit-card"]);

const route = useRoute();

const cards = ref([]);

getCardsForGame(route.params.id)
    .then((cardsResult) => {
        cards.value = cardsResult.sort((a, b) => a.index - b.index);
    })
    .catch((error) => {
        console.log(error);
    });

const update = () => {
    getCardsForGame(route.params.id)
        .then((cardsResult) => {
            cards.value = cardsResult.sort((a, b) => a.index - b.index);
        })
        .catch((error) => {
            console.log(error);
        });
};

defineExpose({ update });
</script>
<style scoped>
.pillTextContentContainer {
    display: flex;
    width: 100%;
}
.cardPillContainer {
    border: 2px solid var(--accent-color-main);
    box-sizing: border-box;
    border-radius: 8px;
    padding: 8px 24px;
    height: 50px;
    width: 100%;
    background-color: var(--background-color-alternate);
    cursor: pointer;
    display: flex;
    margin: 8px 0px;
    transition: 400ms;
    align-items: center;
}

.cardPillContainer:hover {
    background-color: var(--accent-color-main);
}

.pillContent {
    box-sizing: border-box;
    width: 50%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.titleContent {
    width: 40%;
}

.cardsContainer {
    display: flex;
    flex-direction: column;
    width: 100%;
}
.indexContent {
    width: 25px;
    box-sizing: border-box;
}
</style>
