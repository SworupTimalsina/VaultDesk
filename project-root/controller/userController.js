const User = require("../model/User");
const asyncHandler = require("express-async-handler");

// Update Profile
exports.updateProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, phone, notifications } = req.body;
    const profileImage = req.file?.filename;

    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (profileImage) updates.profileImage = profileImage;

    // Parse notifications
    if (notifications) {
      try {
        const parsed =
          typeof notifications === "string" ? JSON.parse(notifications) : notifications;

        updates.notifications = {
          email: parsed.email === "true" || parsed.email === true,
          sms: parsed.sms === "true" || parsed.sms === true,
        };
      } catch (err) {
        return res.status(400).json({ message: "Invalid notifications format" });
      }
    } else {
      // Handle checkbox-like values from form-data if not JSON string
      updates.notifications = {
        email: req.body["notifications[email]"] === "true",
        sms: req.body["notifications[sms]"] === "true",
      };
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
    res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

// Get User By ID
exports.getUserById = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
});
