import { TicketModel } from "../models/tickets.model.js";

export default class TicketsDAO {
  createTicket = async (data) => {
    try {
        const result = await TicketModel.create(data);
        return result;
    } catch (error) {
        console.log("Error creating ticket:", error);
        return null;
    }
    };
}