
const Reminder = require("../models/Reminder");
const Vehicle = require("../models/Vehicle");

// ADD REMINDER
const addReminder = async (req, res, next) => {
  try {
    const {
      vehicle,
      title,
      description,
      reminderType,
      dueDate
    } = req.body;

    if (!vehicle || !title || !reminderType || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Vehicle, title, type and due date are required"
      });
    }

    // Verify vehicle ownership
    const vehicleExists = await Vehicle.findOne({
      _id: vehicle,
      owner: req.user.id
    });

    if (!vehicleExists) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found"
      });
    }

    const reminder = await Reminder.create({
      user: req.user.id,
      vehicle,
      title,
      description,
      reminderType,
      dueDate
    });

    res.status(201).json({
      success: true,
      message: "Reminder created successfully",
      reminder
    });

  } catch (error) {
    next(error);
  }
};

// GET MY REMINDERS
const getMyReminders = async (req, res, next) => {
  try {
    const reminders = await Reminder.find({
      user: req.user.id
    })
      .populate("vehicle", "brand model registrationNumber")
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: reminders.length,
      reminders
    });

  } catch (error) {
    next(error);
  }
};

// UPDATE REMINDER
const updateReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found"
      });
    }

    const allowedFields = [
      "title",
      "description",
      "reminderType",
      "dueDate",
      "isCompleted"
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        reminder[field] = req.body[field];
      }
    });

    await reminder.save();

    res.status(200).json({
      success: true,
      message: "Reminder updated successfully",
      reminder
    });

  } catch (error) {
    next(error);
  }
};

// DELETE REMINDER
const deleteReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Reminder deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  addReminder,
  getMyReminders,
  updateReminder,
  deleteReminder
};
