import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSendMessage = async () => {
  if (input.trim() === '') return;

  const userMessage = { text: input, sender: 'user' };
  setMessages((currentMessages) => [...currentMessages, userMessage]);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: input }),
    });

    if (response.ok) {
      const { botMessage } = await response.json(); // Corrected from response: botMessage to botMessage
      const botResponse = { text: botMessage, sender: 'bot' };
      setMessages((currentMessages) => [...currentMessages, botResponse]);
    } else {
      // You can update the state to show the error message or log it.
      console.error('Failed to send message to the API');
    }
  } catch (error) {
    // Handle errors from the fetch call
    console.error('Fetch error: ', error);
  }

  setInput(''); // Reset the input only once
};


  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        placeholder="Type your message here..."
      />
      <button onClick={handleSendMessage}>Send</button>
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Courier New', Courier, monospace;
        }
        .chat-container {
          background-color: black;
          color: orange;
          height: 100vh;
          padding: 20px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }
        .messages {
          flex-grow: 1;
          overflow-y: auto;
        }
        .message {
          margin-bottom: 10px;
          border-radius: 5px;
          padding: 5px;
          max-width: 80%;
        }
        .message.user {
          align-self: flex-end;
          background-color: darkorange;
        }
        .message.bot {
          align-self: flex-start;
          background-color: darkgrey;
        }
        input {
          flex-shrink: 0;
          padding: 10px;
          font-size: 16px;
          margin-top: 10px;
          border: none;
          border-radius: 5px;
        }
        button {
          flex-shrink: 0;
          padding: 10px 20px;
          margin-top: 5px;
          cursor: pointer;
          border: none;
          border-radius: 5px;
          background-color: darkorange;
          color: black;
        }
      `}</style>
    </div>
  );
}
