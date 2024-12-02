import React, { useEffect } from 'react';

const ChatlingBot = ({ chatbotId }) => {
  useEffect(() => {
    // Set the global configuration
    window.chtlConfig = { chatbotId: chatbotId };

    // Create script element
    const script = document.createElement('script');
    script.id = 'chatling-embed-script';
    script.src = 'https://chatling.ai/js/embed.js';
    script.async = true;
    script.setAttribute('data-id', chatbotId);

    // Append script to the document
    document.body.appendChild(script);

    // Cleanup function to remove the script when component unmounts
    return () => {
      const existingScript = document.getElementById('chatling-embed-script');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, [chatbotId]);

  return null; // This component doesn't render anything visible
};

export default ChatlingBot;
