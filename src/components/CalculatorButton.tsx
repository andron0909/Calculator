import { FC } from "react";
import { Button, ButtonProps } from "@chakra-ui/react";

export const CalculatorButton: FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <Button
      w="100%"
      h="100%"
      colorScheme="teal"
      bg="teal.300"
      fontSize="2xl"
      {...rest}
    >
      {children}
    </Button>
  );
};
