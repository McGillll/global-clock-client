<template>
    <main class="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-50 px-4">
        <section class="w-full max-w-md">
            <div class="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-lg">
                <div class="flex items-center gap-4 mb-6">
                    <div class="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-slate-900 font-bold text-sm">GC</div>
                    <div>
                        <h1 class="text-xl font-semibold sm:text-2xl">Sign in to Global Clock</h1>
                        <p class="text-sm text-slate-300">Manage your countdowns and sequences</p>
                    </div>
                </div>

                <div class="relative">
                    <div v-if="state.isLoading" class="absolute inset-0 bg-slate-900/80 rounded-2xl flex items-center justify-center z-20">
                        <div class="text-center">
                            <div class="loader mb-4" />
                            <p class="font-semibold text-slate-100">Signing you in…</p>
                        </div>
                    </div>

                    <form class="space-y-4" @submit.prevent="doLogin" novalidate>
                        <div>
                            <label class="block text-sm font-medium text-slate-300">Email</label>
                            <input
                                v-model="form.email"
                                type="email"
                                required
                                autocomplete="email"
                                class="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-slate-300">Password</label>
                            <div class="relative">
                                <input
                                    :type="showPassword ? 'text' : 'password'"
                                    v-model="form.password"
                                    required
                                    autocomplete="current-password"
                                    class="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 pr-16 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                                />
                                <button type="button" @click="togglePasswordVisibility" class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200">
                                    {{ showPassword ? 'Hide' : 'Show' }}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            :disabled="state.isLoading || !isFormValid"
                            class="w-full rounded-lg bg-gradient-to-r from-cyan-400 to-indigo-500 px-4 py-2.5 font-semibold text-slate-900 shadow-md hover:opacity-95 disabled:opacity-50 transition text-sm"
                        >
                            Sign in
                        </button>

                        <p v-if="error" class="text-sm text-red-400">{{ error }}</p>
                    </form>
                </div>
            </div>
        </section>
    </main>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../components/api/AuthService'

const router = useRouter()

useHead({
    title: 'Sign In | Global Clock',
})

const form = reactive({ email: '', password: '' })
const error = ref('')

const state = reactive({
    isLoading: false,
})

const showPassword = ref(false)

const isFormValid = computed(() => form.email.trim() !== '' && form.password.trim() !== '')

function togglePasswordVisibility() {
    showPassword.value = !showPassword.value
}

async function doLogin() {
    error.value = ''
    state.isLoading = true
    try {
        const res = await authService.login({ email: form.email, password: form.password })
        const token = res.data?.token ?? res.token
        if (token) {
            localStorage.setItem('_token', token)
            await router.push('/')
        } else {
            error.value = 'Missing token from server response.'
        }
    } catch (e: any) {
        error.value = e?.response?._data?.message ?? e?.message ?? 'Login failed'
    } finally {
        state.isLoading = false
    }
}
</script>
