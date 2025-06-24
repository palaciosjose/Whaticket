module.exports = {
  apps: [
    {
      name: 'atendimento-backend',
      script: './backend/dist/server.js',
      instances: 2, // Usa 2 instancias para balancear carga
      exec_mode: 'cluster',
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 8080
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_file: './logs/backend-combined.log'
    },
    {
      name: 'atendimento-frontend',
      script: 'serve',
      env: {
        PM2_SERVE_PATH: './frontend/build',
        PM2_SERVE_PORT: 3333,
        PM2_SERVE_SPA: 'true'
      },
      instances: 1,
      exec_mode: 'fork'
    }
  ]
};
