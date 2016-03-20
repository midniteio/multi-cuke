import readline from 'readline';

export default function(handler) {
  if (process.platform === "win32") {
    readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    .on("SIGINT", function () {
      process.emit("SIGINT");
    });
  }

  process.on("SIGINT", function () {
    handler.kill();
    process.exit();
  });

  process.on('exit', function() {
    handler.kill();
  });

  process.on('uncaughtException', function(e) {
    console.error('Unhandled exception, terminating all worker processes...');
    console.error(e.stack);
    handler.kill();
  });
}
