import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import React, { useRef } from "react";
import { useFormik } from "formik";
import { object, string } from "yup";
import { Link, useLocation } from "wouter";
import { useFlashError } from "../state/flashError";

interface LoginProps {
  method?: "password" | "zoom";
}

export const Login = ({ method }: LoginProps) => {
  useLocation();
  const query = new URLSearchParams(window.location.search);

  const ref = useRef<HTMLFormElement>(null);
  const errorMessage = useFlashError();
  const redirect = query.get("redirect");

  const { errors, touched, values, handleBlur, handleChange } = useFormik({
    initialValues: {
      email: query.get("email") || "",
      password: "",
    },
    validationSchema: object({
      email: string().email().required(),
      password: string().min(12).required(),
    }),
    validateOnChange: true,
    validateOnMount: true,
    onSubmit: async (values, helpers) => {},
  });

  return (
    <Box padding="25px" minWidth="350px">
      <Heading marginBottom="15px">Log in</Heading>
      {(!method || method === "password") && (
        <form
          ref={ref}
          action={redirect ? `/login?redirect=${redirect}` : "/login"}
          method="post"
          onSubmit={(e) => {
            if (Object.keys(errors).length > 0) {
              e.preventDefault();
            }
          }}
        >
          {errorMessage && (
            <Alert status="error">
              <AlertIcon />
              {errorMessage}
            </Alert>
          )}
          <FormControl
            padding="5px 0px"
            isInvalid={!!errors.email && touched.email}
          >
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>
          <FormControl
            padding="5px 0px"
            isInvalid={!!errors.password && touched.password}
          >
            <FormLabel>Password</FormLabel>
            <Input
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              type="password"
            />
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>
          <FormControl padding="5px 0px">
            <Flex justifyContent="center" alignItems="center">
              <Button
                isDisabled={Object.keys(errors).length > 0}
                variant="brandInverted"
                marginTop="15px"
                type="submit"
              >
                Submit
              </Button>
            </Flex>
          </FormControl>
        </form>
      )}
      <Divider />
      {(!method || method === "zoom") && (
        <Flex justifyContent="center" alignItems="center">
          <Button
            margin="15px auto"
            as="a"
            href={
              redirect ? `/zoom/connect?redirect=${redirect}` : "/zoom/connect"
            }
            variant="brand"
          >
            Log in with Zoom
          </Button>
        </Flex>
      )}
      <Box marginTop="25px">
        Don't have an account?{" "}
        <Button
          as={Link}
          href={redirect ? `/signup?redirect=${redirect}` : "/signup"}
          variant="link"
        >
          sign up
        </Button>{" "}
        instead.
      </Box>
    </Box>
  );
};
