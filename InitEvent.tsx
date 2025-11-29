import React, { useState } from "react";
import TicketManager from "../contracts/ticket_manager.ts";
import { useWallet } from "../hooks/useWallet.ts";

export default function InitEvent() {
  const [loading, setLoading] = useState(false);
  const { address } = useWallet();

  

 
  const initEvent = async () => {

    if (!address) {
      alert("Requires connected wallet");
      return;
    }

    try {
      setLoading(true);

      await TicketManager.init({
        organizer: address,
        base_price: 1000,      
        sale_end: 1893456000n,  
        ticket_count: 50,       
        event_name: "Live Ticket",
      });

      alert("Event initialized!");

    const { result } = await TicketManager.get_ticket_left({});
     console.log("Ticket left", result);
    } catch (err) {
      console.error(err);
      alert("Init failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={initEvent} disabled={loading}>
        {loading ? "Initializing..." : "Create Event"}
      </button>
    </div>
  );
}