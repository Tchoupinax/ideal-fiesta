<template>
  <div class="flex w-full">
    <MembersVoteCount
      :participants="participants"
      @show-results="showResults"
      @reset="reset"
    />

    <!-- User choice interface -->
    <div
      v-if="!showResultsState"
      class="flex flex-col justify-center items-center w-full"
    >
      <div
        class="flex justify-center"
      >
        <img
          v-for="number of numbers"
          :key="number"
          class="w-24 h-24 p-3 m-4 rounded-lg border-4 border-black cursor-pointer"
          :class="{
            'bg-blue-400' : selectedNumber === number,
            'opacity-25': locked && selectedNumber !== number,
            'hover:bg-blue-400': !locked
          }"
          :src="require(`@/assets/fibonacci-estimation/${number}.svg`)"
          @click="selectChoice(number)"
        >
      </div>

      <div class="my-16">
        <button
          :disabled="selectedNumber === undefined"
          class="bg-green-500 text-white font-bold py-2 px-4 border-b-4 border-green-700 rounded"
          :class="{
            'opacity-50': selectedNumber === undefined,
            'hover:border-green-500 hover:bg-green-400': selectedNumber !== undefined,
          }"
          @click="toggleLock()"
        >
          {{ locked ? 'Unlock' : 'Lock my vote' }}
        </button>
      </div>
    </div>
    <!-- END # User choice interface -->

    <!-- Result -->
    <div v-else class="flex flex-col items-center w-full">
      <h2 class="text-5xl font-bold mb-24">
        Results
      </h2>

      <div
        v-for="(p, index) of participants"
        :key="p.id"
        class="flex justify-between items-center w-1/3 p-2 rounded-lg px-8 m-2"
        :class="{
          'bg-blue-100': index % 2 === 0,
          'bg-green-100': index % 2 === 1,
        }"
      >
        <p class="text-2xl">
          {{ p.name }}
        </p>

        <div class="p-2 w-12 h-12 flex justify-center items-center mr-2 text-2xl font-bold">
          <p>
            {{ p.score }}
          </p>
        </div>
      </div>

      <div class="flex justify-between items-center w-1/3 p-4 rounded-lg px-8 m-2 bg-red-100 mt-16">
        <p class="text-2xl">
          Average
        </p>

        <div class="p-2 w-12 h-12 flex justify-center items-center mr-2 text-2xl font-bold">
          <p>
            {{ participants.reduce((acc, cur) => acc + cur.score, 0) / participants.length }}
          </p>
        </div>
      </div>
    </div>
    <!-- END # Result -->
  </div>
</template>

<script>
import socket from '~/plugins/socket.io.js';

export default {
  props: {
    participants: {
      type: Array,
      required: true,
    },
  },
  data () {
    return {
      locked: false,
      numbers: [1, 2, 3, 5, 8, 13],
      selectedNumber: undefined,
      showResultsState: false,
    };
  },
  computed: {
    roomName () { return this.$route.params.name; },
    isAdmin () { return this.$store.state.user.isAdmin; },
    userId () { return this.$store.state.user.id; },
    roomId () { return this.$store.state.room.id; },
  },
  mounted () {
    socket.on('fibonacci-estimation-lock-choice', ({ userId, score }) => {
      const index = this.$props.participants.findIndex(p => p.id === userId);
      if (index === -1) {
        return;
      }

      const participants = [...this.$props.participants];
      participants[index].choiceLocked = true;
      participants[index].score = score;

      this.$emit('update:participants', [...participants]);
    });

    socket.on('fibonacci-estimation-unlock-choice', ({ userId }) => {
      const index = this.$props.participants.findIndex(p => p.id === userId);
      if (index === -1) {
        return;
      }

      const participants = [...this.$props.participants];
      participants[index].choiceLocked = false;
      delete participants[index].score;

      this.$emit('update:participants', [...participants]);
    });

    socket.on('fibonacci-estimation-show-results', () => {
      this.showResultsState = true;
    });

    socket.on('fibonacci-estimation-reset', () => {
      const participants = [...this.$props.participants];
      participants.map((p) => {
        delete p.choiceLocked;
        delete p.score;
        return p;
      });

      this.selectedNumber = undefined;
      this.locked = false;
      this.showResultsState = false;

      this.$emit('update:participants', [...participants]);
    });

    setTimeout(() => {
      socket.emit('fibonacci-estimation-list-choices', undefined, (data) => {
        const participants = [...this.$props.participants];
        data.forEach(({ userId, score }) => {
          const participantIndex = participants.findIndex(p => p.id === userId);

          if (participantIndex !== -1) {
            participants[participantIndex].score = score;
            participants[participantIndex].choiceLocked = true;
          }

          if (userId === this.userId) {
            this.selectChoice(score);
            this.locked = true;
          }
        });

        this.$emit('update:participants', [...participants]);
      });
    }, 1);
  },
  methods: {
    selectChoice (number) {
      if (this.locked) { return; }

      this.selectedNumber = number;
    },

    toggleLock () {
      this.locked = !this.locked;

      if (this.locked) {
        socket.emit('fibonacci-estimation-lock-choice', { userId: this.userId, score: this.selectedNumber });
      } else {
        socket.emit('fibonacci-estimation-unlock-choice', { userId: this.userId });
      }
    },

    showResults () {
      if (!this.participants.every(p => p.choiceLocked)) {
        return alert('Some people has not locked its vote yet');
      }

      socket.emit('fibonacci-estimation-show-results');
    },

    reset () {
      socket.emit('fibonacci-estimation-reset');
    },
  },
};
</script>
