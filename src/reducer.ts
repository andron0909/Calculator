export enum Actions {
  ADD_DIGIT = "add-digit",
  CHOOSE_OPERATION = "choose-operation",
  CLEAR = "clear",
  DELETE_DIGIT = "delete-digit",
  EVALUATE = "evaluate",
  CONVERT = "convert",
}

export enum Operations {
  MULTIPLY = "&times;",
  DIVIDE = "÷",
  ADD = "+",
  SUBTRACT = "-",
}

export interface IAction {
  type: Actions;
  payload: {
    digit?: string;
    operation?: string;
  };
}

export type Action =
  | { type: Actions.ADD_DIGIT; payload: { digit: string } }
  | { type: Actions.CHOOSE_OPERATION; payload: { operation: string } }
  | { type: Actions.CLEAR; payload?: null }
  | { type: Actions.DELETE_DIGIT; payload?: null }
  | { type: Actions.EVALUATE; payload?: null }
  | { type: Actions.CONVERT; payload?: null };

export interface IState {
  overwrite: boolean;
  previousOperand: string;
  operation: Operations | string;
  currentOperand: string;
}

export const initialState: IState = {
  currentOperand: "",
  operation: "",
  overwrite: false,
  previousOperand: "",
};

export default function reducer(
  state: IState,
  { type, payload }: Action
): IState {
  switch (type) {
    case Actions.ADD_DIGIT:
      if (state.overwrite)
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      if (payload.digit === "." && state.currentOperand.includes("."))
        return state;
      if (payload.digit === "." && state.currentOperand === "")
        return { ...state, currentOperand: "0." };
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    case Actions.CHOOSE_OPERATION:
      if (state.currentOperand === "" && state.previousOperand === "")
        return state;
      if (state.previousOperand === "")
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: initialState.currentOperand,
        };
      if (state.currentOperand === "")
        return {
          ...state,
          operation: payload.operation,
        };
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: initialState.currentOperand,
      };
    case Actions.CLEAR:
      return {
        ...initialState,
      };
    case Actions.DELETE_DIGIT:
      if (state.overwrite)
        return {
          ...state,
          overwrite: false,
          currentOperand: initialState.currentOperand,
        };
      if (state.currentOperand === "") return state;
      if (state.currentOperand.length === 1)
        return {
          ...state,
          currentOperand: initialState.currentOperand,
        };
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    case Actions.CONVERT:
      if (state.overwrite)
        return {
          ...state,
          overwrite: false,
          currentOperand: initialState.currentOperand,
        };
      if (state.currentOperand === "") return state;
      if (state.currentOperand.includes("-"))
        return {
          ...state,
          currentOperand: state.currentOperand.slice(1),
        };
      return {
        ...state,
        currentOperand: "-" + state.currentOperand,
      };
    case Actions.EVALUATE:
      if (
        state.operation === "" ||
        state.currentOperand === "" ||
        state.previousOperand === ""
      )
        return state;

      return {
        ...state,
        overwrite: true,
        previousOperand: initialState.previousOperand,
        operation: initialState.operation,
        currentOperand: evaluate(state),
      };
    default:
      return state;
  }
}

function evaluate({
  currentOperand,
  previousOperand,
  operation,
}: IState): string {
  const curr = parseFloat(currentOperand);
  const prev = parseFloat(previousOperand);
  if (isNaN(curr) || isNaN(prev)) return "";

  let result = 0;

  switch (operation) {
    case Operations.ADD:
      result = prev + curr;
      break;
    case Operations.SUBTRACT:
      result = prev - curr;
      break;
    case Operations.MULTIPLY:
      result = prev * curr;
      break;
    case Operations.DIVIDE:
      result = prev / curr;
      break;
    default:
      result = 0;
      break;
  }
  return result.toString();
}
