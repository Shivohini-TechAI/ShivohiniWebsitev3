import mongoose from "mongoose";
import dotenv from "dotenv";

import Product from "./models/product.js";
import Industry from "./models/industry.js";
import Job from "./models/job.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/nachiket";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected for seeding"))
  .catch((err) => console.error(err));

// Sample Products
const products = [
  {
    title: "AI Chatbot",
    description: "An intelligent chatbot to handle customer queries 24/7.",
    icon: "ChatIcon",
    features: ["Natural Language Understanding", "24/7 Support", "Analytics Dashboard"],
    color: "from-blue-500 to-blue-600",
    bgColor: "from-blue-50 to-blue-100"
  },
  {
    title: "Face Recognition System",
    description: "Advanced facial recognition for security and authentication.",
    icon: "FaceIcon",
    features: ["Real-time Detection", "High Accuracy", "Security Integration", "Privacy Compliant"],
    color: "from-indigo-500 to-indigo-600",
    bgColor: "from-indigo-50 to-indigo-100"
  },
  {
    title: "Face Recognition System",
    description: "Advanced facial recognition for security and authentication.",
    icon: "FaceIcon",
    features: ["Real-time Detection", "High Accuracy", "Security Integration", "Privacy Compliant"],
    color: "from-indigo-500 to-indigo-600",
    bgColor: "from-indigo-50 to-indigo-100"
  },
  {
    title: "Face Recognition System",
    description: "Advanced facial recognition for security and authentication.",
    icon: "FaceIcon",
    features: ["Real-time Detection", "High Accuracy", "Security Integration", "Privacy Compliant"],
    color: "from-indigo-500 to-indigo-600",
    bgColor: "from-indigo-50 to-indigo-100"
  },
  {
    title: "Face Recognition System",
    description: "Advanced facial recognition for security and authentication.",
    icon: "FaceIcon",
    features: ["Real-time Detection", "High Accuracy", "Security Integration", "Privacy Compliant"],
    color: "from-indigo-500 to-indigo-600",
    bgColor: "from-indigo-50 to-indigo-100"
  },
  {
    title: "Face Recognition System",
    description: "Advanced facial recognition for security and authentication.",
    icon: "FaceIcon",
    features: ["Real-time Detection", "High Accuracy", "Security Integration", "Privacy Compliant"],
    color: "from-indigo-500 to-indigo-600",
    bgColor: "from-indigo-50 to-indigo-100"
  },
  {
    title: "Face Recognition System",
    description: "Advanced facial recognition for security and authentication.",
    icon: "FaceIcon",
    features: ["Real-time Detection", "High Accuracy", "Security Integration", "Privacy Compliant"],
    color: "from-indigo-500 to-indigo-600",
    bgColor: "from-indigo-50 to-indigo-100"
  },
  {
    title: "Face Recognition System",
    description: "Advanced facial recognition for security and authentication.",
    icon: "FaceIcon",
    features: ["Real-time Detection", "High Accuracy", "Security Integration", "Privacy Compliant"],
    color: "from-indigo-500 to-indigo-600",
    bgColor: "from-indigo-50 to-indigo-100"
  },
  {
    title: "Face Recognition System",
    description: "Advanced facial recognition for security and authentication.",
    icon: "FaceIcon",
    features: ["Real-time Detection", "High Accuracy", "Security Integration", "Privacy Compliant"],
    color: "from-indigo-500 to-indigo-600",
    bgColor: "from-indigo-50 to-indigo-100"
  },
  {
    title: "Face Recognition System",
    description: "Advanced facial recognition for security and authentication.",
    icon: "FaceIcon",
    features: ["Real-time Detection", "High Accuracy", "Security Integration", "Privacy Compliant"],
    color: "from-indigo-500 to-indigo-600",
    bgColor: "from-indigo-50 to-indigo-100"
  },
  {
    title: "Custom Drones",
    description: "AI-powered drones tailored for specific industries.",
    icon: "DroneIcon",
    features: ["Autonomous Flight", "Data Collection", "Real-time Analytics", "Custom Hardware"],
    color: "from-purple-500 to-purple-600",
    bgColor: "from-purple-50 to-purple-100"
  }
];

// Sample Industries
const industries = [
  {
    title: "Hotel",
    description: "AI-powered hotel management systems with smart check-in/out.",
    icon: "BuildingIcon",
    solutions: ["Smart Check-in/out", "Guest Personalization", "Room Automation", "Revenue Optimization"],
    color: "from-blue-500 to-blue-600",
    bgGradient: "from-blue-50 to-blue-100"
  },
  {
    title: "Restaurant",
    description: "Intelligent restaurant solutions including order management.",
    icon: "UtensilsIcon",
    solutions: ["Menu Optimization", "Order Management", "Kitchen Automation", "Customer Analytics"],
    color: "from-red-500 to-red-600",
    bgGradient: "from-red-50 to-red-100"
  },
  {
    title: "Supermarket",
    description: "Smart retail solutions with inventory management.",
    icon: "ShoppingCartIcon",
    solutions: ["Inventory Management", "Smart Checkout", "Customer Analytics", "Price Optimization"],
    color: "from-green-500 to-green-600",
    bgGradient: "from-green-50 to-green-100"
  }
];

const Jobs= [{
  title: "Software Developer",
  location: "Pune",
  type: "Full Time",
  description: "Nice",
  applyLink: "www.com",
  postedAt: Date.now()
}];

const seedData = async () => {
  try {
    await Product.deleteMany({});
    await Industry.deleteMany({});

    // await Product.insertMany(products);
    // await Industry.insertMany(industries);
    await Job.insertMany(Jobs)

    console.log("Seed data inserted successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding data:", error);
    mongoose.connection.close();
  }
};

seedData();
