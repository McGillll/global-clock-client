<template>
  <div class="w-full bg-slate-900/60 border-b border-white/6">
    <nav class="mx-auto max-w-7xl px-4 py-2 flex items-center sm:px-6 sm:py-3 sm:gap-4">
      <button
        v-for="item in items"
        :key="item.key"
        @click="select(item.key)"
        :class="['flex-1 sm:flex-none px-3 py-2 rounded-lg font-medium text-sm text-center transition', active === item.key ? 'bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-900' : 'text-slate-300 hover:bg-white/5']"
      >
        {{ item.label }}
      </button>
    </nav>
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
/* small adjustments for horizontal strip */
nav::-webkit-scrollbar { height: 8px }
nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 8px }
</style>
