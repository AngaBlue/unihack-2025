import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the type for context state
interface GoalContextType {
  name: string;
  goal: string;
  setName: (name: string) => void;
  setGoal: (goal: string) => void;
}

// Create the context with an initial empty state
const GoalContext = createContext<GoalContextType | undefined>(undefined);

// Create a provider component
export const GoalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [name, setName] = useState<string>(''); // Initialize with an empty string or any default value
  const [goal, setGoal] = useState<string>(''); // Same for goal state

  return (
    <GoalContext.Provider value={{ name, goal, setName, setGoal }}>
      {children}
    </GoalContext.Provider>
  );
};

// Custom hook to use the GoalContext
export const useGoalContext = (): GoalContextType => {
  const context = useContext(GoalContext);
  if (!context) {
    throw new Error('useGoalContext must be used within a GoalProvider');
  }
  return context;
};
