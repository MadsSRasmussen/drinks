<template>
    <Transition>
        <div v-if="props.show" class="backdrop">
            <div class="container" @keyup.enter="createUser">
                <p>
                    To confirm delete, write <em>delete</em> in the input-field
                    below:
                </p>
                <h4>Deleting a game will also delete all cards of that game</h4>
                <input
                    type="text"
                    class="textInput deleteGameTextInput"
                    v-model="code"
                />
                <div class="buttonsContainer">
                    <button @click="$emit('cancel-delete')">Cancel</button>
                    <button @click="handleGameDelete" class="confirmDeleteBtn">
                        DELETE
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>
<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

import { deleteGame } from "../../firebase.js";

const props = defineProps({
    show: Boolean,
});

const emit = defineEmits(["cancel-delete"]);

const code = ref(null);

const router = useRouter();
const route = useRoute();

function handleGameDelete() {
    if (code.value == "delete") {
        deleteGame(route.params.id)
            .then(() => {
                router.push("/dev/games");
            })
            .catch((error) => {
                console.error(console.error(error));
            });
    }
}
</script>
<style>
.buttonsContainer {
    display: flex;
}
.deleteGameTextInput {
    text-align: center;
    width: 120px;
    margin-bottom: 15px;
}
.confirmDeleteBtn {
    background-color: var(--warning-color);
}

.confirmDeleteBtn:hover {
    background-color: var(--background-color-alternate-hover);
}
.backdrop {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
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
    height: 310px;
    width: 300px;
    box-shadow: 10px 10px;
    text-align: center;
}
</style>
