const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/config");
const startServer = require("./config/server");
const paymentRouter = require("./routes/payment.route");
const path = require("path");
// const cookieParser = require("cookie-parser");

const {Server} = require("socket.io")

const authRouter = require("./routes/auth.route");
const usergenreRouter = require("./routes/genre.route");
const movieRouter = require("./routes/movie.route");
const otpRouter = require("./routes/otp.route");
const fileRouter = require("./routes/files.route");

const { handleError } = require("./util/error");

const dotenv = require("dotenv");
dotenv.config();

const app = express();
http = require("http")

const PORT = process.env.PORT;
const URI = process.env.URI;

app.use(
  cors({ origin: "*", credentials: true, methods: "GET,POST,PUT,DELETE,PATCH" })
);

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`);

  // We can write our socket event listeners in here...
});

connectDB(URI);

startServer(server, PORT);

// app.use(cors());
app.use(bodyParser.json());

// app.use(cookieParser())

app.use("/file", fileRouter);

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use("/uploads/receipts", express.static(path.join("uploads", "receipts")));

app.use("/payment", paymentRouter);

app.use("/", authRouter);
app.use("/forgot", otpRouter);
app.use("/user", usergenreRouter);
app.use("/movie", movieRouter);

app.use(handleError);
