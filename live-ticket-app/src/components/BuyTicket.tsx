import React, { useState } from "react";
import TicketManager from "../contracts/ticket_manager.ts";
import { useWallet } from "../hooks/useWallet.ts";

interface TicketResult {
  id: number;
  owner: string;
  purchase_time: number;
  purchase_price: number;
  event_name: string;
}

export default function BuyTicket() {
  const { address } = useWallet();
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState<TicketResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleBuy = async () => {
    if (!address) {
      alert("You must connect your wallet first.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const tx = await TicketManager.buy_ticket({ buyer: address });
      const { result } = await tx.signAndSend();
      console.log("Buy ticket result:", result);
      
      const ticketLeft = await TicketManager.get_ticket_left({});
      console.log("Tickets left:", ticketLeft.result);

      const mapped: TicketResult = {
        id: Number(result.id),
        owner: String(result.owner),
        purchase_time: Number(result.purchase_time),
        purchase_price: Number(result.purchase_price),
        event_name: String(result.event_name),
      };

      setTicket(mapped);
    } catch (e) {
      console.error(e);
      setError("An error occurred while buying the ticket. Check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleBuy} disabled={loading || !address}>
        {loading ? "Processing purchase..." : "Buy Ticket"}
      </button>

      {!address && (
        <p style={{ marginTop: "0.5rem" }}>
          You need to connect your wallet before buying a ticket.
        </p>
      )}

      {ticket && (
        <div style={{ marginTop: "0.5rem" }}>
          <p>Ticket purchased successfully!</p>
          <p>Ticket ID: {ticket.id}</p>
          <p>Event: {ticket.event_name}</p>
          <p>Price: {ticket.purchase_price}</p>
          <p>Owner: {ticket.owner}</p>
        </div>
      )}

      {error && (
        <p style={{ marginTop: "0.5rem", color: "red" }}>
          {error}
        </p>
      )}
    </div>
  );
}