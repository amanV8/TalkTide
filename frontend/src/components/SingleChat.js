import React, { useEffect, useState, useCallback } from 'react'
import { ChatState } from '../Context/ChatProvider';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import './styles.css';
import ScrollableChat from './ScrollableChat';
import animationData from '../animations/typing.json';

import io from "socket.io-client";
import Lottie from 'react-lottie';
const ENDPOINT = "https://talktide-ekli.onrender.com";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRation: "xMidYMid slice",
        },
    };

    const toast = useToast();
    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();

    const fetchMessages = useCallback(async () => {
        if (!selectedChat) return;

        try {
            const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
            };
            
            setLoading(true)

            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);

            setMessages(data);
            setLoading(false);

            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            toast({
                   title: "Error Occurred!",
                   description: "Failed to Load the Message",
                   status: "error",
                   duration: 3000,
                   isClosable: true,
                   position: "bottom",
                });
        }
    }, [selectedChat, user.token, toast]);

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));

        return () => {
            socket.disconnect();
        };
    }, [user]);

    useEffect(() => {
        fetchMessages();

        selectedChatCompare = selectedChat;
    }, [selectedChat, fetchMessages]);

    useEffect(() => {
        socket.on("message received", (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                if (!notification.includes(newMessageReceived)) {
                    setNotification([newMessageReceived, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
            }
        });
    })
    
    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                
                setNewMessage("");
                const { data } = await axios.post(
                    "/api/message",
                    {
                        content: newMessage,
                        chatId: selectedChat._id,
                    },
                    config
                );
         
                socket.emit("new message", data);
                setMessages([...messages, data]);
            } catch (error) {
                toast({
                   title: "Error Occurred!",
                   description: "Failed to Send the Message",
                   status: "error",
                   duration: 3000,
                   isClosable: true,
                   position: "bottom",
                });
            }
        }
    };

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 1000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    return <>{
        selectedChat ? (
            <>
                <Text
                    fontSize={{ base: "28px", md: "30px" }}
                    pb={2}
                    px={2}
                    w="100%"
                    display="flex"
                    justifyContent={{ base: 'space-between' }}
                    alignItems="center"
                >
                    <IconButton
                        display={{ base: "flex", md: "none" }}
                        icon={<ArrowBackIcon />}
                        onClick={() => setSelectedChat("")}
                    />
                    {!selectedChat.isGroupChat ? (
                        <>
                            {getSender(user, selectedChat.users)}
                            <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                        </>
                    ) : (
                            <>{selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    fetchMessages={fetchMessages}
                                />
                            </>
                    )}
                </Text>
                <Box
                    display="flex"
                    flexDir="column"
                    justifyContent="flex-end"
                    p={2}
                    bg="#E8E8E8"
                    w="100%"
                    h="100%"
                    borderRadius="lg"
                    overflowY="hidden"
                >
                    {loading ? (
                        <Spinner 
                            size="xl"
                            alignSelf="center"
                            margin="auto"                         
                        />
                    ) : (
                        <div className="messages">
                             <ScrollableChat messages={messages} />
                        </div>    
                    )}
                    
                    <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                        {isTyping ? <div>
                            <Lottie
                                options={defaultOptions}
                                width={54}
                                style={{ marginBottom: -8, marginLeft: 30, marginTop: -10}}
                            />
                        </div> : <></>}
                        <Input
                            variant="filled"
                            bg="E0E0E0"
                            placeholder='Enter a Message...'
                            onChange={typingHandler}
                            value={newMessage}
                        />
                    </FormControl>
                </Box>
            </>
        ) : (
                <Box display="flex" alignItems="center" justifyContent="center" h="100%" >
                    <Text fontSize="2xl" pb={5} color="grey">
                        Tidal conversations await! Choose a user to start chatting.
                    </Text>
                </Box>
        )
    }</>;
};

export default SingleChat;