import { useState, useEffect } from "react";
import axios from "axios";
import Button from '@mui/material/Button';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './Chatbot.css';
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
    MainContainer,
    ChatContainer,
    MessageList,
    MessageInput,
    TypingIndicator,
    Avatar,
    ConversationHeader
} from "@chatscope/chat-ui-kit-react";
import Bucksbuddylogo from '../../images/Bucksbuddylogo.jpg';


export default function Chatbot({ onBackClick, pid }) {
    const [thread_id, setThread_id] = useState(localStorage.getItem('thread_id') || null);
    const [isChatbotTyping, setIsChatbotTyping] = useState(false);
    const [chatMessages, setChatMessages] = useState(JSON.parse(localStorage.getItem('chatMessages')) || []);

    useEffect(() => {
        const storedPid = localStorage.getItem('pid');
        if (storedPid && pid !== storedPid) {
            setThread_id(null);
            setChatMessages([]);
            localStorage.removeItem('thread_id');
            localStorage.removeItem('chatMessages');
        }
        localStorage.setItem('pid', pid);
    }, [pid]);

    useEffect(() => {
        // Save thread_id and chatMessages to localStorage whenever they change
        localStorage.setItem('thread_id', thread_id);
        localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
    }, [thread_id, chatMessages]);

    function CustomMessage({ message }) {
        return (
            <div className={message.sender === "ChatGPT" ? "message left" : "message right"}>
                {message.sender === "ChatGPT" ? (
                    <Avatar src={Bucksbuddylogo} name="BucksBuddy" />
                ) : null}
                <Markdown className="markdown" remarkPlugins={[remarkGfm]}>{message.message}</Markdown>
            </div>
        );
    }

    const startNewConversation = () => {
        setIsChatbotTyping(true);
        axios.post('http://localhost:8000/api/new')
            .then(response => {
                setThread_id(response.data.messages[0].thread_id);
                const newChatMessage = {
                    message: response.data.messages[0].content,
                    sender: "ChatGPT",
                    direction: "incoming",
                    position: "single",
                };
                setChatMessages([newChatMessage]);
                setIsChatbotTyping(false);
            })
            .catch(error => {
                console.error("Can't start chatbot session: " + error);
            });
    }

    const uploadFile = async () => {
        try {
            const response = await axios.post(`http://localhost:8000/api/uploadfile/${pid}`);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const deleteFile = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/deletefile');
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    // When User Clicks on New Chat Button
    const startConvo = async () => {
        try {
            // Reset state variables
            setThread_id(null);
            setChatMessages([]);

            startNewConversation();  //Create New Thread and Run
            await deleteFile(); //Delete any portfolio files
            await uploadFile(); //Upload New Portfolio File
        } catch (error) {
            console.error(error);
        }
    };

    // Function to handle user messages
    const handleUserMessage = async (userMessage) => {

        // If there is no thread_id, do nothing
        if (!thread_id){
            return;
        }

        // Create a new user message object
        const newUserMessage = {
            message: userMessage,
            sender: "user",
            direction: "outgoing",
            position: "single"
        };

        // Update chat messages state with the new user message
        setChatMessages(prevChatMessages => [...prevChatMessages, newUserMessage]);

        // Set the typing indicator for the chatbot
        setIsChatbotTyping(true);

        // Process user message with ChatGPT
        await processUserMessageToChatGPT(newUserMessage);
    };

    async function processUserMessageToChatGPT(newUserMessage) {
        // Set a timeout to turn off the typing indicator and display an error message after 30 seconds
        const timeoutId = setTimeout(() => {
            setIsChatbotTyping(false);
            const newChatMessage = {
                message: "Sorry, I'm having trouble processing your message. Please start a new chat.",
                sender: "ChatGPT",
                direction: "incoming",
            };
            setChatMessages(prevChatMessages => [...prevChatMessages, newChatMessage]);
        }, 60000);

        axios.post(`http://localhost:8000/api/chat/${thread_id}`, {
            content: newUserMessage.message,
        })
            .then(response => {
                clearTimeout(timeoutId);
                const newChatMessage = {
                    message: response.data.messages[0].content,
                    sender: "ChatGPT",
                    direction: "incoming",
                };
                setChatMessages(prevChatMessages => [...prevChatMessages, newChatMessage]);
                setIsChatbotTyping(false);
            })
            .catch(error => {
                clearTimeout(timeoutId);
                const newChatMessage = {
                    message: "Sorry, I'm having trouble processing your message. Please start a new chat.",
                    sender: "ChatGPT",
                    direction: "incoming",
                };
                setChatMessages(prevChatMessages => [...prevChatMessages, newChatMessage]);
                console.error("Can't process user message: " + error);
            });
    }

    return (
        <>
            {/* A container for the chat window */}
            <div style={{ position: "relative", height: "88vh", width: "28vw", boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)' }}>
                <MainContainer>
                    <ChatContainer>
                        <ConversationHeader>
                            <ConversationHeader.Back onClick={onBackClick} />
                            <Avatar src={Bucksbuddylogo} name="BucksBuddy" />
                            <ConversationHeader.Content userName="BucksBuddy" />
                        </ConversationHeader>

                        {/* Display chat messages and typing indicator */}
                        <MessageList
                            typingIndicator={
                                isChatbotTyping ? (
                                    <TypingIndicator content="BucksBuddy is thinking" />
                                ) : null
                            }
                        >
                            {/* Map through chat messages and render each message */}
                            {chatMessages.map((message, i) => {
                                return (
                                    <CustomMessage
                                        key={i}
                                        message={message}
                                    />
                                );
                            })}
                        </MessageList>
                        {/* Input field for the user to type messages */}
                        <MessageInput
                            attachButton={false}
                            placeholder="Type Message here"
                            onSend={handleUserMessage}
                        />
                    </ChatContainer>
                </MainContainer>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={startConvo}
                    sx={{
                        position: 'absolute',
                        top: '16px',
                        right: '20px',
                        zIndex: 1,
                        textTransform: 'none',
                    }}
                >
                    New Chat
                </Button>
            </div>
        </>
    );
}

