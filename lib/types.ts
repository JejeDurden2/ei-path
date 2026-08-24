export type ArchetypeName =
  | "Harmonizer"
  | "Rebel"
  | "Persister"
  | "Promoter"
  | "Imaginer"
  | "Thinker";

export interface Archetype {
  name: ArchetypeName;
  color: string;
  quote: string;
  driver: string;
  strengths: string;
  stressTriggers: string;
  underStress: string;
  howToSupport: string;
  whereTheyShine: string;
}

export interface Situation {
  name: string;
  opening: Record<ArchetypeName, string>;
  advice: Record<ArchetypeName, { move: string; example: string }>;
}

export type ManualKey =
  | "name"
  | "role"
  | "base"
  | "phase"
  | "best"
  | "triggers"
  | "under"
  | "fb"
  | "reco"
  | "need"
  | "blind";

export interface ManualField {
  key: ManualKey;
  label: string;
  placeholder: string;
  kind: "input" | "textarea" | "select";
  options?: string[];
}

export interface QuizOption {
  label: string;
  archetype?: ArchetypeName;
}

export interface QuizQuestion {
  question: string;
  manualField?: "fb" | "reco" | "blind";
  options: QuizOption[];
}

export interface TreeBranch {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  modules: string[];
  href?: string;
}

export interface RehearsalCues {
  good: string[];
  bad: string[];
}

export interface StepItem {
  title: string;
  body: string;
}

export interface FormatItem {
  title: string;
  summary: string;
  detail: string;
}
