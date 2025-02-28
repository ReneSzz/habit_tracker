"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../context/auth";

const ProtectedRoute = ({ children }) => {
    const currentUser = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (currentUser === null) {
            router.push("/login");
        }
    }, [currentUser, router]);

    if (currentUser === null) return <p>Loading...</p>; // Prevents flickering

    return children;
};

export default ProtectedRoute;
