import express from 'express';
import { engine } from 'express-handlebars';
import { __filename, __dirname } from "./utils/utils.js";
import mongoose from "mongoose";
import cartRouter from "./routes/carts.router.js";
import productRouter from "./routes/products.router.js";
import session from "express-session"
import MongoStore from 'connect-mongo';
import passport from 'passport';

import loginRouter from "./routes/login.router.js";
import signupRouter from "./routes/signup.router.js";
import logoutRouter from "./routes/logout.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import currentRouter from "./routes/current.router.js";
import resultadoRouter from "./routes/resultado.router.js";
import forgotpassRouter from "./routes/forgotpass.router.js";
import initializePassport from './config/passport.config.js';
import sendEmailPassRouter from './routes/sendEmailPass.router.js';
import resetPasswordRouter from './routes/resetPassword.router.js';
import cookieParser from 'cookie-parser';

import { MONGO_URI, PORT, KEY_SECRET } from './config/config.js';
import MockingProductsRouters from './routes/mockingproducts.router.js';
import { addLogger } from './utils/logger.js';

const app = express();
const PUERTO = PORT || 8080;

//passport
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
initializePassport();
app.use(passport.initialize());

app.use(addLogger);

//Conexion a la base de datos
let dbConnect = mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

dbConnect.then(
    () => { console.log("Conexión a la base de datos exitosa"); },
    (error) => { console.log("Error en la conexión a la base de datos", error); }
)

app.use(session({
    store: MongoStore.create({
        mongoUrl: MONGO_URI,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        ttl: 300,
    }),
    secret: KEY_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 3600 * 1000,
    },
}));


app.use("/api/", loginRouter);
app.use("/api/signup", signupRouter);
app.use("/api/carts", cartRouter);
app.use("/api/products", productRouter);
app.use("/api/logout", logoutRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/current", currentRouter);
app.use("/api/resultado", resultadoRouter);
app.use("/mockingproducts", MockingProductsRouters)
app.use("/api/forgotpass", forgotpassRouter);
app.use("/api/sendEmailPass", sendEmailPassRouter);
app.use("/api/resetPassword", resetPasswordRouter);

app.get("/loggerTest", (req, res) => {
    req.logger.debug("Este es un mensaje de depuración"); 
    req.logger.http("Este es un mensaje HTTP"); 
    req.logger.info("Este es un mensaje de información"); 
    req.logger.warning("Este es un mensaje de advertencia"); 
    req.logger.error("Este es un mensaje de error"); 
    req.logger.fatal("Este es un mensaje fatal"); 
    res.send({ message: "Prueba de logger!" });
});

const httpServer = app.listen(PUERTO, () => {
    console.log("Servidor corriendo en puerto: " + PUERTO)
})

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set("views", `${__dirname}/views`);

app.use(express.static("public"));

//app.get('/current', passportCall('jwt'), authorization(), (req, res)=>{ res.send(req.user);})


app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({ message: 'Error interno del servidor' });
});