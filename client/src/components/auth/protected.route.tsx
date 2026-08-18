"use client";

import { useEffect, ReactNode, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { AuthStore } from "@/store/auth.store";
import Loader from "@/components/ui/Loader";

interface ProtectedRouteProps {
    children: ReactNode;
}

const emptySubscribe = () => () => {};

export default function ProtectedRoute({
    children,
}: ProtectedRouteProps) {
    const { isAuthenticated, hydrate } = AuthStore();
    const router = useRouter();

    const hasHydrated = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    useEffect(() => {
        if (hasHydrated && !isAuthenticated) {
        router.push("/login");
        }
    }, [hasHydrated, isAuthenticated, router]);

    if (!hasHydrated || !isAuthenticated) {
        return <Loader fullScreen text="Checking authentication..." />;
    }

    return <>{children}</>;
}



