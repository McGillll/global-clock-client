<template>
    <main class="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <section class="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 lg:px-10">
            <!-- Sequence name + loop indicator -->
            <div class="flex items-center justify-center gap-4">
                <p class="text-3xl font-bold uppercase tracking-[0.3em] ">{{ sequence?.name ?? '…' }}</p>
                <span v-if="loopCount > 1" class="text-3xl font-bold uppercase">
                    {{ currentLoop }}
                </span>
            </div>
            <article class="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur">

                <!-- Status + current item -->
                <p class="mt-4 text-xs uppercase tracking-[0.3em] text-cyan-200/50">{{ isFinished ? 'finished' : (sequence?.status ?? 'pending') }}</p>
                <h2 class="mt-1 text-3xl font-semibold">{{ isFinished ? 'Complete' : (activeItem?.countdown.name ?? 'Waiting for admin control') }}</h2>

                <!-- Timer -->
                <div class="mt-6 flex items-end gap-4">
                    <p class="text-6xl font-semibold tabular-nums text-white sm:text-7xl">{{ formattedRemaining }}</p>
                    <span class="pb-3 text-sm uppercase tracking-[0.35em] text-cyan-100/70">{{ isFinished ? 'finished' : 'remaining' }}</span>
                </div>
            </article>
        </section>
    </main>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { countdownService } from "../../components/api/CountdownService";
import { useCountdownDisplay } from "../../composables/useCountdownDisplay";

const route = useRoute();
const token = String(route.params.token ?? "");
const sequence = ref<any | null>(null);

const { activeItem, currentItemPosition, formattedRemaining, isFinished, currentLoop, loopCount } = useCountdownDisplay(sequence);

let refreshTimer: ReturnType<typeof setInterval> | null = null;
let echoUnsubscribe: (() => void) | null = null;

async function loadSequence() {
    const response = await countdownService.getSharedSequence(token);
    sequence.value = response.data?.sequence ?? response.data ?? null;

    // Subscribe to Echo channel if we now have a sequence ID
    if (sequence.value?.id && !echoUnsubscribe) {
        subscribeToUpdates();
    }
}

function subscribeToUpdates() {
    if (!sequence.value?.id || typeof window === "undefined") return;

    const echo = (window as any).Echo;
    if (!echo) return;

    try {
        // Subscribe to private channel for this countdown sequence
        const channel = echo.private(`countdown.${sequence.value.id}`);

        // Listen for sequence updates
        channel.listen("CountdownSequenceUpdated", (event: any) => {
            if (event.sequence) {
                sequence.value = event.sequence;
            }
        });

        // Store unsubscribe function
        echoUnsubscribe = () => {
            echo.leave(`countdown.${sequence.value?.id}`);
        };

        console.log(`Subscribed to countdown.${sequence.value.id}`);
    } catch (error) {
        console.error("Failed to subscribe to Echo channel:", error);
    }
}

onMounted(() => {
    void loadSequence();

    // Keep polling as fallback but reduce to 30 seconds
    refreshTimer = setInterval(() => {
        void loadSequence();
    }, 30000);
});

onBeforeUnmount(() => {
    if (refreshTimer !== null) {
        clearInterval(refreshTimer);
    }
    if (echoUnsubscribe) {
        echoUnsubscribe();
    }
});
</script>