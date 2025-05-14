# Athlete Genesis Health App Bridge

A React Native mobile application that serves as a bridge between native health apps (Apple Health, Samsung Health, Google Fit) and the Athlete Genesis AI web application.

## Features

- Connect to Apple HealthKit on iOS
- Connect to Health Connect API on Android
- Scan QR codes to connect with the web application
- Sync health data in the background
- Add workouts to health apps

## Getting Started

### Prerequisites

- Node.js 16+
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/athlete-genesis-ai/health-app-bridge.git
   cd health-app-bridge
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. iOS-specific setup:
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Run the app:
   ```bash
   # For iOS
   npm run ios
   
   # For Android
   npm run android
   ```

## Project Structure

```
mobile-app-bridge/
├── android/                # Android project files
├── ios/                    # iOS project files
├── src/
│   ├── api/                # API services
│   │   └── sync-service.ts # Service for syncing with web app
│   ├── components/         # React Native components
│   │   ├── QRScanner.tsx   # QR code scanner component
│   │   └── ...
│   ├── health/             # Health app integration
│   │   ├── apple-health.ts # Apple HealthKit integration
│   │   ├── health-connect.ts # Health Connect API integration
│   │   └── index.ts        # Common health interface
│   ├── navigation/         # Navigation components
│   │   └── ...
│   ├── screens/            # App screens
│   │   ├── HomeScreen.tsx  # Main screen
│   │   ├── ConnectScreen.tsx # QR code scanner screen
│   │   └── ...
│   ├── types/              # TypeScript type definitions
│   │   └── ...
│   ├── utils/              # Utility functions
│   │   └── ...
│   └── App.tsx             # Main app component
├── .gitignore
├── app.json
├── babel.config.js
├── index.js                # Entry point
├── metro.config.js
├── package.json
├── tsconfig.json
└── README.md
```

## Health App Integration

### Apple HealthKit (iOS)

The app uses the `react-native-health` package to integrate with Apple HealthKit. It requests permissions to access health data and provides methods for reading and writing health data.

### Health Connect API (Android)

The app uses the `@kingstinct/react-native-health-connect` package to integrate with the Health Connect API on Android. It provides a similar interface to the Apple HealthKit integration.

## QR Code Scanning

The app uses the `react-native-camera` package to scan QR codes. When a valid QR code is scanned, the app extracts the connection code and establishes a connection with the web application.

## Data Synchronization

The app syncs health data with the web application in the background. It uses a combination of:

- Background fetch to periodically sync data
- Push notifications to trigger immediate sync
- Manual sync when the app is opened

## Security

- All health data is encrypted during transfer
- Connection codes are verified with the web application
- Users can revoke access at any time

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React Native](https://reactnative.dev/)
- [react-native-health](https://github.com/agencyenterprise/react-native-health)
- [react-native-health-connect](https://github.com/matinzd/react-native-health-connect)
- [react-native-camera](https://github.com/react-native-camera/react-native-camera)
