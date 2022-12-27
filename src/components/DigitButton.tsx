import { GridItem, GridItemProps } from "@chakra-ui/react";
import { Dispatch, FC } from "react";
import { Action, Actions } from "../reducer";
import { CalculatorButton } from "./CalculatorButton";

interface DigitButtonProps extends GridItemProps {
  digit: string;
  dispatch: Dispatch<Action>;
}

export const DigitButton: FC<DigitButtonProps> = ({
  digit,
  dispatch,
  ...rest
}) => {
  return (
    <GridItem {...rest}>
      <CalculatorButton
        onClick={() =>
          dispatch({ type: Actions.ADD_DIGIT, payload: { digit } })
        }
      >
        {digit}
      </CalculatorButton>
    </GridItem>
  );
};
