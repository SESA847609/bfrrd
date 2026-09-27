const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/User");

const environment = require("../config/environment");

const signup = async ({ name, email, password, phone, sesaId }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const normalizedSesaId = sesaId ? sesaId.trim().toUpperCase() : "";

  if (!normalizedSesaId) {
    const error = new Error("SESA ID is required");
    error.status = 400;
    throw error;
  }

  const existingUser = await User.findOne({
    $or: [{ email: normalizedEmail }, { sesaId: normalizedSesaId }],
  });

  if (existingUser) {
    const error = new Error(
      existingUser.email === normalizedEmail
        ? "Email is already registered"
        : "SESA ID is already registered",
    );

    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name: name.trim(),
    sesaId: normalizedSesaId,
    email: normalizedEmail,
    password: hashedPassword,
    phone: phone ? phone.trim() : undefined,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    sesaId: user.sesaId,
    role: user.role,
  };
};

const login = async ({ loginId, password }) => {
  if (!loginId || !password) {
    const error = new Error("SESA ID / SE Email and password are required");
    error.status = 400;
    throw error;
  }

  const loginValue = loginId.trim();

  const user = await User.findOne({
    $or: [
      {
        sesaId: loginValue.toUpperCase(),
      },
      {
        email: loginValue.toLowerCase(),
      },
    ],
  });

  if (!user) {
    const error = new Error("Invalid SESA ID / SE Email or password");
    error.status = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const error = new Error("Invalid SESA ID / SE Email or password");
    error.status = 401;
    throw error;
  }

  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      sesaId: user.sesaId,
      role: user.role,
    },
    environment.jwt.secret,
    // {
    //   expiresIn: environment.jwt.expiresIn,
    // },
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      sesaId: user.sesaId,
      role: user.role,
    },
  };
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    const error = new Error("User not found");

    error.status = 404;

    throw error;
  }

  return user;
};

module.exports = {
  signup,

  login,

  getCurrentUser,
};
