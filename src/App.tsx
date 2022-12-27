import { Box, Center, Grid, GridItem } from "@chakra-ui/react";
import {
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { CalculatorButton } from "./components/CalculatorButton";
import { DigitButton } from "./components/DigitButton";
import { OperationButton } from "./components/OperationButton";
import reducer, { Actions, initialState, Operations } from "./reducer";

const INTEGER_FORMATTER = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
});

function formatOperand(operand: string): string {
  if (operand === "") return "";
  if (!operand.includes("."))
    return INTEGER_FORMATTER.format(parseFloat(operand));
  const [integer, decimal] = operand.split(".");
  return `${INTEGER_FORMATTER.format(parseFloat(integer))}.${decimal}`;
}

declare global {
  interface WindowEventMap {
    keydown: KeyboardEvent<HTMLInputElement>;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const keyNumbers = useMemo(
    () => ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "."],
    []
  );
  const handleKeyPress = useCallback(
    (ev: KeyboardEvent<HTMLInputElement>) => {
      ev.preventDefault();
      const { key } = ev;
      switch (key) {
        case "Enter":
          return dispatch({ type: Actions.EVALUATE });
        case "Escape":
          return dispatch({ type: Actions.CLEAR });
        case "Backspace":
          return dispatch({ type: Actions.DELETE_DIGIT });
        case "+":
          return dispatch({
            type: Actions.CHOOSE_OPERATION,
            payload: { operation: Operations.ADD },
          });
        case "-":
          return dispatch({
            type: Actions.CHOOSE_OPERATION,
            payload: { operation: Operations.SUBTRACT },
          });
        case "*":
          return dispatch({
            type: Actions.CHOOSE_OPERATION,
            payload: { operation: Operations.MULTIPLY },
          });
        case "/":
          return dispatch({
            type: Actions.CHOOSE_OPERATION,
            payload: { operation: Operations.DIVIDE },
          });
        default:
          if (keyNumbers.includes(key))
            return dispatch({
              type: Actions.ADD_DIGIT,
              payload: { digit: key },
            });
          break;
      }
    },
    [keyNumbers]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <Center h="100vh" w="100w" bg="#e3e3e3">
      <Box boxShadow="md">
        <Grid
          templateColumns="repeat(4, 6rem)"
          templateRows="minmax(7rem, auto) repeat(5, 6rem)"
          textAlign="center"
          gap={1}
          justifyContent="center"
          p={1}
        >
          <GridItem colSpan={4}>
            <Box
              background="teal.600"
              borderRadius="md"
              w="100%"
              h="100%"
              display="flex"
              flexDir="column"
              justifyContent="space-between"
              alignItems="flex-end"
              p="3"
              overflow="hidden"
            >
              <Box fontSize="2xl" color="whiteAlpha.700">
                {formatOperand(state.previousOperand)} {state.operation}
              </Box>
              <Box fontSize="4xl" color="white">
                {formatOperand(state.currentOperand)}
              </Box>
            </Box>
          </GridItem>
          <GridItem colSpan={2}>
            <CalculatorButton onClick={() => dispatch({ type: Actions.CLEAR })}>
              AC
            </CalculatorButton>
          </GridItem>
          <GridItem>
            <CalculatorButton
              onClick={() => dispatch({ type: Actions.DELETE_DIGIT })}
            >
              DEL
            </CalculatorButton>
          </GridItem>
          <OperationButton operation="÷" dispatch={dispatch} />
          <DigitButton digit="7" dispatch={dispatch} />
          <DigitButton digit="8" dispatch={dispatch} />
          <DigitButton digit="9" dispatch={dispatch} />
          <OperationButton operation="&times;" dispatch={dispatch} />
          <DigitButton digit="4" dispatch={dispatch} />
          <DigitButton digit="5" dispatch={dispatch} />
          <DigitButton digit="6" dispatch={dispatch} />
          <OperationButton operation="-" dispatch={dispatch} />
          <DigitButton digit="1" dispatch={dispatch} />
          <DigitButton digit="2" dispatch={dispatch} />
          <DigitButton digit="3" dispatch={dispatch} />
          <OperationButton operation="+" dispatch={dispatch} />
          <CalculatorButton onClick={() => dispatch({ type: Actions.CONVERT })}>
            ±
          </CalculatorButton>
          <DigitButton digit="0" dispatch={dispatch} />
          <DigitButton digit="." dispatch={dispatch} />
          <CalculatorButton
            onClick={() => dispatch({ type: Actions.EVALUATE })}
          >
            =
          </CalculatorButton>
        </Grid>
      </Box>
    </Center>
  );
}

export default App;
