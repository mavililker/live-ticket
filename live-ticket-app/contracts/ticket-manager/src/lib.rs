#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, log};

#[contract]
pub struct TicketManager;

#[derive(Clone)]
#[contracttype]
pub struct Config {
    pub organizer: Address,
    pub base_price: u32,
    pub sale_end: u64,
    pub ticket_count: u32,
    pub event_name: String,
}   

#[derive(Clone)]
#[contracttype]
pub struct Ticket {
    pub id: u32,
    pub owner: Address,
    pub purchase_time: u64,
    pub purchase_price: u32,
    pub event_name: String,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Config,
    TicketLeft,
    LastTicketId,
    CurrentPrice,
    TicketOwner(u32),
    TicketData(u32),
}

#[contractimpl]
impl TicketManager {
    pub fn init(
        env: Env,
        organizer: Address,
        base_price: u32,
        event_name: String,
        sale_end: u64,
        ticket_count: u32,
    )
    {
        let storage = env.storage().instance();

        /*
        if storage.has(&DataKey::Config) {
            panic!("already initialized");
        }
        */

        let config = Config {
            organizer,
            base_price,
            sale_end,
            ticket_count,
            event_name,
        };

        storage.set(&DataKey::Config, &config);


        storage.set(&DataKey::TicketLeft, &ticket_count);
        storage.set(&DataKey::LastTicketId, &0u32);
        storage.set(&DataKey::CurrentPrice, &base_price);
        log!(&env, "Event initialized: {}, Total tickets: {}", config.event_name , ticket_count);
    }
    
   pub fn buy_ticket(env: Env, buyer: Address) -> Ticket {
        buyer.require_auth();

        let storage = env.storage().instance();

        let config: Config = read_config(&env);
        let current_time = env.ledger().timestamp();

        if current_time > config.sale_end {
            panic!("ticket sale ended");
        }

        let mut ticket_left: u32 = read_ticket_left(&env);
        if ticket_left == 0 {
            panic!("no tickets left");
        }

        let price = read_last_current_price(&env); // Şimdilik base_price kullanılıyor
        // 6) Ödeme işlemini burada yap (bu örnekte atlanıyor)
        log!(&env, "Payment required: {} XLM for ticket", price);

        let last_ticket_id: u32 = read_last_ticket_id(&env);
        storage.set(&DataKey::LastTicketId, &(last_ticket_id + 1));

        let ticket = Ticket {
            id:last_ticket_id,
            owner: buyer.clone(),
            purchase_time: current_time,
            purchase_price: price,
            event_name: config.event_name.clone(),
        };

        let storage = env.storage().instance();
        storage.set(&DataKey::TicketOwner(last_ticket_id), &buyer);
        storage.set(&DataKey::TicketData(last_ticket_id), &ticket);

        ticket_left -= 1;


        let mut new_price = price * 102 / 100; // %2 arttır

        let max_price = config.base_price * 2;
        if new_price > max_price {
            new_price = max_price;
        }

        storage.set(&DataKey::CurrentPrice, &new_price);
        storage.set(&DataKey::TicketLeft, &ticket_left);
        

        ticket
    }

    pub fn get_ticket_left(env: Env) -> u32 {
        read_ticket_left(&env)
    }

    pub fn get_last_current_price(env: Env) -> u32 {
        read_last_current_price(&env)
    }

    pub fn get_ticket_owner(env: Env, ticket_id: u32) -> Address {
        let storage = env.storage().instance();
        storage
            .get(&DataKey::TicketOwner(ticket_id))
            .unwrap_or_else(|| panic!("ticket not found"))
    }
}

fn read_config(env: &Env) -> Config {
    let storage = env.storage().instance();
    storage
        .get(&DataKey::Config)
        .unwrap_or_else(|| panic!("not initialized"))
}



fn read_ticket_left(env: &Env) -> u32 {
    let storage = env.storage().instance();
    storage.get(&DataKey::TicketLeft).unwrap_or(0u32)
}

fn read_last_ticket_id(env: &Env) -> u32 {
    let storage = env.storage().instance();
    storage.get(&DataKey::LastTicketId).unwrap_or(0u32)
}

fn read_last_current_price(env: &Env) -> u32 {
    let storage = env.storage().instance();
    storage.get(&DataKey::CurrentPrice).unwrap_or(0u32)
}

mod test;
