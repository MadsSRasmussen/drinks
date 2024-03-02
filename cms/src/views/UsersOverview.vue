<template>
    <div class="background">
        <Navbar current-path="/dev/users" />
        <div class="usersContent">
            <UsersList ref="usersList" @edit-user="editUser" />
        </div>
    </div>
    <EditUser
        v-if="showUserEdit"
        :show="showUserEdit"
        :user="editingUser"
        @user-updated="handleUserUpdated"
    />
</template>

<style scoped>
.title {
    display: flex;
    justify-content: center;
}
.background {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background-color: var(--background-color-main);
}

.usersContent {
    display: flex;
    flex-direction: column;
    padding: 25px 50px;
}
</style>

<script setup>
import { ref } from "vue";

import { Users } from "../firebase.js";

import Navbar from "@/components/Navbar.vue";
import UsersList from "@/components/lists/UsersList.vue";
import EditUser from "@/components/popups/EditUser.vue";

const editingUser = ref(null);
const showUserEdit = ref(false);

const usersList = ref(null);

function editUser(uid) {
    Users.getUserById(uid)
        .then((userValue) => {
            editingUser.value = userValue;
            showUserEdit.value = true;
        })
        .catch((error) => {
            console.error(error);
        });
}

function handleUserUpdated(uid) {
    console.log("User with id: ", uid, " succesfully updated!");
    showUserEdit.value = false;
    usersList.value.update();
}
</script>
