/**
 * Async Handler Wrapper
 * Catches async errors and passes them to error handling middleware
 */

/**
 * Wrap async function to catch errors
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Wrapped function
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Wrap async controller methods
 * @param {Object} controller - Controller object
 * @returns {Object} Controller with wrapped methods
 */
const wrapController = (controller) => {
  const wrappedController = {};
  
  for (const [methodName, method] of Object.entries(controller)) {
    if (typeof method === 'function') {
      wrappedController[methodName] = asyncHandler(method);
    } else {
      wrappedController[methodName] = method;
    }
  }
  
  return wrappedController;
};

module.exports = {
  asyncHandler,
  wrapController
};
