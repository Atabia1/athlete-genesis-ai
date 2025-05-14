# Social Features

This document provides an overview of the social features implemented in the Athlete Genesis AI application.

## Overview

The social features allow users to share their achievements, participate in community challenges, and connect with coaches or trainers. These features enhance user engagement and motivation.

## Components

### Achievement Sharing

The `AchievementSharing` component (`src/components/social/AchievementSharing.tsx`) allows users to share their health and fitness achievements on social media or with their coaches.

```typescript
// Example usage
import AchievementSharing from '@/components/social/AchievementSharing';

function MyComponent() {
  return (
    <AchievementSharing 
      title="10,000 Steps Goal Achieved"
      description="You've reached your daily step goal for 7 consecutive days!"
      date={new Date()}
      data={{
        'Average Steps': '11,234',
        'Total Distance': '8.7 km',
        'Calories Burned': '450 kcal'
      }}
      shareable={true}
    />
  );
}
```

### Community Leaderboard

The `CommunityLeaderboard` component (`src/components/social/CommunityLeaderboard.tsx`) displays a leaderboard of community members based on various health and fitness metrics.

```typescript
// Example usage
import CommunityLeaderboard from '@/components/social/CommunityLeaderboard';

function MyComponent() {
  return (
    <CommunityLeaderboard 
      type="steps"
      period="week"
      maxEntries={5}
      highlightCurrentUser={true}
      showRankChanges={true}
    />
  );
}
```

### Coach Sharing

The `CoachSharing` component (`src/components/social/CoachSharing.tsx`) allows users to share their health data and workouts with their coaches or trainers.

```typescript
// Example usage
import CoachSharing from '@/components/social/CoachSharing';

function MyComponent() {
  return (
    <CoachSharing 
      healthData={healthData}
      hasCoach={true}
    />
  );
}
```

### Community Challenges

The `CommunityChallenge` component (`src/components/social/CommunityChallenge.tsx`) displays a community challenge with progress tracking, leaderboard, and social sharing features.

```typescript
// Example usage
import CommunityChallenge from '@/components/social/CommunityChallenge';

function MyComponent() {
  return (
    <CommunityChallenge 
      id="challenge-1"
      title="10K Steps Challenge"
      description="Complete 10,000 steps every day for a week"
      startDate={new Date('2023-01-01')}
      endDate={new Date('2023-01-07')}
      goal={10000}
      goalUnit="steps"
      progress={8000}
      participantCount={128}
      joined={true}
      type="steps"
      difficulty="intermediate"
      onJoin={handleJoin}
      onLeave={handleLeave}
      onShare={handleShare}
    />
  );
}
```

The `CommunityChallenges` component (`src/components/social/CommunityChallenges.tsx`) displays a list of community challenges with filtering and sorting options.

```typescript
// Example usage
import CommunityChallenges from '@/components/social/CommunityChallenges';

function MyComponent() {
  return (
    <CommunityChallenges 
      initialChallenges={challenges}
      allowCreate={true}
      showFilters={true}
      showSearch={true}
      maxChallenges={10}
      onJoinChallenge={handleJoin}
      onLeaveChallenge={handleLeave}
      onShareChallenge={handleShare}
      onCreateChallenge={handleCreate}
    />
  );
}
```

## Features

### Achievement Sharing

- Share achievements on social media (Twitter, Facebook, Instagram)
- Share achievements with coaches
- Download achievements as images
- Customize sharing options (include image, stats, date)

### Community Leaderboard

- View leaderboards for different metrics (steps, workouts, streak, points)
- Filter by time period (day, week, month, all)
- See rank changes
- Join community challenges

### Coach Sharing

- Connect with coaches
- Share health data with coaches
- Control what data is shared
- Send messages to coaches

### Community Challenges

- Join and leave challenges
- Track progress towards challenge goals
- View challenge leaderboards
- Share challenges with friends
- Create new challenges

## Integration with Health Dashboard

The social features are integrated with the health dashboard to provide a seamless experience. Users can:

1. Share their achievements directly from the dashboard
2. Join challenges related to their health goals
3. Share their health data with coaches for personalized guidance

## Privacy Considerations

- Users have full control over what data is shared
- Clear indication of what data is being shared
- Option to revoke sharing permissions
- No sharing of sensitive health information without explicit consent

## Accessibility

All social components include accessibility features:

- ARIA attributes for screen readers
- Keyboard navigation
- Proper color contrast
- Focus management

## Future Improvements

- Add support for more social media platforms
- Implement direct messaging between users
- Add support for team challenges
- Implement achievement badges and rewards
- Add support for coach feedback and annotations
- Implement privacy settings for achievements and challenges
