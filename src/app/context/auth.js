"use client";

import { useState, useEffect, createContext } from "react";
import { auth } from "../lib/firebaseConfig";
import { setPersistence, browserLocalPersistence, onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Ensure Firebase persists login state
        setPersistence(auth, browserLocalPersistence)
            .then(() => {
                // Listen for auth state changes
                const unsubscribe = onAuthStateChanged(auth, (user) => {
                    setCurrentUser(user);
                    setLoading(false);
                });

                return () => unsubscribe();
            })
            .catch((error) => {
                console.error("Auth persistence error:", error);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>; // Prevent flicker on refresh

    return (
        <AuthContext.Provider value={currentUser}>
            {children}
        </AuthContext.Provider>
    );
};
