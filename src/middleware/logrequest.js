const onHeaders = require('on-headers');

const requestLogger = (req, res, next) => {
  const start = process.hrtime.bigint();
  const { method, originalUrl } = req;

  // Log when request is received
  console.log(`[REQUEST] ${method} ${originalUrl} - ${new Date().toISOString()}`);

  // Hook into response to log after it's sent
  onHeaders(res, () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000; // nanoseconds → ms
    const { statusCode } = res;

    console.log(`[RESPONSE] ${method} ${originalUrl} → ${statusCode} (${durationMs.toFixed(2)} ms)`);
  });

  next();
};

module.exports = requestLogger;