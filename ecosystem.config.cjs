module.exports = {
  apps: [
    {
      name: "doorprize-pocari-run",
      script: "./node_modules/.bin/serve",
      args: ["-s", "dist", "-l", "3111"],
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
