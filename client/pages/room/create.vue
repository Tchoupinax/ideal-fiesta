<template>
  <div class="flex flex-col justify-center items-center">
    <h1 class="font-bold text-6xl mt-16">
      Create
    </h1>

    <div class="mt-24 w-full max-w-xs">
      <form
        class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        @submit="createRoom"
      >
        <div class="mb-4">
          <input
            id="roomName"
            v-model="roomName"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Room name"
            autocomplete="off"
          >
        </div>

        <div class="flex items-center justify-between">
          <button
            class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Create the room
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import socket from '~/plugins/socket.io.js';

export default {
  data () {
    return {
      roomName: '',
    };
  },
  methods: {
    createRoom (e) {
      e.preventDefault();
      if (this.roomName.length === 0) { return; }

      const data = {
        name: this.roomName,
        userId: this.$store.state.user.id,
      };

      socket.emit('create-room', data,
        (response) => {
          this.$store.commit('user/setAdmin', true);
          this.$store.commit('room/join', response);
          this.$router.push(`/room/${this.roomName}`);
        });
    },
  },
};
</script>
