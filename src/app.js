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
    ()=>{console.log("Conexión a la base de datos exitosa");},
    (error)  => {console.log("Error en la conexión a la base de datos", error);}
)

const pm = new ProductManager("productos.json")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/carts", cartRouter);
app.use("/api/products", productRouter);

const httpServer = app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto: " + PORT)
})




app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set("views", `${__dirname}/views`);

app.use(express.static("public"));
app.use("/views", viewsRoute);
app.use("/realtimeproducts", viewsRealTime);


app.get("/", (req, res)=> {
    res.send ("Hola Mundo!");
})


app.get('/', (req, res) => {
    res.render('Home');
});


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

