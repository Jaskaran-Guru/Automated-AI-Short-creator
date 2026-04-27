import { create } from 'zustand'

interface Caption {
  id: string
  text: string
  start: number
  end: number
}

interface EditorState {
  currentTime: number
  isPlaying: boolean
  captions: Caption[]
  setCurrentTime: (time: number) => void
  setIsPlaying: (isPlaying: boolean) => void
  updateCaption: (id: string, text: string) => void
}

export const useEditorStore = create<EditorState>((set) => ({
  currentTime: 0,
  isPlaying: false,
  captions: [
    { id: '1', text: 'The secret to high growth', start: 0, end: 2.5 },
    { id: '2', text: 'is really just finding', start: 2.5, end: 4.0 },
    { id: '3', text: 'the one channel that works', start: 4.0, end: 6.5 },
    { id: '4', text: 'and scaling it to the moon.', start: 6.5, end: 9.0 },
  ],
  setCurrentTime: (time) => set({ currentTime: time }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  updateCaption: (id, text) => set((state) => ({
    captions: state.captions.map(c => c.id === id ? { ...c, text } : c)
  })),
}))
