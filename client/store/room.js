export const state = () => ({
  id: localStorage.getItem('ideal-fiesta.room.id') || undefined,
});

export const mutations = {
  join (state, { id }) {
    state.id = id;
    localStorage.setItem('ideal-fiesta.room.id', id);
  },

  leave (state) {
    state.id = undefined;
    localStorage.removeItem('ideal-fiesta.room.id');
  },
};
