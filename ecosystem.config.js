module.exports = {
  apps: [
    {
      name: 'atendimento-backend',
      script: '/home/deploy/atendimento/backend/dist/server.js',
      instances: 2,
      exec_mode: 'cluster',
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 8080
      }
    },
    {
      name: 'atendimento-frontend',
      script: 'serve',
      env: {
        PM2_SERVE_PATH: '/home/deploy/atendimento/frontend/build',
        PM2_SERVE_PORT: 3333,
        PM2_SERVE_SPA: 'true'
      }
    }
  ]
};
