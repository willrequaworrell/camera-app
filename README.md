# Identifi.ai 📸🤖
## Overview
Identifi.ai is a React Native mobile app that captures photos and provides instant AI-generated descriptions using Google's Gemini Vision API. Point, shoot, and discover what AI sees in your world.

## Getting Started
Prerequisites
iOS device (physical device required - camera doesn't work in simulators)

macOS with Xcode installed

Node.js 18+ and npm/yarn

Expo CLI installed globally

Google AI Studio API key (free tier available)

Setup Instructions
Clone and Install Dependencies

```
git clone https://github.com/yourusername/identifi-ai.git
cd identifi-ai
npm install
Install Native Dependencies

```
## Install Expo-managed packages
npx expo install react-native-vision-camera expo-file-system expo-dev-client

## Install JavaScript dependencies  
npm install react-native-dotenv
Configure Environment Variables
Create a .env file in the project root:

```
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
Get your Gemini API key from Google AI Studio.

iOS Setup & Permissions

```
## Generate native iOS project
npx expo prebuild

## Install iOS dependencies
cd ios && pod install && cd ..
Run the Application

```
## Build and run on connected iOS device
npx expo run:ios --device
⚠️ Important: You must use a physical iOS device - camera functionality does not work in simulators.

## Testing
Tests use React Native Testing Library and Jest:

```
npm test
As someone new to React Native testing, I utilized AI to generate test cases and testing code, which I then adapted and tweaked for my specific use cases. The tests likely need more comprehensive coverage and enhancement in the future.

## Challenges Faced
Camera Configuration: Configuring react-native-vision-camera to work properly and suit my app's specific needs was one of the biggest challenges. It required extensive research into camera parameters, settings, and tweaking various configurations to get the desired behavior.

React Native Testing: Not being deeply familiar with testing in React Native, I utilized AI to generate test cases and testing code, which I then adapted for my use cases. The testing approach needs expansion and refinement.

Permission Flow Management: Handling async permission requests and ensuring the UI state correctly reflects permission status required careful state management.

Platform Limitations: Limited to iOS testing due to device availability, leaving Android compatibility untested.

## Future Enhancements
Expand testing suite with better coverage

Improve UI/UX and enhance accessibility

Add Android support with device testing

Implement photo gallery integration
