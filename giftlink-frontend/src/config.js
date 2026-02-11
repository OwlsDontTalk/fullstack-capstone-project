const config = {
  backendUrl: process.env.REACT_APP_BACKEND_URL || 'http://localhost:3060',
};

if (process.env.NODE_ENV !== 'production') {
  console.log(`backendUrl in config.js: ${config.backendUrl}`);
}

export { config as urlConfig };
