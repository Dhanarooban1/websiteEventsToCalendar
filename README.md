# 📅 Automated Calendar Integration System

An intelligent browser extension that seamlessly extracts event information from web pages and automatically adds them to your Google Calendar. Say goodbye to manual event creation and never miss important events again!
Video - https://drive.google.com/file/d/1grYg2Jgku8il5WaZ0QirM_fCc6igj2K8/view

## ✨ Features

### 🤖 AI-Powered Event Extraction
- **Smart Text Analysis**: Uses Google's Gemini AI to intelligently extract event details from selected text
- **Natural Language Processing**: Understands various date/time formats and event descriptions
- **Automatic Data Parsing**: Converts extracted information into structured event data

### 📋 Multi-Step Event Form
- **Intuitive 3-Step Process**: 
  - Step 1: Event basics (name, date, priority, color)
  - Step 2: Time details and description
  - Step 3: Location and notification preferences
- **Smart Data Pre-filling**: Automatically populates form fields with extracted information
- **Real-time Validation**: Ensures all required fields are completed

### 🎨 Visual Customization
- **Google Calendar Colors**: Choose from 11 official Google Calendar color options
- **Color Preview**: Visual color picker with hover effects and selection indicators
- **Priority Settings**: Set event importance levels (Low, Medium, High)

### 🔗 Seamless Google Calendar Integration
- **OAuth Authentication**: Secure Google account authorization
- **Direct Calendar API**: Creates events directly in your primary Google Calendar
- **Timezone Awareness**: Automatically detects and applies your local timezone
- **Smart Reminders**: Configurable notification settings (15min to 1 day before)

### ⚡ Chrome Extension Features
- **Keyboard Shortcuts**: Quick event extraction using keyboard commands
- **Background Processing**: Efficient background script for text processing
- **Persistent Storage**: Form data persistence across sessions
- **Real-time Sync**: Instant updates between content script and popup

## 🚀 Installation

### Prerequisites
- Google Chrome browser
- Google account for Calendar integration
- Gemini API key from Google AI Studio

### Setup Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/calendar-integration-system.git
   cd calendar-integration-system
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Get Your Gemini API Key**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API key
   - Keep it secure for the next step

4. **Build the Extension**
   ```bash
   npm run build
   ```

5. **Load Extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (top right toggle)
   - Click "Load unpacked" and select the `dist` folder
   - The extension icon should appear in your toolbar

6. **Configure API Settings**
   - Click the extension icon to open the popup
   - Enter your Gemini API key in the settings modal
   - The key is stored locally and never shared

## 🎯 How to Use

### Method 1: Text Selection + Extraction
1. **Select Event Text**: Highlight any text on a webpage containing event information
2. **Extract Information**: Click "Extract Info" button in the extension popup
3. **Review & Edit**: Check the auto-filled form fields and make any necessary adjustments
4. **Save to Calendar**: Complete the 3-step form and click "Save to Calendar"

### Method 2: Manual Entry
1. **Open Extension**: Click the extension icon in your toolbar
2. **Fill Form**: Manually enter event details across the 3 steps
3. **Customize**: Choose colors, set priorities, and configure notifications
4. **Save**: Click "Save to Calendar" to create the event

### Method 3: Keyboard Shortcuts
- **Extract Data**: Use the configured keyboard shortcut for quick extraction
- **Save Event**: Use the save shortcut to quickly save extracted data

## 🛠️ Technical Architecture

### Frontend Components
- **React 18**: Modern React with hooks for state management
- **Tailwind CSS**: Utility-first styling for responsive design
- **Lucide React**: Clean, consistent iconography
- **Chrome Extensions API**: Native browser integration

### AI Integration
- **Google Gemini AI**: Advanced natural language processing
- **JSON Response Parsing**: Structured data extraction
- **Error Handling**: Robust fallback mechanisms

### Calendar Integration
- **Google Calendar API v3**: Direct calendar manipulation
- **OAuth 2.0**: Secure authentication flow
- **Timezone Management**: Automatic timezone detection and conversion

### Data Flow
```
Web Page Text → AI Extraction → Form Population → Google Calendar
     ↓              ↓              ↓              ↓
User Selection → Gemini API → React State → Calendar API
```

## 📁 Project Structure

```
src/
├── components/
│   ├── EventForm.jsx          # Main form component with 3-step wizard
│   ├── ApiSetting.jsx         # API key configuration modal
│   └── googleColors.jsx       # Color picker component
├── services/
│   ├── background.js          # Chrome extension background script
│   ├── content.js             # Content script for web page interaction
│   └── oauth.js               # Google OAuth and Calendar API integration
├── App.jsx                    # Root application component
├── main.jsx                   # React application entry point
└── index.css                  # Global styles and Tailwind imports
```

## 🔧 Configuration Options

### Event Customization
- **Colors**: 11 Google Calendar color options
- **Priorities**: Low, Medium, High priority levels
- **Reminders**: No reminder, 15min, 30min, 1hr, 1 day before
- **Locations**: Physical addresses or virtual meeting links

### AI Extraction Settings
- **Model**: Google Gemini 2.0 Flash for optimal performance
- **Response Format**: Structured JSON parsing
- **Error Handling**: Graceful fallbacks for parsing failures

## 🔒 Privacy & Security

- **Local Storage**: API keys stored locally in Chrome sync storage
- **No Data Collection**: No personal data sent to external servers
- **Secure Authentication**: OAuth 2.0 flow for Google account access
- **Minimal Permissions**: Only necessary Chrome extension permissions

## 🐛 Troubleshooting

### Common Issues

**"No text selected" Error**
- Ensure you've highlighted text on the webpage before clicking "Extract Info"
- Try refreshing the page and selecting text again

**API Key Errors**
- Verify your Gemini API key is correct and active
- Check that the API key has the necessary permissions
- Try regenerating the API key from Google AI Studio

**Calendar Creation Failures**
- Ensure you've granted calendar permissions during OAuth
- Check that your Google account has Calendar access
- Verify your internet connection

**Extension Not Loading**
- Make sure you've built the project (`npm run build`)
- Check that Developer mode is enabled in Chrome extensions
- Try reloading the extension

### Debug Mode
Enable Chrome Developer Tools console to see detailed error messages and API responses.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google AI Studio** for providing the Gemini API
- **Google Calendar API** for seamless calendar integration
- **Chrome Extensions API** for browser integration capabilities
- **React Team** for the excellent development framework
- **Tailwind CSS** for the utility-first styling approach

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**Made with ❤️ for seamless event management**
