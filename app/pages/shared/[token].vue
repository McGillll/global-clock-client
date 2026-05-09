    <template>
    <main class="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <section class="mx-auto flex justify-center items-center w-full max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-10 lg:px-10">
            <!-- Sequence name + loop indicator -->
            <div class="flex items-center justify-center gap-1 text-center sm:flex-row sm:gap-4">
                <p class="max-w-full break-words text-2xl font-bold uppercase tracking-[0.18em] sm:text-3xl sm:tracking-[0.3em]">{{ sequence?.name ?? '…' }}</p>
                <span v-if="loopCount > 1" class="text-2xl font-bold uppercase sm:text-3xl">
                    {{ currentLoop }}
                </span>
            </div>
            <article 
                class="w-full md:w-fit lg:w-fit self-stretch rounded-3xl border border-cyan-300/20 p-4 shadow-2xl shadow-cyan-950/20 backdrop-blur transition-colors duration-300 sm:p-6 lg:mx-auto lg:max-w-5xl xl:max-w-6xl md:mx-auto md:max-w-5xl"
                :style="{
                    backgroundColor: activeItem?.countdown.background_color ? `${activeItem.countdown.background_color}15` : 'rgb(10 15 34 / 0.1)',
                    borderColor: activeItem?.countdown.background_color ? `${activeItem.countdown.background_color}33` : 'rgb(34 211 238 / 0.2)',
                }">

                <!-- Status + current item -->
                <!-- <p class="mt-4 text-xs uppercase tracking-[0.3em] text-cyan-200/50">{{ isFinished ? 'finished' : (sequence?.status ?? 'pending') }}</p> -->
                <h2 
                    class="mt-1 text-center text-2xl font-semibold leading-tight transition-colors duration-300 sm:text-3xl"
                    :style="{ color: activeItem?.countdown.font_color || '#f1f5f9' }">
                    {{ isFinished ? 'Complete' : (activeItem?.countdown.name ?? 'Waiting for admin control') }}
                </h2>

                <!-- Timer -->
                <div class="mt-4 flex flex-col items-center gap-1 text-center sm:mt-6 sm:flex-row sm:items-end sm:gap-4 sm:text-left">
                    <p 
                        class="text-5xl font-semibold tabular-nums leading-none transition-colors duration-300 sm:text-7xl"
                        :style="{ color: activeItem?.countdown.font_color || '#ffffff' }">
                        {{ formattedRemaining }}
                    </p>
                    <span 
                        class="text-xs uppercase tracking-[0.25em] transition-colors duration-300 sm:pb-3 sm:text-sm sm:tracking-[0.35em]"
                        :style="{ color: activeItem?.countdown.font_color ? `${activeItem.countdown.font_color}b3` : 'rgb(34 211 238 / 0.7)' }">
                        {{ isFinished ? 'finished' : 'remaining' }}
                    </span>
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
const serverNow = ref<number | null>(null);

const { activeItem, currentItemPosition, formattedRemaining, isFinished, currentLoop, loopCount } = useCountdownDisplay(sequence, serverNow);

let refreshTimer: ReturnType<typeof setInterval> | null = null;
let echoUnsubscribe: (() => void) | null = null;

async function loadSequence() {
    const response = await countdownService.getSharedSequence(token);
    sequence.value = response.data?.sequence ?? response.data ?? null;
    serverNow.value = response.now ?? null;

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
                serverNow.value = event.now ?? null;
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