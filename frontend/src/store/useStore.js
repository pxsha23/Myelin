import { create } from 'zustand'

const useStore = create((set, get) => ({
  user: null,
  token: null,
  nodes: [],
  mood: { id: 'focused', hex: '#00c8ff', r: 0, g: 200, b: 255, label: 'focused' },

  setUser: (user, token) => {
    localStorage.setItem('myelin_token', token)
    localStorage.setItem('myelin_user', JSON.stringify(user))
    set({ user, token })
  },

  logout: () => {
    localStorage.removeItem('myelin_token')
    localStorage.removeItem('myelin_user')
    set({ user: null, token: null, nodes: [] })
  },

  setNodes: (nodes) => set({ nodes }),

  addNode: (node) => set(s => ({ nodes: [...s.nodes, node] })),

  setMood: (mood) => set({ mood }),

  loadFromStorage: () => {
    const token = localStorage.getItem('myelin_token')
    const user = localStorage.getItem('myelin_user')
    if (token && user) {
      set({ token, user: JSON.parse(user) })
    }
  }
}))

export default useStore