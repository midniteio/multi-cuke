export default function(handler) {
  process.on('SIGINT', () => {
    process.exit();
  });

  process.on('SIGTERM', () => {
    process.exit();
  });

  process.on('exit', () => {
    handler.kill();
  });
}
