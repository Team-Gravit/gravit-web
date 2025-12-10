// src/entities/learning/ChapterContext.tsx
import { createContext, useContext, ReactNode } from "react";
import type { Unit } from "@/entities/learning/model/types";

type ChapterContextType = {
  chapterName: string;
  units: Unit[];
};

const ChapterContext = createContext<ChapterContextType | undefined>(undefined);

export const useChapter = () => {
  const context = useContext(ChapterContext);
  if (!context) throw new Error("useChapter must be used within ChapterProvider");
  return context;
};

export const ChapterProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: ChapterContextType;
}) => {
  // JSX 안에서 절대 value = something 하지 않음
  return <ChapterContext.Provider value={value}>{children}</ChapterContext.Provider>;
};
