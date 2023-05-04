# privacy-messaging-app

This repository contains the code for the final project developed for COMP360: Information Security and Privacy.

## Overview

The privacy messaging app is developeed using expo go, on the react-native platform. It is meant to increase security, and privacy
of the users and allow them to communicate with friends, family, and others without any worries! Right now, the app is under development and all the features have not been implemented. As such, please keep in mind that there will be bugs; feel free to open an issue if you find one!

## Features

This app contains many features. The most important ones are listed below:

- Anti-Screenshot Functionality (Android Only)
- Sequence Message deletion
- Password Security (client + server)
- End-to-End Encryption (in progress)
- API Security (in progess)

## Additional Concepts Explored

The following are some ideas that we explored, but weren't able to implement becasuse of various reasons including lack of time and rescoures. A Proof of Concept for each of these will be included soon:

- Anti-Screenshot Functionality (IOS)
- Blocking photos of screen from other phone

# Setting up the Enviornment

First you would need to download npm on your machine. On Mac the easiest way to do so would be using Homebrew.

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

# Rescources

https://reactnative.dev <br />
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Language_overview <br />
https://reactnative.dev/docs/environment-setup <br />
https://education.github.com/git-cheat-sheet-education.pdf <br />
