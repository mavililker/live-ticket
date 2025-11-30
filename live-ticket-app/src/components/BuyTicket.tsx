import { useState } from "react";
import TicketManager from "../contracts/ticket_manager.ts";
import { useWallet } from "../hooks/useWallet.ts";


interface TicketResult {
  id: number;
  owner: string;
  purchase_time: number;
  purchase_price: number;
  event_name: string;
}


function secondsToDatetimeLocal(seconds: number): string {
  const date = new Date(seconds * 1000); // saniyeyi milisaniyeye çeviriyoruz

  const pad = (n: number) => String(n).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());

  return `${year}-${month}-${day} ${hour}:${minute}`;
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

  // BuyTicket.tsx - Sadece return kısmı (Başlıksız versiyon)

return (
  <div style={{
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(10px)",
    borderRadius: "1.5rem",
    padding: "2rem",
    boxShadow: "0 8px 32px 0 rgba(59, 130, 246, 0.15)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  }}>
    <div>
      <h3 style={{
        fontSize: "1.25rem",
        fontWeight: "bold",
        background: "linear-gradient(135deg, #3b82f6 0%, #ec4899 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        margin: "0 0 0.5rem 0"
      }}>
        Buy Ticket
      </h3>
      <p style={{
        color: "#6b7280",
        fontSize: "0.875rem",
        margin: 0,
        lineHeight: "1.4"
      }}>
        Purchase your ticket and secure your spot
      </p>
    </div>

    <button
      onClick={handleBuy}
      disabled={loading || !address}
      style={{
        width: "100%",
        padding: "0.875rem 1.5rem",
        background: loading || !address 
          ? "#9ca3af" 
          : "linear-gradient(135deg, #3b82f6 0%, #ec4899 100%)",
        color: "white",
        fontWeight: "600",
        fontSize: "0.95rem",
        border: "none",
        borderRadius: "1rem",
        boxShadow: "0 8px 15px -3px rgba(59, 130, 246, 0.4)",
        cursor: loading || !address ? "not-allowed" : "pointer",
        transition: "all 0.3s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        opacity: loading || !address ? 0.5 : 1
      }}
      onMouseEnter={(e) => {
        if (!loading && address) {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 12px 20px -3px rgba(59, 130, 246, 0.5)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 15px -3px rgba(59, 130, 246, 0.4)";
      }}
    >
      {loading ? (
        <>
          <svg 
            style={{ animation: "spin 1s linear infinite" }}
            width="18" 
            height="18" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              style={{ opacity: 0.25 }}
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              style={{ opacity: 0.75 }}
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Processing...
        </>
      ) : (
        <>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          Buy Ticket
        </>
      )}
    </button>

    {!address && (
      <div style={{
        padding: "0.875rem 1rem",
        background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
        borderRadius: "0.75rem",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem"
      }}>
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <span style={{ fontSize: "0.8rem", color: "#92400e", fontWeight: "500" }}>
          Connect wallet first
        </span>
      </div>
    )}

    {ticket && (
      <div style={{
        animation: "slideIn 0.5s ease-out"
      }}>
        <div style={{
          padding: "0.875rem 1rem",
          background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
          borderRadius: "0.75rem",
          marginBottom: "0.875rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem"
        }}>
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span style={{ fontSize: "0.875rem", color: "#166534", fontWeight: "600" }}>
            Ticket Purchased!
          </span>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "0.75rem",
          marginBottom: "0.75rem"
        }}>
          <div style={{
            padding: "0.875rem",
            background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
            borderRadius: "0.75rem"
          }}>
            <p style={{
              fontSize: "0.65rem",
              color: "#1e40af",
              fontWeight: "700",
              margin: "0 0 0.25rem 0",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>
              Ticket ID
            </p>
            <p style={{
              fontSize: "1.35rem",
              color: "#1e3a8a",
              fontWeight: "bold",
              margin: 0
            }}>
              #{ticket.id}
            </p>
          </div>

          <div style={{
            padding: "0.875rem",
            background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
            borderRadius: "0.75rem"
          }}>
            <p style={{
              fontSize: "0.65rem",
              color: "#92400e",
              fontWeight: "700",
              margin: "0 0 0.25rem 0",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>
              Price
            </p>
            <p style={{
              fontSize: "1.35rem",
              color: "#78350f",
              fontWeight: "bold",
              margin: 0
            }}>
              {ticket.purchase_price}
            </p>
          </div>
        </div>

        <div style={{
          padding: "0.875rem",
          background: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)",
          borderRadius: "0.75rem",
          marginBottom: "0.75rem"
        }}>
          <p style={{
            fontSize: "0.65rem",
            color: "#9f1239",
            fontWeight: "700",
            margin: "0 0 0.4rem 0",
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}>
            Event Name
          </p>
          <p style={{
            fontSize: "1.1rem",
            color: "#831843",
            fontWeight: "bold",
            margin: 0
          }}>
            {ticket.event_name}
          </p>
        </div>

        <div style={{
          padding: "0.875rem",
          background: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
          borderRadius: "0.75rem",
          marginBottom: "0.75rem"
        }}>
          <p style={{
            fontSize: "0.65rem",
            color: "#3730a3",
            fontWeight: "700",
            margin: "0 0 0.25rem 0",
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}>
            Purchase Time
          </p>
          <p style={{
            fontSize: "0.95rem",
            color: "#312e81",
            fontWeight: "bold",
            margin: 0,
            fontFamily: "monospace"
          }}>
            {secondsToDatetimeLocal(ticket.purchase_time)}
          </p>
        </div>

        <div style={{
          padding: "0.875rem",
          background: "linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)",
          borderRadius: "0.75rem"
        }}>
          <p style={{
            fontSize: "0.65rem",
            color: "#6b21a8",
            fontWeight: "700",
            margin: "0 0 0.25rem 0",
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}>
            Owner
          </p>
          <p style={{
            fontSize: "0.85rem",
            color: "#581c87",
            fontWeight: "bold",
            margin: 0,
            fontFamily: "monospace",
            wordBreak: "break-all"
          }}>
            {ticket.owner}
          </p>
        </div>
      </div>
    )}

    {error && (
      <div style={{
        padding: "0.875rem 1rem",
        background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
        borderRadius: "0.75rem",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        animation: "shake 0.5s ease-in-out"
      }}>
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <span style={{ fontSize: "0.8rem", color: "#991b1b", fontWeight: "500" }}>
          {error}
        </span>
      </div>
    )}

    <style>{`
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }
    `}</style>
  </div>
);
}