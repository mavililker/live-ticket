import { useState } from "react";
import TicketManager from "../contracts/ticket_manager.ts";
import { useWallet } from "../hooks/useWallet.ts";

export default function InitEvent() {
  const [loading, setLoading] = useState(false);
  const { address, signTransaction } = useWallet();

  TicketManager.options.publicKey = address;
  TicketManager.options.signTransaction = signTransaction;

  

 
  const initEvent = async () => {

    if (!address) {
      alert("Requires connected wallet");
      return;
    }

    try {
      setLoading(true);
  
      const tx = await TicketManager.init({
        organizer: address,
        base_price: 1000,      
        sale_end: 1893456000n,  
        ticket_count: 50,       
        event_name: "Live Ticket",
      });

      const { result} = await tx.signAndSend();

      alert("Event initialized!");

     console.log("tx", result);
    } catch (err) {
      console.error(err);
      alert("Init failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={initEvent} disabled={loading || !address}>
        {loading ? "Initializing..." : "Create Event"}
      </button>
    </div>
  );
}