LiveTicket – Dynamic Price Ticketing on Stellar

A real-time, blockchain-based ticketing protocol powered by Stellar Soroban smart contracts, featuring dynamic pricing, anti-scalping design, and instant ownership verification via on-chain storage.

The system consists of:

1.	TicketManager Contract – manages events, ownership, counts
2.	Frontend (React) – users can create events and buy tickets
3.	Wallet integration (Freighter)
4.	Testnet or local Soroban backend

```text
Core Ticket Features
	•	Create events with: init(event_name,base_price,sale_end,ticket_count)
	•	Buy ticket (auto-increment ticket ID)
	•	Remaining ticket counter updated on-chain
	•	Ownership stored in contract instance storage
	•	Prevents buying if:
	•	no tickets left
	•	sale period ended

    All read directly from instance storage:
	•	get_ticket_left()
	•	get_last_current_price()
	•	get_ticket_owner(ticket_id)
```
 
## Project Structure

```text
live-ticket
├── live-ticket-app             # React frontend (Stellar Wallet Kit + contract client)
│   ├── src
│   │   ├── components
│   │   ├── contracts
│   │   ├── hooks
│   │   └── pages
│   ├── public
│   └── package.json
├── contracts                   # Soroban smart contracts
│   └── ticket-manager
│       ├── src
│       │   ├── lib.rs
│       │   └── test.rs
│       └── Cargo.toml
├── Cargo.toml                  # Workspace root
└── README.md
```
