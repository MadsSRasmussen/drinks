<template>
    <div class="navbarContainer">
        <h1 class="navBarUsername">{{ username }}</h1>
        <div class="navigationLinkContainer">
            <NavbarNavigationLink destination="/dev/dashboard" text="Dashboard" :disabled="currentPath == '/dev/dashboard' ? true : false" />
            <NavbarNavigationLink destination="/dev/games" text="Games" :disabled="currentPath == '/dev/games' ? true : false"/>
            <NavbarNavigationLink destination="/dev/users" text="Users" :disabled="currentPath == '/dev/users' ? true : false"/>
        </div>
        <div class="navBarButtonContainer">
            <button @click="handleSignOut()" class="navBarLogoutBtn">Log out</button>
        </div>
    </div>
</template>

<style scoped>
.navbarContainer {
    background-color: var(--background-color-alternate);
    border-bottom: 4px solid var(--accent-color-main);
    box-sizing: border-box;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 25px;
}
.navigationLinkContainer {
    display: flex;
    justify-content: center;
}

.navBarUsername {
    width: 300px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

.navBarButtonContainer {
    width: 300px;
    direction: rtl;
}

.navBarLogoutBtn {
    height: 40px;
}
</style>

<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { ref } from 'vue';
import { Users } from '../firebase.js'

import NavbarNavigationLink from './Navbar-components/NavbarNavigationLink.vue';

const router = useRouter();

const props = defineProps({
    currentPath: String
})

function handleSignOut() {
    Users.signOut()
        .then(() => {
            router.push("/dev");
        })
}

const username = ref(Users.currentUser.name)
</script>