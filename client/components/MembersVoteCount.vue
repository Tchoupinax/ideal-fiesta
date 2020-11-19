<template>
  <div class="ml-24">
    <div class="bg-gray-200 p-8 rounded-lg">
      <div
        v-for="participant of participants"
        :key="participant.id"
        class="mb-4"
      >
        <div class="flex justify-between">
          <div class="flex">
            <div class="w-8 h-8 overflow-hidden bg-red-300 rounded-full">
              <img :src="participant.imageUrl">
            </div>

            <p class="mx-4 mr-16 text-xl font-bold">
              {{ participant.name }}
            </p>
          </div>

          <div
            class="w-8 h-8"
            :class="{ 'text-green-500': participant.choiceLocked }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div
        v-if="isAdmin"
        class="flex flex-col justify-center mt-24"
      >
        <button
          class="px-4 py-2 font-semibold text-blue-700 bg-transparent border border-blue-500 rounded hover:bg-blue-500 hover:text-white hover:border-transparent"
          @click="$emit('show-results')"
        >
          Show results
        </button>

        <button
          class="mt-2 px-4 py-2 font-semibold text-blue-700 bg-transparent border border-blue-500 rounded hover:bg-blue-500 hover:text-white hover:border-transparent"
          @click="$emit('reset')"
        >
          Reset
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    participants: {
      type: Array,
      required: true,
    },
  },
  computed: {
    roomName () { return this.$route.params.name; },
    isAdmin () { return this.$store.state.user.isAdmin; },
    userId () { return this.$store.state.user.id; },
    roomId () { return this.$store.state.room.id; },
  },
};
</script>
