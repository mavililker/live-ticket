import React from "react";
import { Layout } from "@stellar/design-system";
import InitEvent from "../components/InitEvent";
import BuyTicket from "../components/BuyTicket";

const Home: React.FC = () => (
  <Layout.Content>
    <Layout.Inset>
      <div style={{
        background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 25%, #ddd6fe 50%, #fce7f3 75%, #fbcfe8 100%)",
        padding: "3rem 2rem",
        margin: "-2rem",
        minHeight: "calc(100vh - 80px)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}>
        <div style={{ 
          textAlign: "center", 
          marginBottom: "2.5rem",
          paddingTop: "1rem"
        }}>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            background: "linear-gradient(135deg, #9333ea 0%, #3b82f6 50%, #ec4899 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "0.5rem",
            margin: "0 0 0.75rem 0"
          }}>
            Live Ticket 
          </h1>
          <p style={{ 
            color: "#4b5563", 
            fontSize: "1.125rem",
            margin: 0
          }}>
            Create events and manage tickets seamlessly
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
          maxWidth: "1400px",
          margin: "0 auto"
        }}>
          <InitEvent />
          <BuyTicket />
        </div>

        <style>{`
          @media (max-width: 1024px) {
            div[style*="gridTemplateColumns: 1fr 1fr"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </Layout.Inset>
  </Layout.Content>
);

export default Home;