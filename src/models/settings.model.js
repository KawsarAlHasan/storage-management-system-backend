const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    name: String,
    type: { type: String, enum: ["about", "privacy", "terms"], unique: true },
    content: String,
  },
  { timestamps: true }
);

const initializeSettings = async () => {
  const Setting = mongoose.model("Setting");
  const defaultSettings = [
    {
      type: "about",
      name: "About Us",
      content: "Default about us content... Update this with your information.",
    },
    {
      type: "privacy",
      name: "Privacy Policy",
      content: "Default privacy policy... Update this with your legal terms.",
    },
    {
      type: "terms",
      name: "Terms & Conditions",
      content:
        "Default terms and conditions... Update this with your legal terms.",
    },
  ];

  for (const setting of defaultSettings) {
    await Setting.findOneAndUpdate({ type: setting.type }, setting, {
      upsert: true,
      new: true,
    });
  }
  console.log("Default settings initialized");
};

mongoose.connection.once("open", () => {
  initializeSettings().catch((err) =>
    console.error("Settings init error:", err)
  );
});

module.exports = mongoose.model("Setting", settingSchema);
