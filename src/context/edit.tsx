import { createContext, useContext } from "react";

// Where an in-place edit writes to in the overrides object.
export type ImgTarget =
  | { kind: "player"; key: string }
  | { kind: "flag"; key: string }
  | { kind: "mascot"; key: string | string[] }
  | { kind: "hero"; index: number }
  | { kind: "featured"; index: number }
  | { kind: "ad"; slot: "sidebarTop" | "sidebarBottom" }
  | { kind: "adExtra"; index: number };

export type TextTarget =
  | { kind: "hero"; index: number; field: "tag" | "title" | "sub" | "color" }
  | { kind: "featured"; index: number; field: "animal" | "nick" | "country" | "color" }
  | { kind: "adLink"; slot: "sidebarTop" | "sidebarBottom" }
  | { kind: "adExtraLink"; index: number };

export type ListKind = "hero" | "featured" | "ad";

type EditCtx = {
  editing: boolean;
  onImage: (t: ImgTarget, url: string | null) => void;
  onText: (t: TextTarget, value: string) => void;
  addItem: (kind: ListKind) => void;
  removeItem: (kind: ListKind, index: number) => void;
  onError: (msg: string) => void;
};

export const EditContext = createContext<EditCtx>({
  editing: false,
  onImage: () => {},
  onText: () => {},
  addItem: () => {},
  removeItem: () => {},
  onError: () => {},
});

export const useEdit = () => useContext(EditContext);
