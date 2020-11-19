<template>
  <div class="flex flex-col justify-center items-center">
    <h1 class="font-bold text-6xl mt-16">
      Join
    </h1>

    <div class="mt-24 w-full flex justify-center">
      <table class="table-auto bg-gray-300 w-2/3">
        <thead>
          <tr>
            <th class="px-4 py-2">
              Room
            </th>
            <th class="px-4 py-2">
              Creator
            </th>
            <th class="px-4 py-2">
              Members
            </th>
            <th class="px-4 py-2">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(room, index) of rooms"
            :key="room.id"
            :class="{ 'bg-gray-100': index % 2 === 0 }"
            class="text-center"
          >
            <td class="border px-4 py-2">
              {{ room.name }}
            </td>
            <td class="border px-4 py-2">
              {{ room.members.length && room.members[0] && room.members[0].nickname }}
            </td>
            <td class="border px-4 py-2">
              {{ room.members.length }}
            </td>
            <td class="border px-4 py-2">
              <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                @click="joinTheChannel(room.name)"
              >
                Join
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import socket from '~/plugins/socket.io.js';

export default {
  data () {
    return {
      rooms: [],
    };
  },
  mounted () {
    socket.emit('get-all-rooms', undefined, (rooms) => {
      this.rooms = rooms;
    });

    socket.on('get-all-rooms', (rooms) => {
      this.rooms = rooms;
    });
  },
  methods: {
    joinTheChannel (name) {
      const data = {
        name,
        userId: this.$store.state.user.id,
      };

      socket.emit('join-room', data,
        (response) => {
          this.$store.commit('user/setAdmin', false);
          this.$store.commit('room/join', response);
          this.$router.push(`/room/${name}`);
        });
    },
  },
};
</script>
