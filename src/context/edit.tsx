import { createContext, useContext } from "react";

// Where an in-place edit writes to in the overrides object.
export type ImgTarget =
  | { kind: "player"; key: string }
  | { kind: "flag"; key: string }
  | { kind: "mascot"; key: string | string[] }
  | { kind: "hero"; index: number }
  | { kind: "featured"; index: number }
  | { kind: "ad"; slot: "sidebarTop" | "sidebarBottom" };

export type TextTarget =
  | { kind: "hero"; index: number; field: "tag" | "title" | "sub" }
  | { kind: "featured"; index: number; field: "animal" | "nick" };

type EditCtx = {
  editing: boolean;
  onImage: (t: ImgTarget, url: string | null) => void;
  onText: (t: TextTarget, value: string) => void;
  onError: (msg: string) => void;
};

export const EditContext = createContext<EditCtx>({
  editing: false,
  onImage: () => {},
  onText: () => {},
  onError: () => {},
});

export const useEdit = () => useContext(EditContext);
