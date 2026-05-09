import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue';

export function useCountdownBroadcast(sequenceId: Ref<number | null>) {
    const unsubscribe = ref<(() => void) | null>(null);

    const subscribe = (token?: string) => {
        if (!sequenceId.value) return;

        // Unsubscribe from previous channel if exists
        if (unsubscribe.value) {
            unsubscribe.value();
        }

        if (process.server) return;

        const echo = (window as any).Echo;
        if (!echo) return;

        // Subscribe to private channel for countdown sequence
        const channel = echo.private(`countdown.${sequenceId.value}`);

        // Listen for sequence updates
        channel.listen('CountdownSequenceUpdated', (event: any) => {
            // Event payload will contain updated sequence data
            console.log('Received countdown update:', event);
        });

        // Store unsubscribe function
        unsubscribe.value = () => {
            echo.leave(`countdown.${sequenceId.value}`);
        };
    };

    onBeforeUnmount(() => {
        if (unsubscribe.value) {
            unsubscribe.value();
        }
    });

    return {
        subscribe,
    };
}
