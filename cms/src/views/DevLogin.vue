<template>
    <div class="background">
        <section class="top">
            <h1>Udviklingsplatform</h1>
        </section>
        <section class="content">
            <LoginForm @createUser="showCreateUser = true"></LoginForm>
        </section>
        <Teleport to="body">
            <CreateUserModal
                @userCreated="showCreateUser = false"
                :show="showCreateUser"
            />
        </Teleport>
    </div>
</template>

<style scoped>
.background {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background-color: var(--background-color-main);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

section.content {
    background-color: var(--background-color-alternate);
    box-shadow: 10px 10px;
}

.top {
    font-size: 52px;
}
</style>

<script setup>
import { ref } from "vue";

import LoginForm from "../components/LoginForm.vue";
import CreateUserModal from "../components/popups/CreateUserModal.vue";

const showCreateUser = ref(false);
</script>
