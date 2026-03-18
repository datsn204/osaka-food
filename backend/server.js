const app = require('./app');
const { testConnection } = require('./config/db');
require('dotenv').config();

let PORT = process.env.PORT || 5000;

// Handle EADDRINUSE
const start = async () => {
  await testConnection();
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${PORT} busy. Trying ${PORT + 1}...`);
      PORT += 1;
      server.listen(PORT);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
};

start();

