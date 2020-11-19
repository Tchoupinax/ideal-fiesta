<template>
  <div class="flex flex-col justify-center items-center">
    <h1 class="font-bold text-5xl mt-24">
      ideal-fiesta
    </h1>

    <h2 class="mt-20 text-3xl">
      Set of useful tools for your meetings 🚀
    </h2>

    <form
      v-if="!isConnected"
      class="w-full max-w-sm mt-24"
      @submit="register"
    >
      <div class="flex items-center border-b border-teal-500 py-2">
        <input
          v-model="nickname"
          class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          placeholder="Nickname"
        >
        <button
          class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
          type="submit"
        >
          Register
        </button>
      </div>
    </form>

    <div
      v-if="isConnected"
      class="flex flex-col mt-24 justify-center items-center"
    >
      <p class="text-xl">
        registered as {{ $store.state.user.nickname }}!
      </p>
      <div class="italic flex mb-16 text-sm">
        <p>disconnect</p>
        <button
          class="ml-1 underline"
          @click="disconnect"
        >
          here
        </button>
      </div>

      <nuxt-link
        class="border border-blue-400 w-1/2 p-2 text-center rounded-lg"
        to="/room/create"
      >
        Create
      </nuxt-link>
      <nuxt-link
        class="mt-4 border border-blue-400 w-1/2 p-2 text-center rounded-lg"
        to="/room/join"
      >
        Join
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import socket from '~/plugins/socket.io.js';

export default {
  data () {
    return {
      nickname: '',
    };
  },
  computed: {
    isConnected () { return this.$store.state.user.isConnected; },
  },
  methods: {
    register (e) {
      e.preventDefault();

      if (this.nickname.length === 0) { return; }

      socket.emit('register', this.nickname, (user) => {
        this.$store.commit('user/register', user);
      });
    },

    disconnect () {
      this.$store.commit('user/disconnect');
    },
  },
};
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
