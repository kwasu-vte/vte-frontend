"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface AppState {
  someValue: string;
  setSomeValue: (value: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [someValue, setSomeValue] = useState("Hello from Context!");

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider value={{ someValue, setSomeValue }}>
        {children}
      </AppContext.Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
