import React from 'react';

export const withTailwindTheme = (Story, context) => {
  const theme = context.globals.theme || 'light';
  
  return (
    <div className={`theme-${theme}`} data-theme={theme}>
      <Story />
    </div>
  );
};
