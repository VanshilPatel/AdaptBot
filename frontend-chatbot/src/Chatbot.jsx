

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Minimize2, MapPin } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const CHATBOT_BACKEND_URL = import.meta.env.CHATBOT_BACKEND_URL

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your medical assistant. How can I help you today?", isBot: true },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    console.log(messages);
  }, [messages]);

  const parseHospitals = (text) => {
    const hospitalList = [];
    const regex = /\* \*\*(.*?)\*\* \(Rating: (\d\.\d)\) - ([\d\.]+) (meters|kilometers|kilometer|km|m) /g;
    

    let match;
    
    while ((match = regex.exec(text)) !== null) {
      hospitalList.push({
        name: match[1],
        rating: parseFloat(match[2]),
        distance: parseFloat(match[3])
      });
    }
    
    return hospitalList;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setInputValue("");
    setIsLoading(true);

    setMessages(prev => [...prev, { text: "...", isBot: true, isTyping: true }]);

    try {
      const response = await fetch(`${CHATBOT_BACKEND_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log("data",data);
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      
      if (data.isLocation) {
        const locationInfo = parseHospitals(data.response);
        console.log(data.response)
        console.log("location info -> ", locationInfo)
        setMessages(prev => [...prev, { 
          text: "Here are some locations:", 
          isBot: true, 
          locations: locationInfo
        }]);
      } else {
        // console.log()
        setMessages(prev => [...prev, { 
          text: <ReactMarkdown>{data.response}</ReactMarkdown>, 
          isBot: true
        }]);
      }
    } catch (error) {
      console.error('Error getting response:', error);
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      setMessages(prev => [...prev, { 
        text: "I apologize, but I encountered an error. Please try again.", 
        isBot: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#3498db] text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-96 h-[550px] flex flex-col border border-gray-200">
          <div className="bg-[#3498db] text-white px-6 py-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
            <h3 className="font-semibold text-lg">Medical Assistant</h3>
            <div className="flex gap-2">
              <button onClick={() => setIsOpen(false)} className="hover:bg-indigo-700 p-1 rounded transition-colors">
                <Minimize2 className="w-4 h-4" />
              </button>
              <button onClick={() => setIsOpen(false)} className="hover:bg-indigo-700 p-1 rounded transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div key={index}>
                <div className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} w-full`}>
                  <div className={`max-w-[75%] break-words whitespace-pre-wrap p-3 rounded-2xl ${message.isBot ? 'bg-white text-gray-800 shadow-sm border border-gray-100' : 'bg-[#3498db] text-white shadow-md'}`}>
                    <p className="text-sm leading-relaxed">
                      {message.isTyping ? <span className="animate-pulse">...</span> : message.text}
                    </p>
                  </div>
                </div>
                {message.locations && message.locations.length > 0 && (
                  <div className="mt-2 overflow-x-auto">
                    <div className="flex space-x-2 p-2">
                      {message.locations.map((location, idx) => (
                        <div 
                          key={idx}
                          onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.name)}`, '_blank')}
                          className="flex-shrink-0 w-48 p-3 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow m-2 border border-gray-200"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-red-500" />
                            <span className="font-medium text-sm truncate">{location.name}</span>
                          </div>
                          <p className="text-xs text-gray-600">Rating: {location.rating}</p>
                          <p className="text-xs text-gray-600">Distance: {location.distance} meters</p>
                          <button className="text-xs text-blue-500 hover:text-blue-700">
                            View on Maps →
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex-shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3498db] text-sm bg-gray-50"
                disabled={isLoading}
              />
              <button
                type="submit"
                className={`bg-[#3498db] text-white p-3 rounded-xl hover:bg-indigo-700 transition-colors duration-200 flex-shrink-0 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
