<template>
    <Transition>
        <div v-if="show" class="backdrop">
            <div class="container" @keyup.enter="createUser">
                <h1>Create account</h1>
                <input class="textInput" type="text" v-model="name" placeholder="Name">
                <input class="textInput" type="text" v-model="email" placeholder="Email">
                <input class="textInput" type="password" v-model="password" placeholder="Password">
                <button class="primaryAction" @click="createUser()">create user</button>
                <p>Efter du har lavet en bruger, skal du autoriseres for at kunne bruge udviklingsplatformen</p>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
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
    height: 450px;
    width: 415px;
    box-shadow: 10px 10px;
    text-align: center;
}
</style>

<script setup>
import { ref } from 'vue';
import { Users } from '../firebase.js';

const props = defineProps({
    show: Boolean
})

const emit = defineEmits(['userCreated'])

const name = ref("");
const email = ref("");
const password = ref("");

function createUser() {
    Users.createUser(name.value, email.value, password.value)
        .then((uid) => {
            emit('userCreated');
        });
}
</script>