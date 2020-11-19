export const state = () => ({
  id: localStorage.getItem('ideal-fiesta.user.id') || undefined,
  nickname: localStorage.getItem('ideal-fiesta.user.nickname') || undefined,
  isConnected: localStorage.getItem('ideal-fiesta.user.isConnected') || false,
  isAdmin: localStorage.getItem('ideal-fiesta.user.isAdmin') || false,
});

export const mutations = {
  register (state, { id, nickname }) {
    state.id = id;
    state.nickname = nickname;
    state.isConnected = true;

    localStorage.setItem('ideal-fiesta.user.id', id);
    localStorage.setItem('ideal-fiesta.user.nickname', nickname);
    localStorage.setItem('ideal-fiesta.user.isConnected', true);
  },

  setAdmin (state, bool) {
    state.isAdmin = bool || false;
    localStorage.setItem('ideal-fiesta.user.isAdmin', state.isAdmin);
  },

  disconnect (state) {
    state.id = undefined;
    state.nickname = undefined;
    state.isConnected = false;

    localStorage.removeItem('ideal-fiesta.user.id');
    localStorage.removeItem('ideal-fiesta.user.nickname');
    localStorage.removeItem('ideal-fiesta.user.isConnected');
  },
};
