import React from 'react';

export const withTailwindTheme = (Story) => {
  return (
    <div className="font-sans antialiased text-gray-900 bg-white min-h-screen p-4">
      <Story />
    </div>
  );
};
