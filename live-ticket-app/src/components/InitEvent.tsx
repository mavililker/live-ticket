import { useState } from "react";
import TicketManager from "../contracts/ticket_manager.ts";
import { useWallet } from "../hooks/useWallet.ts";

export default function InitEvent() {

  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const formattedTomorrow = tomorrow.toISOString().slice(0, 16);

  const [loading, setLoading] = useState(false);
  const { address, signTransaction } = useWallet();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventName, setEventName] = useState("Live Ticket");
  const [basePrice, setBasePrice] = useState("1000");
  const [saleEnd, setSaleEnd] = useState(formattedTomorrow);
  const [ticketCount, setTicketCount] = useState("50");

  TicketManager.options.publicKey = address;
  TicketManager.options.signTransaction = signTransaction;
  

  const initEvent = async () => {
    if (!address) {
      alert("Requires connected wallet");
      return;
    }
  const nowSeconds = Math.floor(Date.now() / 1000);
  const saleEndSeconds = Math.floor(new Date(saleEnd).getTime() / 1000);

if (saleEndSeconds <= nowSeconds) {
  alert("Sale end must be a future time");
  return;
}
    try {
      setLoading(true);

      const parsedBasePrice = Number(basePrice);
      const parsedTicketCount = Number(ticketCount);
      const parsedSaleEnd = BigInt(Math.floor(new Date(saleEnd).getTime() / 1000));

      const nowSeconds = Math.floor(Date.now() / 1000);

      if (parsedSaleEnd <= nowSeconds) {
        alert("Sale End must be a future time.");
        return;
      }

      const tx = await TicketManager.init({
        organizer: address,
        base_price: parsedBasePrice,
        sale_end: parsedSaleEnd,
        ticket_count: parsedTicketCount,
        event_name: eventName,
      });

      const { result } = await tx.signAndSend();
      console.log("InitEvent result:", result);
      alert("Event initialized!");
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Init failed");
    } finally {
      setLoading(false);
    }
  };


 return (
    <>
      <div style={{
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(10px)",
        borderRadius: "1.5rem",
        padding: "2rem",
        boxShadow: "0 8px 32px 0 rgba(147, 51, 234, 0.15)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
      }}>
        <div>
          <h3 style={{
            fontSize: "1.25rem",
            fontWeight: "bold",
            background: "linear-gradient(135deg, #9333ea 0%, #3b82f6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            margin: "0 0 0.5rem 0"
          }}>
            Create Event
          </h3>
          <p style={{
            color: "#6b7280",
            fontSize: "0.875rem",
            margin: 0,
            lineHeight: "1.4"
          }}>
            Set up a new ticketing event with custom pricing
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          disabled={loading || !address}
          style={{
            width: "100%",
            padding: "0.875rem 1.5rem",
            background: loading || !address 
              ? "#9ca3af" 
              : "linear-gradient(135deg, #9333ea 0%, #3b82f6 100%)",
            color: "white",
            fontWeight: "600",
            fontSize: "0.95rem",
            border: "none",
            borderRadius: "1rem",
            boxShadow: "0 8px 15px -3px rgba(147, 51, 234, 0.4)",
            cursor: loading || !address ? "not-allowed" : "pointer",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            opacity: loading || !address ? 0.5 : 1
          }}
          onMouseEnter={(e) => {
            if (!loading && address) {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 20px -3px rgba(147, 51, 234, 0.5)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 15px -3px rgba(147, 51, 234, 0.4)";
          }}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {loading ? "Initializing..." : "Create Event"}
        </button>
      </div>

      {isModalOpen && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1rem",
            overflowY: "auto"
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !loading) {
              setIsModalOpen(false);
            }
          }}
        >
          <div 
            style={{
              background: "white",
              borderRadius: "1.5rem",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
              width: "100%",
              maxWidth: "32rem",
              overflow: "hidden",
              margin: "auto",
              animation: "modalSlideIn 0.3s ease-out"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              background: "linear-gradient(135deg, #9333ea 0%, #3b82f6 50%, #ec4899 100%)",
              padding: "1.75rem 1.5rem",
              position: "relative"
            }}>
              <button
                onClick={() => !loading && setIsModalOpen(false)}
                disabled={loading}
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  background: "rgba(255, 255, 255, 0.2)",
                  border: "none",
                  borderRadius: "0.5rem",
                  width: "2rem",
                  height: "2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "background 0.2s",
                  color: "white",
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  opacity: loading ? 0.5 : 1
                }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)")}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"}
              >
                ×
              </button>
              <h2 style={{
                fontSize: "1.75rem",
                fontWeight: "bold",
                color: "white",
                margin: 0,
                paddingRight: "2.5rem"
              }}>
                Create New Event
              </h2>
              <p style={{
                color: "#e9d5ff",
                marginTop: "0.5rem",
                fontSize: "0.875rem",
                margin: "0.5rem 0 0 0"
              }}>
                Fill in the details below
              </p>
            </div>

            <div style={{ padding: "2rem 1.5rem" }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "0.5rem"
                }}>
                  Event Name
                </label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="Enter event name"
                  style={{
                    width: "100%",
                    padding: "0.875rem 1rem",
                    border: "2px solid #e5e7eb",
                    borderRadius: "0.75rem",
                    fontSize: "0.9375rem",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#9333ea"}
                  onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "0.5rem"
                }}>
                  Base Price
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    placeholder="0"
                    style={{
                      width: "100%",
                      padding: "0.875rem 1rem",
                      paddingRight: "5rem",
                      border: "2px solid #e5e7eb",
                      borderRadius: "0.75rem",
                      fontSize: "0.9375rem",
                      outline: "none",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                    onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                  />
                  <span style={{
                    position: "absolute",
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#6b7280",
                    fontWeight: "500",
                    fontSize: "0.875rem"
                  }}>
                    tokens
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "0.5rem"
                }}>
                  Sale End Date
                </label>
                <input
                  type="datetime-local"
                  value={saleEnd}
                  onChange={(e) => setSaleEnd(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.875rem 1rem",
                    border: "2px solid #e5e7eb",
                    borderRadius: "0.75rem",
                    fontSize: "0.9375rem",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#ec4899"}
                  onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                />
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "0.5rem"
                }}>
                  Ticket Count
                </label>
                <input
                  type="number"
                  value={ticketCount}
                  onChange={(e) => setTicketCount(e.target.value)}
                  placeholder="0"
                  style={{
                    width: "100%",
                    padding: "0.875rem 1rem",
                    border: "2px solid #e5e7eb",
                    borderRadius: "0.75rem",
                    fontSize: "0.9375rem",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#9333ea"}
                  onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                />
              </div>

              <div style={{ display: "flex", gap: "0.875rem" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: "0.875rem 1.5rem",
                    background: "#f3f4f6",
                    color: "#374151",
                    fontWeight: "600",
                    fontSize: "0.9375rem",
                    border: "none",
                    borderRadius: "0.875rem",
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "background-color 0.2s",
                    opacity: loading ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "#e5e7eb")}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#f3f4f6"}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={initEvent}
                  disabled={loading || !address}
                  style={{
                    flex: 1,
                    padding: "0.875rem 1.5rem",
                    background: loading || !address 
                      ? "#9ca3af"
                      : "linear-gradient(135deg, #9333ea 0%, #3b82f6 50%, #ec4899 100%)",
                    color: "white",
                    fontWeight: "600",
                    fontSize: "0.9375rem",
                    border: "none",
                    borderRadius: "0.875rem",
                    boxShadow: "0 4px 6px -1px rgba(147, 51, 234, 0.3)",
                    cursor: loading || !address ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                    opacity: loading || !address ? 0.5 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem"
                  }}
                  onMouseEnter={(e) => {
                    if (!loading && address) {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 8px 12px -1px rgba(147, 51, 234, 0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(147, 51, 234, 0.3)";
                  }}
                >
                  {loading ? "Creating..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </>
  );
}