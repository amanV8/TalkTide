import React from 'react'
import { Container, Box, Text, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import Login from '../components/authentication/Login';
import SignUp from '../components/authentication/SignUp';

const Homepage = () => {
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p="3"
        bg="transparent"
        color="white"
        w="100%"
        m="60px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        backdropFilter="blur(10px)"
      >
        <Text
        fontSize="3xl" textAlign='center'
        >TalkTide</Text>
      </Box>
      <Box bg="transparent" p="2" borderRadius="lg" w="100%" borderWidth="1px" backdropFilter="blur(20px)">
        <Tabs variant='soft-rounded'  color="white" d="flex">
  <TabList mb="1em">
    <Tab color="white" width="50%">Login</Tab>
    <Tab color="white" width="50%">Sign Up</Tab>
  </TabList>
  <TabPanels>
              <TabPanel><Login /></TabPanel>
              <TabPanel><SignUp /></TabPanel>
  </TabPanels>
</Tabs>
      </Box>
      </Container>
  )
}

export default Homepage;