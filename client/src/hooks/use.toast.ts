'use client';

import toast from 'react-hot-toast';

export type ToastType = 'success' | 'error' | 'loading' | 'info';

interface ToastMessages {
    loading: string;
    success: string;
    error: string;
}

export const useToast = () => {
    return {
        success: (message: string) => {
            toast.success(message, {
                duration: 4000,
                icon: '✓',
            });
            },
            error: (message: string) => {
            toast.error(message, {
                duration: 4000,
                icon: '✕',
            });
            },
            info: (message: string) => {
            toast(message, {
                duration: 4000,
                icon: 'ℹ️',
            });
            },
            loading: (message: string) => {
                return toast.loading(message);
            },
            promise: <T,>(
            promise: Promise<T>,
            messages: ToastMessages
            ): Promise<T> => {
                return new Promise((resolve, reject) => {
                    toast.promise(
                    promise,
                    {
                        loading: messages.loading,
                        success: messages.success,
                        error: messages.error,
                    }
                    ).then(resolve).catch(reject);
                });
            },
            dismiss: (toastId?: string) => {
            if (toastId) {
                toast.dismiss(toastId);
            } else {
                toast.dismiss();
            }
            },
            custom: (component: string) => {
            toast.custom(component, {
                duration: 4000,
            });
        },
    };
};




