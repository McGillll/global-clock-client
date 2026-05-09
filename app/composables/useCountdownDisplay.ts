import { computed, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';

type CountdownSequenceItem = {
    position: number;
    countdown: {
        id: number;
        name: string;
        duration_seconds: number;
        background_color?: string;
        font_color?: string;
    };
};

type CountdownSequence = {
    id: number;
    name: string;
    slug: string;
    status?: 'pending' | 'running' | 'finished';
    loop_count?: number;
    started_at?: string | null;
    items?: CountdownSequenceItem[];
};

export function useCountdownDisplay(sequence: Ref<CountdownSequence | null>, serverNow: Ref<number | null> = ref(null)) {
    const now = ref(Date.now());
    const timeOffset = ref(0);

    const totalDuration = computed(() =>
        (sequence.value?.items ?? []).reduce((sum, item) => sum + item.countdown.duration_seconds, 0),
    );

    const loopCount = computed(() => sequence.value?.loop_count ?? 1);

    const elapsedSeconds = computed(() => {
        if (sequence.value?.status !== 'running' || !sequence.value.started_at) return 0;
        const adjustedNow = now.value + timeOffset.value;
        return Math.floor((adjustedNow - new Date(sequence.value.started_at).getTime()) / 1000);
    });

    // Sequence is done when elapsed has covered all loops
    const isFinished = computed(() =>
        sequence.value?.status === 'running' &&
        totalDuration.value > 0 &&
        elapsedSeconds.value >= totalDuration.value * loopCount.value,
    );

    // Which pass we're on (1-based), capped at loop_count
    const currentLoop = computed(() => {
        if (totalDuration.value === 0) return 1;
        return Math.min(Math.floor(elapsedSeconds.value / totalDuration.value) + 1, loopCount.value);
    });

    // Wrap elapsed back to start of current loop
    const effectiveElapsed = computed(() => {
        if (isFinished.value || totalDuration.value === 0) return 0;
        return elapsedSeconds.value % totalDuration.value;
    });

    const activeItem = computed(() => {
        const items = sequence.value?.items ?? [];
        if (!items.length) return null;
        if (sequence.value?.status !== 'running' || isFinished.value) return items[0];

        let cumulative = 0;
        for (const item of items) {
            cumulative += item.countdown.duration_seconds;
            if (effectiveElapsed.value < cumulative) return item;
        }
        return items[items.length - 1];
    });

    const currentItemPosition = computed(() => {
        const items = sequence.value?.items ?? [];
        if (sequence.value?.status !== 'running' || isFinished.value) return 0;

        let cumulative = 0;
        for (let i = 0; i < items.length; i++) {
            cumulative += items[i]?.countdown.duration_seconds ?? 0;
            if (effectiveElapsed.value < cumulative) return i;
        }
        return items.length - 1;
    });

    const remainingSeconds = computed(() => {
        if (isFinished.value) return 0;
        if (sequence.value?.status !== 'running') return activeItem.value?.countdown.duration_seconds ?? 0;

        let cumulative = 0;
        for (const item of (sequence.value?.items ?? [])) {
            cumulative += item.countdown.duration_seconds;
            if (effectiveElapsed.value < cumulative) return cumulative - effectiveElapsed.value;
        }
        return 0;
    });

    const formattedRemaining = computed(() => {
        const hours = Math.floor(remainingSeconds.value / 3600);
        const minutes = Math.floor((remainingSeconds.value % 3600) / 60);
        const seconds = remainingSeconds.value % 60;
        return [hours, minutes, seconds].map((s) => String(s).padStart(2, '0')).join(':');
    });

    let timer: ReturnType<typeof setInterval> | null = null;

    watch(serverNow, (newServerNow) => {
        if (newServerNow !== null) {
            timeOffset.value = newServerNow - now.value;
        }
    });

    onMounted(() => {
        timer = setInterval(() => { now.value = Date.now(); }, 100);
    });

    onBeforeUnmount(() => {
        if (timer !== null) clearInterval(timer);
    });

    return {
        activeItem,
        currentItemPosition,
        remainingSeconds,
        formattedRemaining,
        isFinished,
        currentLoop,
        loopCount,
    };
}
