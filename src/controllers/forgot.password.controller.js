const bcrypt = require("bcryptjs");
const sendResetEmail = require("../middleware/forgot.email");
const ForgotPassword = require("../models/forgot.password.model");
const { generateToken } = require("../config/user.token");
const User = require("../models/user.model");

// send reset code on email
exports.sendResetCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(404).send({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: "No user with this email",
      });
    }

    // Delete any existing reset codes for this email
    await ForgotPassword.deleteMany({ email });

    // Generate a 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpire = new Date(Date.now() + 300000); // 5 minutes expiry

    // Save the new reset code
    const forgotPassword = new ForgotPassword({
      reset_code: resetCode,
      email: email,
      reset_code_expire: codeExpire,
    });
    await forgotPassword.save();

    // Send email with the reset code
    await sendResetEmail(email, resetCode);

    res.status(200).send({
      success: true,
      message: "Reset code sent to email",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

// verify reset code
exports.verifyResetCode = async (req, res) => {
  try {
    const { email, reset_code } = req.body;

    if (!email || !reset_code) {
      return res.status(404).send({
        success: false,
        message: "email & reset_code is required",
      });
    }

    // Find the reset code
    const record = await ForgotPassword.findOne({
      email,
      reset_code,
      reset_code_expire: { $gt: Date.now() }, // Check if code is still valid
    });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset code",
      });
    }

    res.status(200).json({
      success: true,
      message: "Reset code verified",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

// set new password
exports.newPasswordSet = async (req, res) => {
  try {
    const { email, reset_code, new_password } = req.body;

    if (!email || !reset_code || !new_password) {
      return res.status(404).send({
        success: false,
        message: "email, new_password & reset_code is required",
      });
    }

    // Verify the reset code first
    const record = await ForgotPassword.findOne({
      email,
      reset_code,
      reset_code_expire: { $gt: Date.now() },
    });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset code",
      });
    }

    // Find user and update password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(new_password, 10);
    user.password = hashedPassword;
    await user.save();

    // Delete the used reset code
    await ForgotPassword.deleteMany({ email });

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};
