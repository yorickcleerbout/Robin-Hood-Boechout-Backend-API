export const healthCheck = async (req, res, next) => {
    return res.status(200).json(
        {
        "status": "healthy",
        "version": "v1",
      });
};