import { GoogleGenerativeAI } from "@google/generative-ai";


chrome.commands.onCommand.addListener(async (command) => {

  
  if (command === "extract-data") {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return;
    chrome.runtime.sendMessage({ action: "extraction-Data" });
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: displaySelectedText,
      });
    } catch (err) {
      console.error("Failed to execute script:", err);
    }
  }
  
  if (command === "save-event") {
  
    chrome.storage.local.get(['geminiExtractedData'], (result) => {
      if (result.geminiExtractedData) {
       
      } else {
        console.error('No event data to save');
      }
    });
  }
});




function executeDisplaySelectedText() {
  chrome.windows.getLastFocused({ populate: true }, (window) => {
    const activeTab = window.tabs.find(
      (tab) => tab.active && !tab.url.startsWith("chrome-extension://")
    );

    if (!activeTab || !activeTab.id) {
      console.error("No valid active tab found. Retrying in 1 second...");
      setTimeout(executeDisplaySelectedText, 1000);
      return;
    }

    

    // First, ensure the page is fully loaded
    chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      function: () =>
        new Promise((resolve) => {
          if (document.readyState === "complete") {
            resolve();
          } else {
            window.addEventListener("load", resolve, { once: true });
          }
        }),
    }, () => {
      // Now, run your displaySelectedText function on the active tab
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        function: displaySelectedText,
      }, (results) => {
        if (chrome.runtime.lastError) {
          console.error("Error executing script:", chrome.runtime.lastError.message);
        } else {
          console.log("Script executed successfully:", results);
        }
      });
    });
  });
}




chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "display-selected-text") {
    executeDisplaySelectedText();
    sendResponse({ success: true });
    return false;
  }
});

function displaySelectedText() {
  const selectedText = window.getSelection().toString().trim();
  if (!selectedText) {
    alert("No text selected! Please select some text and try again.");
    return;
  }

  chrome.runtime.sendMessage({
    action: "processText",
    text: selectedText,
  });
}


// Commands displaytext -  process text - google gemini
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "processText") {
    executePrompt(message.text)
      .then((responseText) => {
        console.log("Gemini Response:", responseText);

        try {
          let parsedResponse = JSON.parse(responseText);

          // Ensure all required keys exist
          const eventDetails = {
            eventName: parsedResponse.eventName || null,
            description: parsedResponse.description || null,
            date: parsedResponse.date || null,
            startTime: parsedResponse.startTime || null,
            endTime: parsedResponse.endTime || null,
            location: parsedResponse.location || null,
            virtualLink: parsedResponse.virtualLink || null
          };

          chrome.storage.local.set({ geminiExtractedData: eventDetails }, () => {
            sendResponse({ success: true, responseText: eventDetails });
          });

        } catch (error) {
          console.error("Error parsing JSON:", error);
          sendResponse({ success: false, error: "Invalid JSON format from API" });
        }
      })
      .catch((error) => {
        console.error("Error processing text:", error);
        sendResponse({ success: false, error: error.message });
      });

    return true; // Required for asynchronous sendResponse
  }
  return false;
});

async function executePrompt(text) {
  const prompt = `Extract event details from the provided text: "${text}". 
Return only a JSON object exactly in the following format without any additional text or explanation:

{
  "eventName": "<event name or null>",
  "description": "<description or null>",
  "date": "<date or null>",
  "startTime": "<start time or null>",
  "endTime": "<end time or null>",
  "location": "<location or null>",
  "virtualLink": "<virtual link or null>"
}

Rules:
- If any piece of information is missing, set its value to null.
- Do not include any extra text, comments, or markdown formatting.
- Even if the text does not contain any event-related information, return the JSON with all values set to null.`;

  async function getGeminiResponse(content) {
    const API_KEY = "AIzaSyCIPzkqueMwaIJoHAlYh1XNpHTXoT6l02A";
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    try {
      const result = await model.generateContent(content);
      let responseText = await result.response.text();

      // Extract JSON using regex to remove extra text
      const jsonMatch = responseText.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        return jsonMatch[0]; // Return clean JSON
      } else {
        throw new Error("Response did not contain valid JSON.");
      }
    } catch (error) {
      console.error("Error generating response:", error);
      return JSON.stringify({ error: "Failed to extract JSON" });
    }
  }

  return await getGeminiResponse(prompt);
}

