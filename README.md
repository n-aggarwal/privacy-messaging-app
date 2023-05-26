# privacy-messaging-app

This repository contains the code for the final project developed for COMP360: Information Security and Privacy.

## Overview

The privacy messaging app is developed using expo go, on the react-native platform. It is meant to increase security, and privacy
of the users and allow them to communicate with friends, family, and others without any worries! Right now, the app is under development and all the features have not been implemented. As such, please keep in mind that there will be bugs; feel free to open an issue if you find one!

The app is deployed! [privacy-messaging-app](https://expo.dev/@nishant-aggarwal/messaging-app?serviceType=classic&distribution=expo-go); to run this you would need to download the expo go app on your phone from Play Store and then 
scan the QR code on website using the app or your phone camera. Hope you enjoy it!

Additionally, we developed a [presentation](https://docs.google.com/presentation/d/1PkJLAopBvjOEjUAWPg7yRgU5Mszu3NIFK7UC6lcQgLY/edit#slide=id.g23f5c5068e8_0_0) to show all the features! Feel free to take a look and reach out if you have any questions!

## Features

This app contains many features. The most important ones are listed below:

- Anti-Screenshot Functionality (Android Only)
- End-to-End Encryption
- Sequence Message deletion
- Password Security (client + server)
- 2 Factor Authentication
- API Security

## Additional Concepts Explored

The following are some ideas that we explored, but weren't able to implement becasuse of various reasons including lack of time and rescoures. A Proof of Concept for some of these will be included soon:

- [Proof of Concept: Blocking photos of screen from another phone](https://docs.google.com/document/d/11bllD5yo5ETtA3gXsbrViu7OMJcCoAETbMNjOK-iCeM/edit)
- Anti-Screenshot Functionality (IOS)
  - Here is a link to solution devlepoed by a company- [ScreenShieldKit](https://screenshieldkit.com).
- Cross-device Sync (In progress) (Using WebRTC)
  - Implementation will be along the lines of how google verfies its "you" be sending a prompt on one of your devices, when you try to log in from a new device. This is being worked on in issue 30 and its associated branch.

# Setting up the Enviornment

Before we begin with the setup, I would like to note that the code in the main branch only works for Android. If you want to run this app on IOS or the web, please switch to the `IOS-build` branch.

Now to begin with the setup, firstly you would need to download npm on your machine. On Mac, the easiest way to do so would be using Homebrew.

```bash
brew install node
```

Once you have downloaded node, to run your app you will need to download the Expo Go app from the Play store (Android) or the App Store (IPhone). Now your enviornment should be all set!

# Getting Started

To run the app. Run the following commands in your local git clone:

```bash
cd messaging-app
npm install
npx expo start
```

This will start the server. You should see a QR code on your terminal. Scan the QR code with the Expo Go app (Android) or camera (IOS) and the app you are buildng will be displayed on phone! Alternatively, you can use the Android Emulator (requires android studio), IOS simulator, or open the app on the web.

# Additional Resources

https://reactnative.dev <br />
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Language_overview <br />
https://reactnative.dev/docs/environment-setup <br />
https://education.github.com/git-cheat-sheet-education.pdf <br />
