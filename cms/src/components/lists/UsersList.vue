<template>
    <table>
        <tr>
            <th>Username:</th>
            <th>Email:</th>
            <th style="width: 145px">Auth-status:</th>
            <th class="editCell"></th>
        </tr>
        <tr v-for="user in users" class="dataRow">
            <td>{{ user.name ? user.name : "N/A" }}</td>
            <td>{{ user.email ? user.email : "N/A" }}</td>
            <td>
                <strong>{{ user.auth ? user.auth : "N/A" }}</strong>
            </td>
            <td class="editCell">
                <button @click="$emit('editUser', user.id)" class="editCellBtn">
                    Edit
                </button>
            </td>
        </tr>
    </table>
</template>

<script setup>
import { ref, computed } from "vue";
import { Users } from "../../firebase.js";

const emits = defineEmits(["editUser"]);

let users = ref(null);

const update = () => {
    Users.getAllUsers().then((data) => {
        users.value = data;
    });
};

const userData = Users.getAllUsers();
userData.then((data) => {
    users.value = data;
});

defineExpose({ update });
</script>

<style scoped>
table {
    border-spacing: none;
    border-collapse: collapse;
}

td,
th {
    height: 40px;
    padding: 10px;
    border-bottom: 2px solid var(--accent-color-main);
    border-top: 2px solid var(--accent-color-main);
}

th {
    border: none;
    text-align: start;
    font-size: 24px;
}
.editCell {
    width: 50px;
}

.editCellBtn {
    box-sizing: border-box;
    max-width: 100%;
}
.dataRow {
    background-color: var(--background-color-alternate);
}
</style>
