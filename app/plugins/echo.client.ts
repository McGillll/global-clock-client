import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

export default defineNuxtPlugin(() => {
    if (process.server) return;

    const broadcasterDriver = process.env.NUXT_PUBLIC_BROADCASTER_DRIVER || 'log';

    // Only instantiate a real Echo client for supported broadcasters (e.g., pusher)
    if (broadcasterDriver === 'pusher') {
        const key = process.env.NUXT_PUBLIC_PUSHER_APP_KEY || '';
        const cluster = process.env.NUXT_PUBLIC_PUSHER_CLUSTER || 'mt1';

        Pusher.logToConsole = false;

        const echo = new Echo({
            broadcaster: 'pusher',
            key,
            cluster,
            forceTLS: true,
            client: new Pusher(key, { cluster }),
        });

        (window as any).Echo = echo;

        return {
            provide: { echo },
        };
    }

    // For other drivers (like 'log'), provide a safe no-op Echo-like object
    const mockChannel = () => ({
        listen: (_event: string, _cb: Function) => ({ stopListening: () => {}, unsubscribe: () => {}, leave: () => {} }),
        stopListening: () => {},
        leave: () => {},
    });

    const mockEcho: any = {
        private: (_name: string) => mockChannel(),
        channel: (_name: string) => mockChannel(),
        listen: (_event: string, _cb: Function) => {},
        leave: (_name: string) => {},
    };

    (window as any).Echo = mockEcho;

    return {
        provide: { echo: mockEcho },
    };
});
