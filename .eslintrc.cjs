module.exports = {
  // ... other configuration options

  rules: {
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off', // Disable prop-types rule
    // Disable require-default-props rule
    'sourceType': 'module',
  },
};
