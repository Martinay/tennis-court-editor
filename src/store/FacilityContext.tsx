import React, { createContext, useReducer, useContext, Dispatch } from "react";

// ----------  Domain models
export type LineId   = "baselineNear" | "baselineFar" | "sidelineDoubleNearLeft" | "sidelineDoubleNearRight" | "sidelineDoubleFarLeft" | "sidelineDoubleFarRight" | "sidelineSingleNearLeft" | "sidelineSingleNearRight" | "sidelineSingleFarLeft" | "sidelineSingleFarRight" | "serviceLineNear" | "serviceLineFar" | "serviceLineCenterNear" | "serviceLineCenterFar";
export type AnchorId = "a1" | "a2" | "a3" | "a4";

export interface LineDetails {
  anchorSet: boolean;
  dubelUpdated: boolean;
  lineRepaired: boolean;
  isNew: boolean;
}

export interface CourtState {
  lines:   Record<LineId, LineDetails>;
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
  | { type: "UPDATE_LINE_DETAILS"; fid: string; court: number; line: LineId; details: Partial<LineDetails> }
  | { type: "TOGGLE_ANCHOR"; fid: string; court: number; anchor: AnchorId };

// ----------  Initial court template
const emptyCourt = (): CourtState => ({
  lines: {
    baselineNear: { anchorSet: false, dubelUpdated: false, lineRepaired: false, isNew: false },
    baselineFar: { anchorSet: false, dubelUpdated: false, lineRepaired: false, isNew: false },
    sidelineDoubleNearLeft: { anchorSet: false, dubelUpdated: false, lineRepaired: false, isNew: false },
    sidelineDoubleNearRight: { anchorSet: false, dubelUpdated: false, lineRepaired: false, isNew: false },
    sidelineDoubleFarLeft: { anchorSet: false, dubelUpdated: false, lineRepaired: false, isNew: false },
    sidelineDoubleFarRight: { anchorSet: false, dubelUpdated: false, lineRepaired: false, isNew: false },
    sidelineSingleNearLeft: { anchorSet: false, dubelUpdated: false, lineRepaired: false, isNew: false },
    sidelineSingleNearRight: { anchorSet: false, dubelUpdated: false, lineRepaired: false, isNew: false },
    sidelineSingleFarLeft: { anchorSet: false, dubelUpdated: false, lineRepaired: false, isNew: false },
    sidelineSingleFarRight: { anchorSet: false, dubelUpdated: false, lineRepaired: false, isNew: false },
    serviceLineNear: { anchorSet: false, dubelUpdated: false, lineRepaired: false, isNew: false },
    serviceLineFar: { anchorSet: false, dubelUpdated: false, lineRepaired: false, isNew: false },
    serviceLineCenterNear: { anchorSet: false, dubelUpdated: false, lineRepaired: false, isNew: false },
    serviceLineCenterFar: { anchorSet: false, dubelUpdated: false, lineRepaired: false, isNew: false },
  },
  anchors: { a1: false, a2: false, a3: false, a4: false },
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
    case "UPDATE_LINE_DETAILS": {
      const next = state.map(f => {
        if (f.id !== action.fid) return f;
        const courts = [...f.courts];
        const court = { ...courts[action.court] };
        const currentDetails = court.lines[action.line];
        
        court.lines[action.line] = { ...currentDetails, ...action.details };
        
        // If it's a new line, automatically set anchor and dübel
        if (action.details.isNew) {
          court.lines[action.line].anchorSet = true;
          court.lines[action.line].dubelUpdated = true;
        }
        
        courts[action.court] = court;
        return { ...f, courts };
      });
      save(next); return next;
    }
    case "TOGGLE_ANCHOR": {
      const next = state.map(f => {
        if (f.id !== action.fid) return f;
        const courts = [...f.courts];
        const court = { ...courts[action.court] };
        
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
