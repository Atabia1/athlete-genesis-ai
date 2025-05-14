# Health App Integration for Athlete Genesis AI

This document provides a comprehensive guide to the health app integration in the Athlete Genesis AI application.

## Overview

The health app integration enables users to connect their mobile health apps (Apple Health, Samsung Health, Google Fit) to the Athlete Genesis AI application. This allows for automatic import of health metrics, workout data, and other health-related information.

## Architecture

The integration consists of two main components:

1. **Web Application Components**: UI components and services in the Athlete Genesis AI web application that handle health data display and synchronization.

2. **Mobile App Bridge**: A separate React Native mobile application that acts as a bridge between the native health apps and the web application.

## Web Application Components

### Health Data Types

The health data types are defined in `src/integrations/health-apps/types.ts` and include:

- `HealthData`: Main interface for health metrics (steps, heart rate, sleep, etc.)
- `HealthWorkout`: Interface for workout data
- `HealthAppProvider`: Interface for health app providers
- `HealthAppConnection`: Interface for connection status

### Health Sync Service

The health sync service (`src/services/health-sync-service.ts`) handles:

- Saving health data to IndexedDB
- Retrieving health data from IndexedDB or server
- Generating connection QR codes
- Verifying connection codes

### UI Components

- `HealthAppConnect`: Component for connecting to health apps via QR code
- `HealthDataDisplay`: Component for displaying health data on the dashboard
- Integration with `HealthAssessment` page for importing health data during onboarding

## Mobile App Bridge

The mobile app bridge is a separate React Native application that:

1. Accesses native health APIs (Apple HealthKit, Health Connect API, Google Fit API)
2. Syncs data with the web application
3. Provides a QR code scanner for connection

### Health App Providers

The mobile app bridge supports the following health app providers:

1. **Apple HealthKit** (iOS): Provides access to health data on iOS devices through the `react-native-health` package.
2. **Health Connect API** (Android): Provides access to health data from multiple sources on Android devices, including Samsung Health, through the `@kingstinct/react-native-health-connect` package.
3. **Google Fit** (Android): Provides direct access to Google Fit data on Android devices through the `react-native-google-fit` package.

### Setting Up the Mobile App Bridge

#### Prerequisites

- Node.js 16+
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)

#### Installation

1. Clone the mobile app bridge repository:

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

4. Configure health app permissions:

   - For iOS: Edit `ios/HealthAppBridge/Info.plist` to include HealthKit permissions
   - For Android:
     - Edit `android/app/src/main/AndroidManifest.xml` to include Health Connect permissions
     - For Google Fit integration, you need to:
       1. Create a project in the Google Developer Console
       2. Enable the Fitness API
       3. Create OAuth 2.0 credentials
       4. Configure the OAuth consent screen
       5. Add the credentials to your app's `android/app/src/main/res/values/strings.xml`

5. Start the development server:

   ```bash
   npm start
   ```

6. Run the app:

   ```bash
   # For iOS
   npm run ios

   # For Android
   npm run android
   ```

### Mobile App Features

- QR code scanner for connecting to the web application
- Background health data sync
- Workout sync between the web app and health apps
- Notification system for sync status

## Integration Flow

1. **Connection**:

   - User clicks "Connect Health App" in the web application
   - Web app generates a unique connection code and displays it as a QR code
   - User scans the QR code with the mobile app bridge
   - Mobile app verifies the connection code with the web app

2. **Health Data Import**:

   - Mobile app requests permissions to access health data
   - Mobile app retrieves health data from the native health app
   - Mobile app sends health data to the web app
   - Web app stores health data in IndexedDB and syncs with server

3. **Workout Sync**:
   - Web app creates workouts that can be synced to health apps
   - Mobile app receives workout sync requests
   - Mobile app adds workouts to the native health app

## Security Considerations

- Connection codes expire after 15 minutes
- Health data is encrypted during transfer
- Users can revoke access at any time
- Only requested health metrics are accessed

## Privacy Considerations

- Clear user consent is required before accessing health data
- Health data is stored locally and only shared with the server with user permission
- Users can delete all health data from the web application

## Future Enhancements

- Real-time sync using WebSockets
- Support for more health metrics
- Integration with more health apps
- Advanced health analytics
- Wearable device integration

## Troubleshooting

### Common Issues

1. **Connection Issues**:

   - Ensure both devices are on the same network
   - Check that the QR code is clearly visible
   - Verify that the mobile app has internet access

2. **Permission Issues**:

   - Make sure health app permissions are granted
   - Check that the mobile app has background refresh enabled

3. **Sync Issues**:

   - Verify that the health app contains data
   - Check that the mobile app is running in the background
   - Ensure the web app is logged in with the same account

4. **Google Fit Specific Issues**:
   - Ensure Google Play Services is up to date
   - Verify that Google Fit app is installed and set up
   - Check that OAuth credentials are correctly configured
   - Make sure the user has granted all required permissions

### Support

For issues with the health app integration, please contact support at support@athletegenesis.ai or open an issue on the GitHub repository.

## Contributing

Contributions to the health app integration are welcome! Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines.

## License

The health app integration is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
