"use client";

import React, { createContext, useContext, useState } from 'react';

const ViewContext = createContext<any>(null);

export const ViewProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentView, setCurrentView] = useState("landing");

    return (
        <ViewContext.Provider value={{ currentView, setCurrentView }}>
            {children}
        </ViewContext.Provider>
    );
};

export const useView = () => {
    const context = useContext(ViewContext);
    if (!context) {
        throw new Error("useView must be used within a ViewProvider");
    }
    return context;
};
