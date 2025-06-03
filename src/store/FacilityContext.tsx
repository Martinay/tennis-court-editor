import React, { createContext, useReducer, useContext, Dispatch } from "react";

// ----------  Domain models
export type LineId   = "baselineNear" | "baselineFar" | "sidelineLeft" | "sidelineRight" | "serviceLine";
export type AnchorId = "a1" | "a2" | "a3" | "a4";

export interface CourtState {
  lines:   Record<LineId, boolean>;
  anchors: Record<AnchorId, boolean>;
}

export interface Facility {
  id:          string;
  name:        string;
  numCourts:   number;
  view:        string;               // Blickrichtung (e.g. "Weg")
  courts:      CourtState[];         // length === numCourts
}

// ----------  LocalStorage helpers
const STORAGE_KEY = "facilities_v1";
const load = (): Facility[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
};
const save = (facs: Facility[]) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(facs));

// ----------  Actions
type Action =
  | { type: "ADD_FACILITY"; payload: Facility }
  | { type: "UPDATE_FACILITY"; payload: Facility }
  | { type: "TOGGLE_LINE"; fid: string; court: number; line: LineId }
  | { type: "TOGGLE_ANCHOR"; fid: string; court: number; anchor: AnchorId };

// ----------  Initial court template
const emptyCourt = (): CourtState => ({
  lines:   { baselineNear:false, baselineFar:false, sidelineLeft:false, sidelineRight:false, serviceLine:false },
  anchors: { a1:false, a2:false, a3:false, a4:false },
});

// ----------  Reducer
function reducer(state: Facility[], action: Action): Facility[] {
  switch (action.type) {
    case "ADD_FACILITY": {
      const next = [...state, action.payload];
      save(next); return next;
    }
    case "UPDATE_FACILITY": {
      const next = state.map(f => f.id === action.payload.id ? action.payload : f);
      save(next); return next;
    }
    case "TOGGLE_LINE":
    case "TOGGLE_ANCHOR": {
      const next = state.map(f => {
        if (f.id !== action.fid) return f;
        const courts = [...f.courts];
        const court  = { ...courts[action.court] };

        if (action.type === "TOGGLE_LINE")
          court.lines[action.line] = !court.lines[action.line];
        else
          court.anchors[action.anchor] = !court.anchors[action.anchor];

        courts[action.court] = court;
        return { ...f, courts };
      });
      save(next); return next;
    }
    default: return state;
  }
}

// ----------  Context
const Ctx = createContext<[Facility[], Dispatch<Action>]>([[], () => null]);

export const FacilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, [], load);
  return <Ctx.Provider value={[state, dispatch]}>{children}</Ctx.Provider>;
};

export const useFacilities = () => useContext(Ctx);
