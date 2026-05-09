<template>
    <main class="min-h-screen bg-slate-950 text-slate-100">
        <section class="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:px-10">
            <HorizontalNavStrip v-model="activeTab" />
            <header class="space-y-2">
                <p class="text-xs uppercase tracking-[0.35em] text-cyan-300/80">Global Clock</p>
                <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">Countdown admin workspace</h1>
            </header>

            <!-- ── Countdown tab ───────────────────────────────────────── -->
            <section v-show="activeTab === 'create'" id="create">

                <!-- Header row -->
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <h2 class="text-xl font-medium">Countdowns</h2>
                        <p class="mt-0.5 text-sm text-slate-400">{{ countdowns.length }} saved</p>
                    </div>
                    <button
                        v-if="!showCreateForm"
                        @click="showCreateForm = true"
                        class="flex items-center gap-2 rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                        </svg>
                        New countdown
                    </button>
                </div>

                <!-- Inline creation form -->
                <Transition
                    enter-active-class="transition duration-200 ease-out"
                    enter-from-class="opacity-0 -translate-y-2"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition duration-150 ease-in"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 -translate-y-2"
                >
                    <div v-if="showCreateForm" class="mt-4 rounded-3xl border border-cyan-300/20 bg-cyan-300/5 p-6 shadow-xl shadow-cyan-950/20 backdrop-blur">
                        <div class="flex items-center justify-between mb-5">
                            <h3 class="text-base font-semibold text-cyan-100">New countdown</h3>
                            <button type="button" @click="cancelCreate" class="rounded-full p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        <form class="grid gap-5" @submit.prevent="createCountdown">
                            <!-- Name -->
                            <label class="grid gap-1.5">
                                <span class="text-sm font-medium text-slate-300">Name</span>
                                <input
                                    v-model="countdownForm.name"
                                    type="text"
                                    autofocus
                                    class="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-300/50 transition"
                                    placeholder="e.g. Travel"
                                />
                            </label>

                            <!-- Duration -->
                            <div class="grid gap-1.5">
                                <span class="text-sm font-medium text-slate-300">Duration</span>
                                <div class="flex flex-wrap gap-2">
                                    <button
                                        v-for="p in durationPresets"
                                        :key="p.value"
                                        type="button"
                                        @click="countdownForm.duration_seconds = p.value"
                                        :class="[
                                            'rounded-xl px-3 py-1.5 text-sm font-medium transition',
                                            countdownForm.duration_seconds === p.value
                                                ? 'bg-cyan-400 text-slate-900'
                                                : 'border border-white/10 bg-slate-800/80 text-slate-300 hover:border-cyan-300/30 hover:text-white'
                                        ]"
                                    >
                                        {{ p.label }}
                                    </button>
                                </div>
                                <div class="flex items-center gap-3 mt-1">
                                    <input
                                        v-model.number="countdownForm.duration_seconds"
                                        type="number"
                                        min="1"
                                        class="w-32 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-2.5 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-300/50 transition tabular-nums"
                                    />
                                    <span class="text-sm text-slate-400">seconds &nbsp;·&nbsp; {{ formatDuration(countdownForm.duration_seconds) }}</span>
                                </div>
                            </div>

                            <!-- Notes (optional) -->
                            <label class="grid gap-1.5">
                                <span class="text-sm font-medium text-slate-300">Notes <span class="text-slate-500 font-normal">(optional)</span></span>
                                <textarea
                                    v-model="countdownForm.notes"
                                    rows="2"
                                    class="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-300/50 transition resize-none"
                                    placeholder="Context or instructions…"
                                />
                            </label>

                            <!-- Colors -->
                            <div class="grid gap-3 pt-2 border-t border-white/10">
                                <label class="grid gap-1.5">
                                    <span class="text-sm font-medium text-slate-300">Background Color</span>
                                    <div class="flex items-center gap-3">
                                        <input
                                            v-model="countdownForm.background_color"
                                            type="color"
                                            class="h-10 w-14 rounded-lg border border-white/10 cursor-pointer"
                                        />
                                        <input
                                            v-model="countdownForm.background_color"
                                            type="text"
                                            class="flex-1 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-2.5 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-300/50 transition font-mono"
                                            placeholder="#0f172a"
                                        />
                                    </div>
                                </label>

                                <label class="grid gap-1.5">
                                    <span class="text-sm font-medium text-slate-300">Font Color</span>
                                    <div class="flex items-center gap-3">
                                        <input
                                            v-model="countdownForm.font_color"
                                            type="color"
                                            class="h-10 w-14 rounded-lg border border-white/10 cursor-pointer"
                                        />
                                        <input
                                            v-model="countdownForm.font_color"
                                            type="text"
                                            class="flex-1 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-2.5 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-300/50 transition font-mono"
                                            placeholder="#f1f5f9"
                                        />
                                    </div>
                                </label>

                                <!-- Contrast status -->
                                <div 
                                    class="rounded-lg px-3 py-2 text-xs font-medium transition"
                                    :class="{
                                        'bg-green-400/20 text-green-300 border border-green-400/40': createFormContrast.status === 'good',
                                        'bg-yellow-400/20 text-yellow-300 border border-yellow-400/40': createFormContrast.status === 'warning',
                                        'bg-red-400/20 text-red-300 border border-red-400/40': createFormContrast.status === 'fail',
                                    }"
                                >
                                    {{ createFormContrast.text }}
                                </div>
                            </div>

                            <div class="flex items-center gap-3">
                                <button
                                    type="submit"
                                    :disabled="!countdownForm.name.trim()"
                                    class="rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Save countdown
                                </button>
                                <button type="button" @click="cancelCreate" class="rounded-full border border-white/10 px-4 py-2.5 text-sm text-slate-400 transition hover:bg-white/5">
                                    Cancel
                                </button>
                                <p v-if="feedback" class="ml-auto text-sm text-cyan-300">{{ feedback }}</p>
                            </div>
                        </form>
                    </div>
                </Transition>

                <!-- Countdown list -->
                <div class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <article
                        v-for="item in countdowns"
                        :key="item.id"
                        class="rounded-2xl border bg-slate-900/70 transition"
                        :class="editingId === item.id ? 'border-cyan-300/30 bg-cyan-300/5 p-5' : 'border-white/10 p-4 hover:border-white/20'"
                    >
                        <!-- Edit mode -->
                        <form v-if="editingId === item.id" class="grid gap-4" @submit.prevent="saveEdit">
                            <label class="grid gap-1.5">
                                <span class="text-xs font-medium text-slate-400">Name</span>
                                <input
                                    v-model="editForm.name"
                                    type="text"
                                    class="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-300/50 transition"
                                />
                            </label>

                            <div class="grid gap-1.5">
                                <span class="text-xs font-medium text-slate-400">Duration</span>
                                <div class="flex flex-wrap gap-1.5">
                                    <button
                                        v-for="p in durationPresets"
                                        :key="p.value"
                                        type="button"
                                        @click="editForm.duration_seconds = p.value"
                                        :class="[
                                            'rounded-lg px-2.5 py-1 text-xs font-medium transition',
                                            editForm.duration_seconds === p.value
                                                ? 'bg-cyan-400 text-slate-900'
                                                : 'border border-white/10 bg-slate-800/80 text-slate-300 hover:border-cyan-300/30'
                                        ]"
                                    >
                                        {{ p.label }}
                                    </button>
                                </div>
                                <div class="flex items-center gap-2 mt-0.5">
                                    <input
                                        v-model.number="editForm.duration_seconds"
                                        type="number"
                                        min="1"
                                        class="w-24 rounded-xl border border-white/10 bg-slate-900/80 px-3 py-1.5 text-sm outline-none focus:border-cyan-300/50 transition tabular-nums"
                                    />
                                    <span class="text-xs text-slate-400">{{ formatDuration(editForm.duration_seconds) }}</span>
                                </div>
                            </div>

                            <label class="grid gap-1.5">
                                <span class="text-xs font-medium text-slate-400">Notes <span class="text-slate-600">(optional)</span></span>
                                <textarea
                                    v-model="editForm.notes"
                                    rows="2"
                                    class="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-300/50 transition resize-none"
                                />
                            </label>

                            <!-- Colors -->
                            <div class="grid gap-2 pt-2 border-t border-white/10">
                                <label class="grid gap-1.5">
                                    <span class="text-xs font-medium text-slate-400">Background</span>
                                    <div class="flex items-center gap-2">
                                        <input
                                            v-model="editForm.background_color"
                                            type="color"
                                            class="h-8 w-12 rounded-lg border border-white/10 cursor-pointer"
                                        />
                                        <input
                                            v-model="editForm.background_color"
                                            type="text"
                                            class="flex-1 rounded-lg border border-white/10 bg-slate-900/80 px-2.5 py-1.5 text-xs outline-none placeholder:text-slate-500 focus:border-cyan-300/50 transition font-mono"
                                            placeholder="#0f172a"
                                        />
                                    </div>
                                </label>

                                <label class="grid gap-1.5">
                                    <span class="text-xs font-medium text-slate-400">Font</span>
                                    <div class="flex items-center gap-2">
                                        <input
                                            v-model="editForm.font_color"
                                            type="color"
                                            class="h-8 w-12 rounded-lg border border-white/10 cursor-pointer"
                                        />
                                        <input
                                            v-model="editForm.font_color"
                                            type="text"
                                            class="flex-1 rounded-lg border border-white/10 bg-slate-900/80 px-2.5 py-1.5 text-xs outline-none placeholder:text-slate-500 focus:border-cyan-300/50 transition font-mono"
                                            placeholder="#f1f5f9"
                                        />
                                    </div>
                                </label>

                                <!-- Contrast status -->
                                <div 
                                    class="rounded-lg px-2.5 py-1.5 text-xs font-medium transition"
                                    :class="{
                                        'bg-green-400/20 text-green-300 border border-green-400/40': editFormContrast.status === 'good',
                                        'bg-yellow-400/20 text-yellow-300 border border-yellow-400/40': editFormContrast.status === 'warning',
                                        'bg-red-400/20 text-red-300 border border-red-400/40': editFormContrast.status === 'fail',
                                    }"
                                >
                                    {{ editFormContrast.text }}
                                </div>
                            </div>

                            <div class="flex items-center gap-2">
                                <button
                                    type="submit"
                                    :disabled="!editForm.name.trim()"
                                    class="rounded-full bg-cyan-400 px-4 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-40"
                                >
                                    Save
                                </button>
                                <button type="button" @click="cancelEdit" class="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-400 transition hover:bg-white/5">
                                    Cancel
                                </button>
                            </div>
                        </form>

                        <!-- Display mode -->
                        <template v-else>
                            <p class="text-xs uppercase tracking-[0.25em] text-slate-500">{{ formatDuration(item.duration_seconds) }}</p>
                            <h3 class="mt-2 text-base font-semibold text-white">{{ item.name }}</h3>
                            <p v-if="item.notes" class="mt-1 text-xs text-slate-400 line-clamp-2">{{ item.notes }}</p>
                            
                            <!-- Color preview -->
                            <div v-if="item.background_color || item.font_color" class="mt-2 flex items-center gap-2">
                                <div class="flex items-center gap-1.5">
                                    <div 
                                        class="w-5 h-5 rounded-md border border-white/20" 
                                        :style="{ backgroundColor: item.background_color || '#0f172a' }"
                                        :title="`Background: ${item.background_color}`"
                                    />
                                    <div 
                                        class="w-5 h-5 rounded-md border border-white/20" 
                                        :style="{ backgroundColor: item.font_color || '#f1f5f9' }"
                                        :title="`Font: ${item.font_color}`"
                                    />
                                </div>
                            </div>

                            <div class="mt-3 flex items-center gap-2">
                                <button
                                    @click="openEdit(item)"
                                    class="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400 transition hover:border-cyan-300/30 hover:text-cyan-300"
                                >
                                    Edit
                                </button>
                                <button
                                    @click="deleteCountdown(item.id)"
                                    class="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400 transition hover:border-red-500/30 hover:text-red-400"
                                >
                                    Delete
                                </button>
                            </div>
                        </template>
                    </article>

                    <button
                        v-if="!showCreateForm"
                        @click="showCreateForm = true"
                        class="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-slate-500 transition hover:border-cyan-300/20 hover:text-slate-300 flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                        </svg>
                        Add countdown
                    </button>
                </div>
            </section>

            <!-- ── Sequence tab ────────────────────────────────────────── -->
            <section v-show="activeTab === 'sequence'" id="sequence" class="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl shadow-black/20 backdrop-blur">
                <h2 class="text-xl font-medium">Build sequence</h2>
                <p class="mt-1 text-sm text-slate-400">Tap a countdown to add it. Items run in order.</p>

                <form class="mt-6 grid gap-6" @submit.prevent="createSequence">
                    <div class="grid gap-4 sm:grid-cols-2">
                        <label class="grid gap-2">
                            <span class="text-sm font-medium text-slate-300">Sequence name</span>
                            <input
                                v-model="sequenceForm.name"
                                type="text"
                                class="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-300/40"
                                placeholder="e.g. Team rotation"
                            />
                        </label>

                        <label class="grid gap-2">
                            <span class="text-sm font-medium text-slate-300">Loop count <span class="text-slate-500 font-normal">(default 1)</span></span>
                            <div class="flex items-center gap-3">
                                <input
                                    v-model.number="sequenceForm.loop_count"
                                    type="number"
                                    min="1"
                                    placeholder="1"
                                    class="w-24 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-300/40 tabular-nums transition"
                                />
                                <span class="text-sm text-slate-400">
                                    {{ !sequenceForm.loop_count || sequenceForm.loop_count === 1 ? 'plays once' : `repeats ${sequenceForm.loop_count}×` }}
                                </span>
                            </div>
                        </label>
                    </div>

                    <div class="grid gap-3">
                        <span class="text-sm font-medium text-slate-300">Available countdowns</span>
                        <div v-if="countdowns.length" class="flex flex-wrap gap-2">
                            <button
                                v-for="cd in countdowns"
                                :key="cd.id"
                                type="button"
                                @click="addToSequence(cd)"
                                class="group flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-800/80 px-3 py-2 text-sm transition hover:border-cyan-300/40 hover:bg-cyan-300/10 active:scale-95"
                            >
                                <span class="font-medium text-slate-200">{{ cd.name }}</span>
                                <span class="text-xs text-slate-500">{{ formatDuration(cd.duration_seconds) }}</span>
                                <span class="text-base leading-none text-slate-500 group-hover:text-cyan-400 transition">+</span>
                            </button>
                        </div>
                        <p v-else class="text-sm text-slate-500 italic">No countdowns yet — create one in the Countdown tab first.</p>
                    </div>

                    <div class="grid gap-3">
                        <div class="flex items-center justify-between gap-4">
                            <span class="text-sm font-medium text-slate-300">Sequence order</span>
                            <span v-if="sequenceItems.length" class="text-xs text-slate-400">
                                {{ sequenceItems.length }} item{{ sequenceItems.length !== 1 ? 's' : '' }} &middot; {{ formatDuration(totalSequenceDuration) }} total
                            </span>
                        </div>

                        <ol v-if="sequenceItems.length" class="grid gap-2">
                            <li
                                v-for="(item, index) in sequenceItems"
                                :key="index"
                                class="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-800/60 px-4 py-3"
                            >
                                <span class="w-5 shrink-0 text-right text-xs tabular-nums text-slate-500">{{ index + 1 }}</span>
                                <span class="flex-1 text-sm text-slate-200">{{ item.name }}</span>
                                <span class="shrink-0 text-xs text-slate-400">{{ formatDuration(item.duration_seconds) }}</span>
                                <button
                                    type="button"
                                    @click="removeFromSequence(index)"
                                    class="shrink-0 rounded-full p-1 text-slate-500 transition hover:bg-red-500/20 hover:text-red-400"
                                    aria-label="Remove"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </li>
                        </ol>
                        <div v-else class="flex items-center justify-center rounded-2xl border border-dashed border-white/10 py-8 text-sm text-slate-500">
                            Add countdowns above to build your sequence
                        </div>
                    </div>

                    <div class="flex items-center gap-3">
                        <button
                            type="submit"
                            :disabled="!sequenceForm.name.trim() || sequenceItems.length === 0"
                            class="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Create sequence
                        </button>
                        <button
                            v-if="sequenceItems.length"
                            type="button"
                            @click="sequenceItems = []"
                            class="rounded-full border border-white/10 px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5"
                        >
                            Clear
                        </button>
                    </div>
                </form>

                <div v-if="shareUrl" class="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm text-cyan-100">
                    <p class="text-xs uppercase tracking-widest text-cyan-300/70 mb-2">Share link</p>
                    <a class="break-all underline decoration-cyan-200/60 underline-offset-4 hover:text-white transition" :href="shareUrl">{{ shareUrl }}</a>
                </div>
            </section>

            <!-- ── Control tab ─────────────────────────────────────────── -->
            <section v-show="activeTab === 'control'" id="control" class="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <div class="flex items-center justify-between gap-4">
                    <h2 class="text-xl font-medium">Control sequence</h2>
                    <button class="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/5" @click="loadSequences">Refresh</button>
                </div>

                <div class="mt-6 grid gap-4">
                    <div
                        v-for="seq in sequences"
                        :key="seq.id"
                        class="rounded-2xl border bg-slate-900/70 transition"
                        :class="editingSequenceId === seq.id ? 'border-cyan-300/30 bg-cyan-300/5 p-5' : 'border-white/10 p-4'"
                    >
                        <!-- Edit mode -->
                        <form v-if="editingSequenceId === seq.id" class="grid gap-5" @submit.prevent="saveSequenceEdit">
                            <div class="flex items-center justify-between">
                                <h3 class="text-sm font-semibold text-cyan-100">Edit sequence</h3>
                                <button type="button" @click="cancelSequenceEdit" class="rounded-full p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                                </button>
                            </div>

                            <div class="grid gap-4 sm:grid-cols-2">
                                <label class="grid gap-1.5">
                                    <span class="text-xs font-medium text-slate-400">Name</span>
                                    <input v-model="editSequenceForm.name" type="text" class="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm outline-none focus:border-cyan-300/50 transition" />
                                </label>
                                <label class="grid gap-1.5">
                                    <span class="text-xs font-medium text-slate-400">Loop count</span>
                                    <div class="flex items-center gap-2">
                                        <input v-model.number="editSequenceForm.loop_count" type="number" min="1" class="w-20 rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm outline-none focus:border-cyan-300/50 transition tabular-nums" />
                                        <span class="text-xs text-slate-400">{{ editSequenceForm.loop_count === 1 ? 'plays once' : `repeats ${editSequenceForm.loop_count}×` }}</span>
                                    </div>
                                </label>
                            </div>

                            <!-- Countdown picker -->
                            <div class="grid gap-2">
                                <span class="text-xs font-medium text-slate-400">Add countdowns</span>
                                <div class="flex flex-wrap gap-2">
                                    <button
                                        v-for="cd in countdowns" :key="cd.id"
                                        type="button"
                                        @click="editSequenceForm.items.push(cd)"
                                        class="group flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-800/80 px-2.5 py-1.5 text-xs transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
                                    >
                                        <span class="text-slate-200">{{ cd.name }}</span>
                                        <span class="text-slate-500">{{ formatDuration(cd.duration_seconds) }}</span>
                                        <span class="text-slate-500 group-hover:text-cyan-400">+</span>
                                    </button>
                                </div>
                            </div>

                            <!-- Items order -->
                            <div class="grid gap-2">
                                <span class="text-xs font-medium text-slate-400">Order</span>
                                <ol v-if="editSequenceForm.items.length" class="grid gap-1.5">
                                    <li v-for="(item, i) in editSequenceForm.items" :key="i" class="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-800/60 px-3 py-2">
                                        <span class="w-4 shrink-0 text-right text-xs text-slate-500 tabular-nums">{{ i + 1 }}</span>
                                        <span class="flex-1 text-xs text-slate-200">{{ item.name }}</span>
                                        <span class="text-xs text-slate-400">{{ formatDuration(item.duration_seconds) }}</span>
                                        <button type="button" @click="editSequenceForm.items.splice(i, 1)" class="shrink-0 rounded-full p-1 text-slate-500 transition hover:bg-red-500/20 hover:text-red-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                                        </button>
                                    </li>
                                </ol>
                                <p v-else class="text-xs text-slate-500 italic">No items — add countdowns above.</p>
                            </div>

                            <div class="flex items-center gap-2">
                                <button type="submit" :disabled="!editSequenceForm.name.trim() || editSequenceForm.items.length === 0" class="rounded-full bg-cyan-400 px-4 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-40">Save</button>
                                <button type="button" @click="cancelSequenceEdit" class="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-400 transition hover:bg-white/5">Cancel</button>
                            </div>
                        </form>

                        <!-- Display mode -->
                        <template v-else>
                            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p class="text-xs uppercase tracking-[0.25em] text-slate-400">Sequence #{{ seq.id }}</p>
                                    <h3 class="mt-1 text-base font-semibold text-white sm:text-lg">{{ seq.name }}</h3>
                                    <p class="mt-1 text-sm text-cyan-300/80">Status: <span class="font-semibold">{{ seq.status ?? 'pending' }}</span></p>
                                    <div class="mt-1 flex items-center gap-2 flex-wrap">
                                        <span class="text-xs text-slate-400">Items: {{ seq.items?.length ?? 0 }}</span>
                                        <span v-if="seq.loop_count && seq.loop_count > 1" class="rounded-full bg-cyan-400/10 border border-cyan-300/20 px-2 py-0.5 text-xs text-cyan-300">&#x21BB; {{ seq.loop_count }}×</span>
                                    </div>
                                </div>
                                <div class="flex gap-2 flex-wrap">
                                    <button
                                        v-if="seq.status !== 'running'"
                                        @click="startSequence(seq.id)"
                                        class="rounded-full bg-green-500/80 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-500 disabled:opacity-50"
                                        :disabled="controlling === seq.id"
                                    >
                                        {{ controlling === seq.id ? 'Loading…' : 'Start' }}
                                    </button>
                                    <button
                                        v-if="seq.status !== 'pending'"
                                        @click="stopSequence(seq.id)"
                                        class="rounded-full bg-red-500/80 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
                                        :disabled="controlling === seq.id"
                                    >
                                        {{ controlling === seq.id ? 'Loading…' : 'Stop' }}
                                    </button>
                                    <button
                                        v-if="seq.status === 'pending'"
                                        @click="openSequenceEdit(seq)"
                                        class="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-cyan-300/30 hover:text-cyan-300 disabled:opacity-50"
                                        :disabled="controlling === seq.id"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        @click="copySequenceShareUrl(seq.id)"
                                        class="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-cyan-300/30 hover:text-cyan-300 disabled:opacity-50"
                                        :disabled="controlling === seq.id"
                                    >
                                        {{ copiedSequenceId === seq.id ? 'Copied!' : 'Share' }}
                                    </button>
                                    <button
                                        @click="deleteSequence(seq.id)"
                                        class="rounded-full border border-red-500/30 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                                        :disabled="controlling === seq.id"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </template>
                    </div>

                    <div v-if="sequences.length === 0" class="text-center text-sm text-slate-400">
                        No sequences yet. Create one in the Sequence tab.
                    </div>
                </div>
            </section>
        </section>
    </main>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, reactive, ref } from "vue";
import { countdownService } from "../components/api/CountdownService";
const HorizontalNavStrip = defineAsyncComponent(() => import("../components/HorizontalNavStrip.vue"));

type CountdownRecord = {
    id: number;
    name: string;
    duration_seconds: number;
    notes?: string;
    background_color?: string;
    font_color?: string;
};

type SequenceRecord = {
    id: number;
    name: string;
    status?: 'pending' | 'running' | 'finished';
    loop_count?: number;
    items?: any[];
};

const countdowns = ref<CountdownRecord[]>([]);
const sequences = ref<SequenceRecord[]>([]);
const activeTab = ref<'create' | 'sequence' | 'control'>('create');
const controlling = ref<number | null>(null);
const feedback = ref("");
const shareUrl = ref("");
const showCreateForm = ref(false);
const editingId = ref<number | null>(null);
const sequenceItems = ref<CountdownRecord[]>([]);
const copiedSequenceId = ref<number | null>(null);

const editForm = reactive({
    name: "",
    duration_seconds: 60,
    notes: "",
    background_color: "#0f172a",
    font_color: "#f1f5f9",
});

const durationPresets = [
    { label: '30s', value: 30 },
    { label: '1m',  value: 60 },
    { label: '5m',  value: 300 },
    { label: '10m', value: 600 },
    { label: '15m', value: 900 },
    { label: '30m', value: 1800 },
    { label: '1h',  value: 3600 },
];

const countdownForm = reactive({
    name: "",
    duration_seconds: 60,
    notes: "",
    background_color: "#0f172a",
    font_color: "#f1f5f9",
});

const sequenceForm = reactive({
    name: "",
    loop_count: 1,
});

const totalSequenceDuration = computed(() =>
    sequenceItems.value.reduce((sum, item) => sum + item.duration_seconds, 0),
);

function formatDuration(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

// Color contrast checking utilities
function hexToRgb(hex: string): [number, number, number] | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1]!, 16) / 255,
        parseInt(result[2]!, 16) / 255,
        parseInt(result[3]!, 16) / 255,
    ] : null;
}

function getLuminance(rgb: [number, number, number]): number {
    const [r, g, b] = rgb;
    const luminance = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    return 0.2126 * luminance(r) + 0.7152 * luminance(g) + 0.0722 * luminance(b);
}

function getContrastRatio(hex1: string, hex2: string): number | null {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    if (!rgb1 || !rgb2) return null;
    
    const l1 = getLuminance(rgb1);
    const l2 = getLuminance(rgb2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
}

function getContrastStatus(ratio: number | null): { status: 'good' | 'warning' | 'fail', text: string } {
    if (ratio === null) return { status: 'fail', text: 'Invalid color format' };
    if (ratio >= 7) return { status: 'good', text: `Excellent contrast (${ratio.toFixed(1)}:1)` };
    if (ratio >= 4.5) return { status: 'good', text: `Good contrast (${ratio.toFixed(1)}:1)` };
    if (ratio >= 3) return { status: 'warning', text: `Low contrast (${ratio.toFixed(1)}:1)` };
    return { status: 'fail', text: `Very poor contrast (${ratio.toFixed(1)}:1)` };
}

const createFormContrast = computed(() => {
    const ratio = getContrastRatio(countdownForm.background_color, countdownForm.font_color);
    return getContrastStatus(ratio);
});

const editFormContrast = computed(() => {
    const ratio = getContrastRatio(editForm.background_color, editForm.font_color);
    return getContrastStatus(ratio);
});

function openEdit(item: CountdownRecord) {
    editingId.value = item.id;
    editForm.name = item.name;
    editForm.duration_seconds = item.duration_seconds;
    editForm.notes = item.notes ?? "";
    editForm.background_color = item.background_color ?? "#0f172a";
    editForm.font_color = item.font_color ?? "#f1f5f9";
    showCreateForm.value = false;
}

function cancelEdit() {
    editingId.value = null;
}

async function saveEdit() {
    if (editingId.value === null) return;
    await countdownService.updateCountdown(editingId.value, {
        name: editForm.name,
        duration_seconds: Number(editForm.duration_seconds),
        notes: editForm.notes,
        background_color: editForm.background_color,
        font_color: editForm.font_color,
    });
    editingId.value = null;
    await loadData();
}

async function deleteCountdown(countdownId: number) {
    if (!confirm('Delete this countdown? This cannot be undone.')) return;
    await countdownService.deleteCountdown(countdownId);
    await loadData();
}

function cancelCreate() {
    showCreateForm.value = false;
    countdownForm.name = "";
    countdownForm.duration_seconds = 60;
    countdownForm.notes = "";
    feedback.value = "";
}

function addToSequence(countdown: CountdownRecord) {
    sequenceItems.value.push(countdown);
}

function removeFromSequence(index: number) {
    sequenceItems.value.splice(index, 1);
}

async function loadData() {
    const response = await countdownService.listCountdowns();
    countdowns.value = response.data ?? [];
}

async function createCountdown() {
    const response = await countdownService.createCountdown({
        ...countdownForm,
        duration_seconds: Number(countdownForm.duration_seconds),
    });
    feedback.value = `Saved!`;
    countdownForm.name = "";
    countdownForm.duration_seconds = 60;
    countdownForm.notes = "";
    countdownForm.background_color = "#0f172a";
    countdownForm.font_color = "#f1f5f9";
    await loadData();
    setTimeout(() => {
        feedback.value = "";
        showCreateForm.value = false;
    }, 1200);
}

async function createSequence() {
    const items = sequenceItems.value.map((cd) => ({ countdown_id: cd.id }));
    const response = await countdownService.createSequence({
        name: sequenceForm.name,
        loop_count: sequenceForm.loop_count || 1,
        items,
    });
    const share = await countdownService.createShare(response.data.id);
    shareUrl.value = share.data?.token ? `${window.location.origin}/shared/${share.data.token}` : "";
    sequenceForm.name = "";
    sequenceForm.loop_count = 1;
    sequenceItems.value = [];
}

async function loadSequences() {
    const response = await countdownService.listSequences();
    sequences.value = response.data ?? [];
}

async function startSequence(sequenceId: number) {
    controlling.value = sequenceId;
    await countdownService.startSequence(sequenceId);
    await loadSequences();
    controlling.value = null;
}

async function stopSequence(sequenceId: number) {
    controlling.value = sequenceId;
    await countdownService.stopSequence(sequenceId);
    await loadSequences();
    controlling.value = null;
}

async function deleteSequence(sequenceId: number) {
    if (!confirm('Delete this sequence? This cannot be undone.')) return;
    controlling.value = sequenceId;
    await countdownService.deleteSequence(sequenceId);
    await loadSequences();
    controlling.value = null;
}

async function copySequenceShareUrl(sequenceId: number) {
    try {
        const response = await countdownService.getSequence(sequenceId);
        const token = response.data?.share?.token;
        if (!token) {
            console.error("No share token found");
            return;
        }
        const url = `${window.location.origin}/shared/${token}`;
        await navigator.clipboard.writeText(url);
        copiedSequenceId.value = sequenceId;
        setTimeout(() => {
            copiedSequenceId.value = null;
        }, 2000);
    } catch (error) {
        console.error("Failed to copy share URL:", error);
    }
}

const editingSequenceId = ref<number | null>(null);
const editSequenceForm = reactive({
    name: "",
    loop_count: 1,
    items: [] as CountdownRecord[],
});

async function openSequenceEdit(seq: SequenceRecord) {
    const response = await countdownService.getSequence(seq.id);
    const full = response.data;
    editingSequenceId.value = seq.id;
    editSequenceForm.name = full.name;
    editSequenceForm.loop_count = full.loop_count ?? 1;
    editSequenceForm.items = (full.items ?? []).map((i: any) => ({
        id: i.countdown.id,
        name: i.countdown.name,
        duration_seconds: i.countdown.duration_seconds,
    }));
}

function cancelSequenceEdit() {
    editingSequenceId.value = null;
}

async function saveSequenceEdit() {
    if (editingSequenceId.value === null) return;
    await countdownService.updateSequence(editingSequenceId.value, {
        name: editSequenceForm.name,
        loop_count: editSequenceForm.loop_count || 1,
        items: editSequenceForm.items.map((cd) => ({ countdown_id: cd.id })),
    });
    editingSequenceId.value = null;
    await loadSequences();
}

onMounted(() => {
    void loadData();
    void loadSequences();
});
</script>
