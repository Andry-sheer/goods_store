const allowedOrigins = ["http://localhost:5173", "http://localhost:3000", "http://localhost:3001"];

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Error: not allowed by CORS"));
    }
  },
  credentials: true,
  methods : ['GET', 'POST'],
  allowedHeaders : ['Content-Type', 'Authorization']
};
