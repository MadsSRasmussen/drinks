<template>
    <Transition>
        <div v-if="props.show" class="backdrop">
            <div class="container">
                <h2>Editing user</h2>
                <div class="paragraphContainer">
                    <p><strong>User Id: </strong>{{ props.user.id }}</p>
                    <p><strong>Name: </strong>{{ props.user.name ? props.user.name : "N/A" }}</p>
                    <p><strong>Email: </strong>{{ props.user.email ? props.user.email : "N/A" }}</p>
                    <p><strong>Creation: </strong>{{ props.user.timestamp ? new Date(props.user.timestamp.seconds * 1000) : "N/A" }}</p>
                </div>
                <h3>Auth status:</h3>
                <input type="text" class="textInput authTextInput" v-model="auth">
                <button @click="updateUserAuth" class="primaryAction">Save</button>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref } from 'vue';
import { Users } from '../firebase.js';

const emit = defineEmits(['user-updated']);

const props = defineProps ({
    show: Boolean,
    user: Object,
});

const auth = ref(props.user.auth);

function updateUserAuth() {
    const updateObject = {
        auth: auth.value
    };
    Users.updateUserById(props.user.id, updateObject)
        .then(() => {
            emit('user-updated', props.user.id);
        })
        .catch((error) => {
            console.error(error)
            emit('user-updated', props.user.id);
        });
}

</script>

<style scoped>
h3 {
    margin-bottom: 5px;
}
.paragraphContainer {
    text-align: start;
}
.authTextInput {
    width: 80px;
    text-align: center;
    margin-bottom: 15px;
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
    height: 450px;
    width: 415px;
    box-shadow: 10px 10px;
    text-align: center;
}
</style>