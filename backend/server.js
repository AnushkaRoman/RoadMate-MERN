
const dns = require("dns");

// DNS configuration for MongoDB Atlas SRV lookup
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const errorMiddleware = require("./middleware/errorMiddleware");

// Routes
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const serviceCenterRoutes = require("./routes/serviceCenterRoutes");
const providerBookingRoutes = require("./routes/providerBookingRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const fuelStationRoutes = require("./routes/fuelStationRoutes");
const userBookingRoutes = require("./routes/userBookingRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const insuranceRoutes = require("./routes/insuranceRoutes");

// Express application
const app = express();

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://road-mate-mern.vercel.app",
];

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin (Postman, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Handle JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "RoadMate Backend API is running!",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/service-centers", serviceCenterRoutes);
app.use("/api/provider/bookings", providerBookingRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/fuel-stations", fuelStationRoutes);
app.use("/api/bookings", userBookingRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/insurance", insuranceRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// Global error handler
app.use(errorMiddleware);

// Start server
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`RoadMate server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start RoadMate:", error.message);
    process.exit(1);
  }
};

startServer();
