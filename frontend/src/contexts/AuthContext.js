import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase";

const AuthContext = React.createContext();

// custom hook
export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    const signup = (email, password) => {
        return auth.createUserWithEmailAndPassword(email, password);
    };

    const login = (email, password) => {
        return auth.signInWithEmailAndPassword(email, password);
    };

    const logout = () => {
        return auth.signOut();
    };

    const resetPassword = email => {
        return auth.sendPasswordResetEmail(email);
    };

    const changeEmail = email => {
        return currentUser.updateEmail(email);
    };

    const changePassword = password => {
        return currentUser.updatePassword(password);
    };

    useEffect(() => {
        // this useEffect is properly cleaned up
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    // these will be exported
    const value = {
        currentUser,
        login,
        signup,
        logout,
        resetPassword,
        changeEmail,
        changePassword,
    };

    return (
        <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
    );
};
