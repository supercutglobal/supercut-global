// Tiny store so any admin component can call toast.success(...) without a provider.
// It lives on globalThis because this module is bundled into both the layout and page chunks;
// after a hot reload those copies could otherwise hold separate lists and toasts would never show.
const store = (globalThis.__adminToasts ??= { toasts: [], nextId: 1, listeners: new Set() });
export const currentToasts = () => store.toasts;
export const listeners = store.listeners;
const emit = () => store.listeners.forEach((fn) => fn(store.toasts));

function dismiss(id) {
  store.toasts = store.toasts.filter((t) => t.id !== id);
  emit();
}

/** Shows a toast, or replaces the one with `id` (e.g. turning "Saving…" into "Saved"). Returns its id. */
function show(type, message, { id, duration = type === "loading" || type === "confirm" ? null : 3500, ...extra } = {}) {
  const toastId = id ?? store.nextId++;
  const t = { id: toastId, type, message, ...extra };
  store.toasts = store.toasts.some((x) => x.id === toastId) ? store.toasts.map((x) => (x.id === toastId ? t : x)) : [...store.toasts, t];
  emit();
  if (duration) setTimeout(() => store.toasts.includes(t) && dismiss(toastId), duration);
  return toastId;
}

export const toast = {
  success: (message, opts) => show("success", message, opts),
  error: (message, opts) => show("error", message, { duration: 6000, ...opts }),
  loading: (message, opts) => show("loading", message, opts),
  dismiss,
  /** Asks inside a toast instead of window.confirm; resolves true when the confirm button is pressed */
  confirm: (message, { confirmLabel = "Confirm" } = {}) =>
    new Promise((resolve) => {
      const id = store.nextId++;
      const answer = (ok) => {
        dismiss(id);
        resolve(ok);
      };
      show("confirm", message, { id, confirmLabel, onConfirm: () => answer(true), onCancel: () => answer(false) });
    }),
};
