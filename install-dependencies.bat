@echo off
echo Installing Storybook dependencies...
echo This may take a few minutes, please be patient.

:: Install core Storybook packages
npm install --save-dev @storybook/react @storybook/addon-essentials @storybook/addon-interactions @storybook/addon-links @storybook/blocks @storybook/react-vite storybook @storybook/testing-library eslint-plugin-storybook

echo.
echo Dependencies installed successfully!
echo You can now run Storybook with: npm run storybook
pause
