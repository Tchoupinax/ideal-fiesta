<template>
  <div class="flex flex-col items-center justify-center">
    <!--
    <h1 class="mt-16 text-4xl font-bold">
      {{ roomName }}
    </h1>
    -->

    <div class="w-full">
      <vue-tabs-chrome
        v-model="tab"
        :tabs="tabs"
        @contextmenu="handleClick"
      />
    </div>

    <!-- Members -->
    <template v-if="tab === 'members'">
      <table class="w-2/3 mt-24 bg-gray-300 table-auto">
        <thead>
          <tr>
            <th class="px-4 py-2">
              Name
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(participant, index) of participants"
            :key="participant.id"
            :class="{ 'bg-gray-100': index % 2 === 0 }"
            class="text-center"
          >
            <td class="flex items-center justify-between px-4 py-2 border">
              <div class="flex items-center">
                <div class="w-8 h-8 overflow-hidden bg-red-300 rounded-full">
                  <img :src="participant.imageUrl">
                </div>

                <p class="ml-4">
                  {{ participant.name }}
                </p>
              </div>

              <div v-if="index === 0">
                <p class="font-bold text-red-600">
                  administrator
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <button
        v-if="isAdmin"
        class="absolute bottom-0 left-0 flex items-center justify-center px-3 py-2 mb-4 ml-48 text-sm font-bold text-white bg-red-500 border border-red-700 rounded hover:bg-red-700"
        @click="deleteRoom"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
        <span class="ml-2">
          Delete the room
        </span>
      </button>
    </template>
    <!-- END # Members -->

    <!-- Fibonnacci Estimation -->
    <template v-if="tab === 'fibonnacci-estimation'">
      <FibonnacciEstimation
        class="mt-16"
        :participants.sync="participants"
      />
    </template>
    <!-- END # Fibonnacci Estimation -->

    <button
      class="absolute bottom-0 left-0 flex items-center justify-center px-3 py-2 mb-4 ml-4 text-sm font-bold text-white bg-orange-500 border border-orange-700 rounded hover:bg-orange-700"
      @click="leaveRoom"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
      <span class="ml-2">
        Leave the room
      </span>
    </button>

    <div>
      <beautiful-chat
        :participants="participants.filter(p => p.id !== userId)"
        :title-image-url="titleImageUrl"
        :on-message-was-sent="onMessageWasSent"
        :message-list="messageList"
        :new-messages-count="newMessagesCount"
        :is-open="isChatOpen"
        :close="closeChat"
        :open="openChat"
        :show-emoji="true"
        :show-file="true"
        :show-edition="true"
        :show-deletion="true"
        :deletion-confirmation="true"
        :show-typing-indicator="showTypingIndicator"
        :show-launcher="true"
        :show-close-button="true"
        :colors="colors"
        :always-scroll-to-bottom="alwaysScrollToBottom"
        :disable-user-list-toggle="false"
        :message-styling="messageStyling"
        @onType="handleOnType"
        @edit="editMessage"
      />
    </div>
  </div>
</template>

<script>
import Chat from 'vue-beautiful-chat';
import Vue from 'vue';
import vueTabsChrome from 'vue-tabs-chrome';
import FibonnacciEstimation from '@/components/FibonacciEstimation';

import socket from '~/plugins/socket.io.js';

Vue.use(Chat);
Vue.use(vueTabsChrome);

export default {
  components: {
    FibonnacciEstimation,
  },
  data () {
    return {
      isChatOpen: false,
      participants: [],
      messageList: [],
      titleImageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png',
      newMessagesCount: 0,
      showTypingIndicator: '', // when set to a value matching the participant.id it shows the typing indicator for the specific user
      colors: {
        header: {
          bg: '#4e8cff',
          text: '#ffffff',
        },
        launcher: {
          bg: '#4e8cff',
        },
        messageList: {
          bg: '#ffffff',
        },
        sentMessage: {
          bg: '#4e8cff',
          text: '#ffffff',
        },
        receivedMessage: {
          bg: '#eaeaea',
          text: '#222222',
        },
        userInput: {
          bg: '#f4f7f9',
          text: '#565867',
        },
      },
      alwaysScrollToBottom: false, // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
      messageStyling: true, // enables *bold* /emph/ _underline_ and such (more info at github.com/mattezza/msgdown)
      tab: 'members',
      tabs: [
        {
          label: 'Members',
          key: 'members',
          closable: false,
          favico: require('~/assets/icons/members.svg'),
        },
        {
          label: 'Estimation',
          key: 'fibonnacci-estimation',
          closable: false,
          favico: require('~/assets/icons/vote.svg'),
        },
      ],
    };
  },
  head () {
    let name = this.roomName;

    if (this.newMessagesCount > 0) {
      name = `${name} (${this.newMessagesCount} New messsage ! )`;
    }

    return {
      title: name,
    };
  },
  computed: {
    roomName () { return this.$route.params.name; },
    isAdmin () { return this.$store.state.user.isAdmin; },
    userId () { return this.$store.state.user.id; },
    roomId () { return this.$store.state.room.id; },
  },
  mounted () {
    socket.emit('get-room', this.$store.state.room.id, (response) => {
      this.syncParticipants(response.members);
    });

    socket.on('people-joined', (data) => {
      if (data.roomId === this.roomId) {
        this.syncParticipants(data);
      }
    });

    socket.on('people-left', (data) => {
      if (data.roomId === this.roomId) {
        this.removeParticipants(data.userId);
      }
    });

    socket.on('broadcast-message', (message) => {
      // If the author is me, i do not take care about the new message
      if (message.authorId === this.userId) { return; }

      this.messageList = [
        ...this.messageList,
        { type: 'text', author: message.authorId, data: { text: message.content } },
      ];
      this.newMessagesCount++;
    });
  },
  methods: {
    addTab () {
      const item = `tab${Date.now()}`;
      const newTabs = [
        {
          label: 'New Tab',
          key: item,
        },
      ];
      this.$refs.tab.addTab(...newTabs);
      this.tab = item;
    },
    removeTab () {
      this.$refs.tab.removeTab(this.tab);
    },
    handleClick (e, tab, i) {
      // console.log(e, tab, i);
    },

    deleteRoom () {
      socket.emit('delete-room', this.roomName, (response) => {
        this.$router.push('/');
      });
    },

    leaveRoom () {
      const data = {
        userId: this.userId,
        roomId: this.roomId,
      };

      socket.emit('leave-room', data, (response) => {
        this.$store.commit('user/setAdmin', false);
        this.$store.commit('room/leave');
        this.$router.push('/');
      });
    },

    syncParticipants (data) {
      if (Array.isArray(data)) {
        this.participants = data.map(p => ({
          id: p.id,
          name: p.nickname,
          imageUrl: p.imageUrl,
        }));
      } else {
        this.participants.push({
          id: data.user.id,
          name: data.user.nickname,
          imageUrl: data.user.imageUrl,
        });
      }
    },

    onMessageWasSent (message) {
      this.messageList = [...this.messageList, message];

      const data = {
        userId: this.userId,
        roomId: this.roomId,
        message: {
          type: message.type,
          data: message.data,
        },
      };

      // TODO: handle network issues
      socket.emit('send-message', data);
    },
    openChat () {
      this.isChatOpen = true;
      this.newMessagesCount = 0;
    },
    closeChat () {
      this.isChatOpen = false;
    },
    handleScrollToTop () {
      // called when the user scrolls message list to top
      // leverage pagination for loading another page of messages
    },
    handleOnType () {
      // console.log('Emit typing event');
    },
    editMessage (message) {
      const m = this.messageList.find(m => m.id === message.id);
      m.isEdited = true;
      m.data.text = message.data.text;
    },

    removeParticipants (userId) {
      const index = this.participants.findIndex(p => p.id === userId);
      this.participants.splice(index, 1);
    },
  },
};
</script>
