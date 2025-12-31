// Input validation middleware
const validateSlamEntry = (req, res, next) => {
  const { friendName, message } = req.body;

  if (!friendName || !message) {
    return res.status(400).json({
      error: 'Both name and message are required.',
    });
  }

  if (typeof friendName !== 'string' || friendName.trim().length === 0) {
    return res.status(400).json({
      error: 'Name must be a non-empty string.',
    });
  }

  if (typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({
      error: 'Message must be a non-empty string.',
    });
  }

  next();
};

module.exports = { validateSlamEntry };

