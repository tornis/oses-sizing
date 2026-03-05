"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Types
export type TierType = "hot" | "warm" | "cold" | "frozen";

export interface GlobalSettings {
  maxMemoryPerNode: number;
  growthPercentage: number;
  maxShardSizeGB: number;
  selectedTiers: TierType[];
  tierRatios: Record<TierType, number>;
}

export interface TierData {
  volumePerDayGB: number;
  retentionDays: number;
  replicas: number;
}

export interface ArchitectureData {
  masterNodes: number;
  masterDiskGB: number;
  masterRamGB: number;
  mlNodes: number;
  mlDiskGB: number;
  mlRamGB: number;
  coordNodes: number;
  coordDiskGB: number;
  coordRamGB: number;
}

export interface UserInfo {
  name: string;
  email: string;
  termsAccepted: boolean;
}

export interface WizardState {
  userInfo: UserInfo;
  global: GlobalSettings;
  tiers: Record<TierType, TierData>;
  architecture: ArchitectureData;
}

// Initial State defaults
const initialData: WizardState = {
  userInfo: {
    name: "",
    email: "",
    termsAccepted: false,
  },
  global: {
    maxMemoryPerNode: 64,
    growthPercentage: 10,
    maxShardSizeGB: 50,
    selectedTiers: ["hot", "frozen"],
    tierRatios: { hot: 16, warm: 64, cold: 128, frozen: 1600 }
  },
  tiers: {
    hot: { volumePerDayGB: 2, retentionDays: 1, replicas: 1 },
    warm: { volumePerDayGB: 0, retentionDays: 40, replicas: 0 },
    cold: { volumePerDayGB: 0, retentionDays: 10, replicas: 0 },
    frozen: { volumePerDayGB: 4000, retentionDays: 180, replicas: 0 },
  },
  architecture: {
    masterNodes: 3,
    masterDiskGB: 50,
    masterRamGB: 64,
    mlNodes: 1,
    mlDiskGB: 50,
    mlRamGB: 64,
    coordNodes: 0,
    coordDiskGB: 50,
    coordRamGB: 64,
  },
};

interface WizardContextProps {
  state: WizardState;
  updateUserInfo: (data: Partial<UserInfo>) => void;
  updateGlobal: (data: Partial<GlobalSettings>) => void;
  updateTier: (tier: TierType, data: Partial<TierData>) => void;
  updateArchitecture: (data: Partial<ArchitectureData>) => void;
  updateAllTiersVolume: (volumePerDayGB: number) => void;
  currentStepIndex: number;
  setCurrentStepIndex: (index: number) => void;
  steps: string[]; // Dynamic sequence of step names
}

const WizardContext = createContext<WizardContextProps | undefined>(undefined);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WizardState>(initialData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const updateUserInfo = (data: Partial<UserInfo>) => {
    setState((prev) => ({
      ...prev,
      userInfo: { ...prev.userInfo, ...data },
    }));
  };

  const updateGlobal = (data: Partial<GlobalSettings>) => {
    setState((prev) => ({
      ...prev,
      global: { ...prev.global, ...data },
    }));
  };

  const updateTier = (tier: TierType, data: Partial<TierData>) => {
    setState((prev) => ({
      ...prev,
      tiers: {
        ...prev.tiers,
        [tier]: { ...prev.tiers[tier], ...data },
      },
    }));
  };

  const updateArchitecture = (data: Partial<ArchitectureData>) => {
    setState((prev) => ({
      ...prev,
      architecture: { ...prev.architecture, ...data },
    }));
  };

  const updateAllTiersVolume = (volumePerDayGB: number) => {
    setState((prev) => ({
      ...prev,
      tiers: {
        hot: { ...prev.tiers.hot, volumePerDayGB },
        warm: { ...prev.tiers.warm, volumePerDayGB },
        cold: { ...prev.tiers.cold, volumePerDayGB },
        frozen: { ...prev.tiers.frozen, volumePerDayGB },
      },
    }));
  };

  // Determine dynamic steps based on globals
  const steps = ["userinfo", "global", "config"];
  state.global.selectedTiers.forEach((tier) => {
    steps.push(tier);
  });
  steps.push("architecture");
  steps.push("results");

  return (
    <WizardContext.Provider
      value={{
        state,
        updateUserInfo,
        updateGlobal,
        updateTier,
        updateArchitecture,
        updateAllTiersVolume,
        currentStepIndex,
        setCurrentStepIndex,
        steps,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error("useWizard must be used within a WizardProvider");
  }
  return context;
}
