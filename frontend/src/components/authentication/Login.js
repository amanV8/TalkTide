import React, { useState } from 'react'
import { VStack } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Button,Text } from "@chakra-ui/react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();

  const handlePasswordClick = () => setShowPassword(!showPassword);

  const submitHandler = () => { };

  return (
      <VStack spacing='5px'>
     <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder='Enter Your Email'
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder='Enter Your Password'
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" bg="transparent" onClick={handlePasswordClick} borderRadius="md">
              <Text color="BlackAlpha 900">{showPassword ? "Hide" : "Show"}</Text>
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme='blue'
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
      >
        Login
      </Button>

      <Button
        colorScheme='red'
        width="100%"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("12345");
        }}
      >
       Get Guest User Credentials
      </Button>
      
    </VStack>
  )
};

export default Login;