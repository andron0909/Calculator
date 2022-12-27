import { GridItem, GridItemProps } from "@chakra-ui/react";
import { Dispatch, FC } from "react";
import { Action, Actions } from "../reducer";
import { CalculatorButton } from "./CalculatorButton";

interface OperationButtonProps extends GridItemProps {
  operation: string;
  dispatch: Dispatch<Action>;
}

export const OperationButton: FC<OperationButtonProps> = ({
  operation,
  dispatch,
  ...rest
}) => {
  return (
    <GridItem {...rest}>
      <CalculatorButton
        onClick={() =>
          dispatch({ type: Actions.CHOOSE_OPERATION, payload: { operation } })
        }
      >
        {operation}
      </CalculatorButton>
    </GridItem>
  );
};
