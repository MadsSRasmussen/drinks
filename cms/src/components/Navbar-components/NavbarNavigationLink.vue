<template>
    <button @click="router.push(destination)" class="navbarNavigationButton" :class="disabled ? 'disabled' : ''">{{ text }}</button>
</template>
<style scoped>
.navbarNavigationButton {
    border: none;
    height: 100%;
    transition: 400ms;
    border-radius: 0px;
    height: 40px;
}

.navbarNavigationButton:hover {
    background-color: var(--accent-color-main);
}

.disabled {
    pointer-events: none;
    background-color: var(--accent-color-main);
    color: var(--foreground-color-alternate);
}

</style>
<script setup>
import { logEvent } from 'firebase/analytics';
import { RouterLink, useRouter } from 'vue-router'

const props = defineProps({
    destination: String,
    text: String,
    disabled: {
        default: false,
        type: Boolean
    },
})

const router = useRouter();
</script>