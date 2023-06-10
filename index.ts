import * as Sentry from "@sentry/node";
import * as http from "node:http";
import { ProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "http://0b9d1acd9815423c806c5d2c31157afd@127.0.0.1:9000/2",

  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // Automatically instrument Node.js libraries and frameworks
    ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
    // Add our Profiling integration
    new ProfilingIntegration(),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
  release: "1.0",
});

const transaction = Sentry.startTransaction({
  op: "test",
  name: "My First Test Transaction",
});

// try {
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.write("Hello, World!\n");
  // Intentionally throw an error
  // throw new Error("This is an intentional error!");
  // Sentry.captureEvent({
  //   level: "info",
  //   message: "My First Sentry event!",
  // });
  res.end();
});
server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
// } catch (e) {
//   Sentry.captureException(e);
// } finally {
transaction.finish();
// }
