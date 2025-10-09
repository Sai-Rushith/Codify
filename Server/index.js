// index.js
const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

// --- helper to normalize origins (remove trailing slash) ---
function normalizeOrigin(origin) {
  if (!origin) return origin;
  return origin.endsWith("/") ? origin.slice(0, -1) : origin;
}

// --- whitelist of allowed origins (no trailing slashes) ---
const WHITELIST = [
  "https://codify-inky.vercel.app",
  // add other allowed origins here, e.g.:
  // "https://your-other-site.com"
].map(normalizeOrigin);

// database connect
database.connect();

// middlewares
app.use(express.json());
app.use(cookieParser());

// CORS: dynamic origin function that echoes back the exact origin when allowed.
// This will set Access-Control-Allow-Origin to the incoming origin (exact string)
// which is required when credentials: true.
app.use(
  cors({
    origin: (incomingOrigin, callback) => {
      // incomingOrigin can be undefined (e.g., server-to-server requests or same-origin)
      if (!incomingOrigin) return callback(null, true);

      const normalized = normalizeOrigin(incomingOrigin);
      if (WHITELIST.includes(normalized)) {
        // allow and echo back the original incoming origin (not the normalized one)
        // cors package will set the header to the incomingOrigin automatically
        return callback(null, true);
      }

      // Not allowed
      return callback(new Error(`CORS policy: origin ${incomingOrigin} is not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"],
    // optional: set a successful status for legacy browsers that choke on 204
    optionsSuccessStatus: 204,
  })
);

// Ensure OPTIONS preflight returns quickly (this is optional because cors() handles it,
// but explicit handler can help in some environments)
app.options("*", (req, res) => res.sendStatus(204));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// cloudinary connection
cloudinaryConnect();

// routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);

// default route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
