import express from 'express';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import viewsRoute from './routes/view.router.js';
import viewsRealTime from './routes/view.realtime.js';
import { __filename, __dirname } from "./utils.js";
import { ProductManager } from './ProductManager.js';
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import cartRouter from "./routes/carts.router.js";
import productRouter from "./routes/products.router.js";
import session from "express-session"
//import FileStore from 'session-file-store';
import MongoStore from 'connect-mongo';

import loginRouter from "./routes/login.router.js";
import signupRouter from "./routes/signup.router.js";
import logoutRouter from "./routes/logout.router.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;

//Conexion a la base de datos

let dbConnect = mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

dbConnect.then(
    () => { console.log("Conexión a la base de datos exitosa"); },
    (error) => { console.log("Error en la conexión a la base de datos", error); }
)

// session
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        ttl: 300,
    }),
    secret: "codersecret",
    resave: false,
    saveUninitialized: false,
}));

const pm = new ProductManager("productos.json")
///const fileStore = FileStore(session);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/", loginRouter);
app.use("/api/signup", signupRouter);
app.use("/api/carts", cartRouter);
app.use("/api/products", productRouter);
app.use("/api/logout", logoutRouter);

/*****SESSION***/
/* app.use(session({
    store: new fileStore({ path: __dirname + "/sessions", ttl: 100, retries: 0, }),
    secret: "codersecret",
    resave: true,
    saveUninitialized: true,
})) */



const httpServer = app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto: " + PORT)
})

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set("views", `${__dirname}/views`);

app.use(express.static("public"));
app.use("/views", viewsRoute);
app.use("/realtimeproducts", viewsRealTime);


/* app.get("/", (req, res) => {
    res.send("Hola Mundo!");
})


app.get('/', (req, res) => {
    res.render('Home');
}); */


/*

app.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (!err) {
            res.send("Logout ok!")
        } else {
            res.json({ status: "Error al cerrar sesión", body: err })
        }
    })

})
*/

/****SOCKET***/
const socketServer = new Server(httpServer);

// Establecer la conexión con Socket.IO
socketServer.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.on('mensaje', (data) => {
        console.log('Mensaje recibido:', data);
        socket.emit('mensaje', data); // Enviar el mensaje a todos los clientes conectados
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    socket.on('agregarProducto', (data) => {
        pm.addProduct(data.title, data.description, data.price, data.thumbnail, data.code, data.stock, data.category, true)
        socket.emit('okProducto', data); // Enviar el mensaje a todos los clientes conectados
    });

    socket.on('eliminarProducto', (data) => {
        pm.deleteProductByCode(data)
        socket.emit('okDelete', data);
    });

});

