export const formatter = 'stylish';
export const outputFile = 'eslint-results.txt';
export const quiet = false;
export const maxWarnings = -1;
export const color = true;
export const errorOnUnmatchedPattern = false;
export const patterns = [
    'src/**/*.{js,jsx,ts,tsx}',
    '!node_modules/**',
    '!build/**'
];