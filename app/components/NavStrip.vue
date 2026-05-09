<template>
  <nav class="sticky top-6 h-[calc(100vh-3rem)] w-56 rounded-2xl bg-slate-900/70 border border-white/6 p-4 flex flex-col gap-3">
    <div class="pb-3 border-b border-white/6">
      <h3 class="text-sm font-semibold text-slate-200">Workspace</h3>
      <p class="text-xs text-slate-400">Quick navigation</p>
    </div>

    <a href="#create" class="nav-item" @click.prevent="scrollTo('create')">
      <span class="block text-sm font-medium">Create countdown</span>
      <span class="text-xs text-slate-400">Add single timers</span>
    </a>

    <a href="#sequence" class="nav-item" @click.prevent="scrollTo('sequence')">
      <span class="block text-sm font-medium">Create sequence</span>
      <span class="text-xs text-slate-400">Assemble loops</span>
    </a>

    <a href="#existing" class="nav-item mt-auto" @click.prevent="scrollTo('existing')">
      <span class="block text-sm font-medium">Existing countdowns</span>
      <span class="text-xs text-slate-400">Manage & refresh</span>
    </a>
  </nav>
</template>

<script setup lang="ts">
import { nextTick } from 'vue'

function scrollTo(id: string) {
  nextTick(() => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}
</script>

<style scoped>
.nav-item {
  display: block;
  padding: 0.6rem;
  border-radius: 0.6rem;
  color: #e6edf3;
}
.nav-item:hover { background: rgba(255,255,255,0.02); }
</style>
