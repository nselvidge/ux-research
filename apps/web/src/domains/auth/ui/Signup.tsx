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
import { Link } from "wouter";
import { useFlashError } from "../state/flashError";
import { useSearchParameter } from "../state/useSearchParameter";

export const Signup = () => {
  const errorMessage = useFlashError();
  const workspace = useSearchParameter("workspace", false);
  const ref = useRef<HTMLFormElement>(null);
  const redirect = useSearchParameter("redirect", false);
  const { errors, touched, values, handleBlur, handleSubmit, handleChange } =
    useFormik({
      initialValues: {
        fullName: "",
        email: "",
        password: "",
      },
      validationSchema: object({
        fullName: string().required("Full name is required"),
        email: string().email().required("Email is required"),
        password: string().min(12).required("Password is required"),
      }),
      validateOnChange: true,
      validateOnMount: true,
      onSubmit: async (values, helpers) => {
        helpers.setSubmitting(true);
        ref.current.submit();
      },
    });

  return (
    <Box
      border="1px #E0E0E0 solid"
      padding="25px"
      minWidth="350px"
      maxWidth="450px"
    >
      <Heading marginBottom="15px">Sign up</Heading>
      {errorMessage && (
        <Alert status="error">
          <AlertIcon />
          {errorMessage}
        </Alert>
      )}
      {workspace && (
        <Alert status="info">
          <AlertIcon />
          Sign up to join {workspace}
        </Alert>
      )}
      <form
        ref={ref}
        action="/signup"
        method="post"
        onSubmit={(e) => {
          if (
            Object.keys(errors).length > 0 ||
            Object.keys(touched).length < 3
          ) {
            return handleSubmit(e);
          }
        }}
      >
        <FormControl
          padding="5px 0px"
          isInvalid={!!errors.fullName && touched.fullName}
        >
          <FormLabel>Full Name</FormLabel>
          <Input
            name="fullName"
            value={values.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <FormErrorMessage>{errors.fullName}</FormErrorMessage>
        </FormControl>
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
        <FormControl>
          <Flex justifyContent="center" alignItems="center">
            <Button
              isDisabled={Object.keys(errors).length > 0}
              variant="solid"
              marginTop="25px"
              type="submit"
            >
              Submit
            </Button>
          </Flex>
        </FormControl>
      </form>
      <Divider />
      <Flex justifyContent="center" alignItems="center">
        <Button
          margin="15px auto"
          as="a"
          href={redirect ? `/zoom/signup?redirect=${redirect}` : "/zoom/signup"}
          variant="solid"
          colorScheme="blue"
        >
          Sign up with Zoom
        </Button>
      </Flex>
      <Box marginTop="25px">
        Already have an account?{" "}
        <Button
          as={Link}
          href={redirect ? `/login?redirect=${redirect}` : "/login"}
          variant="link"
        >
          log in
        </Button>{" "}
        instead.
      </Box>
    </Box>
  );
};
