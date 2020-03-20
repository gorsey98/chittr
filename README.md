# Chittr Mobile Application Development Project 

For this project, I have developed a front end for the 'Chittr' API using React Native. 

## Features 

- Get Chits
- Post Chits 
- Search Users
- View Single User 
- Follow / Unfollow User
- Take Photo and Upload to Chit 
- Log In / Create Account 
- Edit Profile Details / Change Profile Picture 
- View Followers / Following 
- Log Out 

## Setup 

To run this application in its current form you will need: 
- React Native
- Android Studio with Android Virtual Device 

### Instructions
1. Open /chittr/android folder in Android Studio, wait for project to build, if any errors appear clean project 
2. Start AVD, I have been using Pixel 3 API29 running Android 10.0 w/ Google Play
3. In CMD navigate to /chittr_server_v5 and run ```npm test``` to test server is working 
4. In the same CMD window run ```npm start``` to start the server, it should be listening on port 3333
5. Open a new CMD window and navigate to /chittr 
6. Run the command ```npx react-native run-android```

This should bring you to the home screen of Chittr, you can now navigate and interact with the application as you please.

Enjoy!
