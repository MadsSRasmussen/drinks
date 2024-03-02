<template>
    <Transition>
        <div v-if="props.show" class="backdrop">
            <div class="container" @keyup.enter="createUser">
                <input type="text" class="titleInput" placeholder="Title..." v-model="title">
                <div class="imageContainer">
                    Image not available
                </div>

                <h4 style="margin-bottom: 5px;">Content:</h4>
                <textarea type="text" class="textInput editorTextarea" v-model="content"></textarea>
                <div class="cardEditButtonsContainer">
                    <button v-if="!props.newCard" @click="deleteCardHandler" class="deleteButton">Delete</button>
                    <button @click="cancel">Cancel</button>
                    <button v-if="props.newCard" @click="createCardHandler" class="primaryAction">Create</button>
                    <button v-else @click="updateCardHandler" class="primaryAction">Save</button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref } from 'vue';

import { createCard, updateCard, deleteCard } from '../firebase.js';

const emit = defineEmits(['created-card', 'cancel-edit', 'deleted-card', 'updated-card']);

const props = defineProps ({
    show: Boolean,
    newCard: Boolean,
    gameId: String,
    card: Object,
    index: Number,
});

const title = ref(props.card ? props.card.title : null);
const content = ref(props.card ? props.card.content : null);

function createCardHandler() {

    const cardObject = {
        title: title.value,
        content: content.value,
        game: props.gameId,
        index: props.index
    }

    createCard(cardObject)
    .then((result) => {
        emit('created-card');
    })
    .catch((error) => {
        console.log(error);
    });

}

function updateCardHandler() {

    const updateObject = {
        title: title.value,
        content: content.value,
        index: props.index,
    }

    const cid = props.card.id;

    updateCard(cid, updateObject)
    .then(() => {
        emit('updated-card');
    })
    .catch((error) => {
        console.error(error);
    })

}

function deleteCardHandler() {
    console.log("Delete!")
    deleteCard(props.card.id)
    .then(() => {
        emit('deleted-card');
    })
    .catch((error) => {
        console.log(error);
    }) 
}

function cancel() {
    console.log("cancel!");
    emit('cancel-edit');
}

</script>

<style scoped>
.deleteButton {
    background-color: var(--warning-color);
}

.deleteButton:hover {
    background-color: var(--background-color-alternate-hover);
}
.editorTextarea{
    width: 90%;
    height: 100px;
    margin: 10px 50px;
    resize: none;
    font-family: var(--font-family);
}
.titleInput {
    width: 100%;
    text-align: center;
    border: none;
    font-size: 28px;
    font-weight: bold;
    margin: 25px;
}

.titleInput:focus{
    outline: none;
}
.cardEditButtonsContainer {
    display: flex;
}

.imageContainer {
    width: 300px;
    max-width: 80%;
    aspect-ratio: 1;
    border: 2px solid var(--accent-color-main);
    display: flex;
    justify-content: center;
    align-items: center;
}
.backdrop {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.4);
    backdrop-filter: blur(5px);
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}
.container {
    padding: 30px;
    background-color: var(--background-color-alternate);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 650px;
    width: 530px;
    box-shadow: 10px 10px;
    text-align: center;
}
</style>