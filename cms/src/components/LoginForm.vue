<template @keyup.enter="login">
    <div @keyup.enter="login" class="loginContainer">
        <h2>Login</h2>
        <input class="textInput" type="text" v-model="email" placeholder="Email">
        <input class="textInput" type="password" v-model="password" placeholder="Password">
        <div class="buttonsContainer">
            <button @click="$emit('createUser')">Create user</button>
            <button class="primaryAction" @click="login()">Login</button>
        </div>
    </div>

</template>

<style scoped>

h2 {
    font-size: 38px;
}
.loginContainer {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 50px;
}

</style>

<script setup>
import { ref } from 'vue'
import { Users } from '../firebase.js';
import { useRouter } from 'vue-router';

const emit = defineEmits(['createUser'])

const router = useRouter();

const email = ref("");
const password = ref("");

function login() {
    Users.singIn(email.value, password.value)
        .then((uid) => {
            router.push("/dev/dashboard");
        })
        .catch((error) => {
            console.error(error);
        });
}
</script>