
const hiRoutes = async (req, res) => {
  try {
    res.json({ message: "hi how's your days" });

  } catch (error) {
    console.error('Hi Routes Error:', error);
    
    const status = error.response?.status || 500;
    res.status(status).json({
      success: false,
      error: 'Hi Routes failed',
      details: error.response?.data || error.message
    });
  }
};

module.exports = { hiRoutes };
