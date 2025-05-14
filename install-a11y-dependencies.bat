@echo off
echo Installing accessibility testing dependencies...
echo This may take a few minutes, please be patient.

:: Install accessibility testing packages
npm install --save-dev axe-core jest-axe @testing-library/jest-dom @testing-library/react @testing-library/user-event

echo.
echo Accessibility testing dependencies installed successfully!
echo You can now run accessibility tests with: npm test
pause
