import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
} from "@chatscope/chat-ui-kit-react";
import { useEffect, useState } from "react";
import socket from "../socket";

export default function MessageBox() {
    var message = ""

    useEffect(() => {
        socket.on("message:sent", message);

        return () => {
            socket.off("message:sent");
        };
    }, []);
    const handleClick = () => {
        if (message) {
            socket.emit("message:sent", message);
            setMessage("");
        }
    };

    return (
        <div className="message-box">
            <MainContainer>
                <ChatContainer className="chat-container">
                    <MessageList className="message-list">
                        <Message
                            className="message"
                            model={{
                                message: "Hello my friend",
                                sentTime: "just now",
                                sender: "Joe",
                            }}
                        />
                    </MessageList>
                    <MessageInput
                        style={{ color: "black" }}
                        className="message-input"
                        placeholder="Type message here"
                        value={message}
                        onChange={(e) => {
                            const newValue = e.target.value; // Make sure e.target is defined
                            message=newValue;
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleClick();
                            }
                        }}
                    />
                    <button className="cs-button cs-button--send" onClick={handleClick}>
                        Send
                    </button>
                </ChatContainer>
            </MainContainer>
        </div>
    );
}
