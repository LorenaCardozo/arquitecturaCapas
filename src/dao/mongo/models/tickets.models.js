import mongoose from 'mongoose';
import shortid from 'shortid'; 

const ticketCollection = "tickets";
const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        default: shortid.generate,
        required: false,
    },
    purchase_datetime: {
        type: Date,
        default: Date.now,
    },
    amount: {
        type: Number,
        required: true,
    },
    purchaser: {
        type: String,
        required: true,
    },
});

const Ticket = mongoose.model(ticketCollection, ticketSchema);

export default Ticket;