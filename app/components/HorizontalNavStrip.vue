<template>
  <div>
    <div class="hidden w-full bg-slate-900/60 border-b border-white/6 md:block">
      <nav class="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-3 py-2 sm:gap-4 sm:px-6 sm:py-3">
        <button
          v-for="item in items"
          :key="item.key"
          @click="select(item.key)"
          :class="['flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-center text-xs font-medium transition sm:flex-none sm:text-sm', active === item.key ? 'bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-900' : 'text-slate-300 hover:bg-white/5']"
        >
          {{ item.label }}
        </button>
      </nav>
    </div>

    <div class="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-slate-950/95 backdrop-blur md:hidden" style="padding-bottom: env(safe-area-inset-bottom);">
      <nav class="mx-auto grid max-w-7xl grid-cols-3 gap-2 px-3 py-3">
        <button
          v-for="item in items"
          :key="item.key"
          @click="select(item.key)"
          :class="['rounded-xl px-2 py-3 text-center text-xs font-medium transition', active === item.key ? 'bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-900 shadow-lg shadow-cyan-950/30' : 'text-slate-300 active:bg-white/5']"
        >
          {{ item.label }}
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ modelValue?: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const items = [
  { key: 'create', label: 'Countdown' },
  { key: 'sequence', label: 'Sequence' },
  { key: 'control', label: 'Control' },
]

const active = ref(props.modelValue ?? 'create')

function select(key: string) {
  active.value = key
  emit('update:modelValue', key)
}

watch(() => props.modelValue, (v) => { if (v) active.value = v })
</script>

<style scoped>
nav::-webkit-scrollbar { height: 8px }
nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 8px }
</style>
