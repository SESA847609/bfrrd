const authService = require("../services/auth.service");
const signup = async (req, res, next) => {
  try {
    const { name, email, password, phone, sesaId } = req.body || {};
    if (!name || !email || !password || !sesaId) {
      return res.status(400).json({
        success: false,
        message: "Name, email, SESA ID and password are required",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters",
      });
    }
    const user = await authService.signup({ name, email, password, phone, sesaId });
    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
const login = async (req, res, next) => {
  try {
    const { loginId, password } = req.body || {};
    if (!loginId || !password) {
      return res.status(400).json({
        success: false,
        message: "Login ID and password are required",
      });
    }
    const result = await authService.login({ loginId, password });
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const me = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user.userId);
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
module.exports = { signup, login, me };
