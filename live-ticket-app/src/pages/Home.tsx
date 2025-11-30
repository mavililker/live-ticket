import React from "react";
import { Code, Layout, Text } from "@stellar/design-system";
import { GuessTheNumber } from "../components/GuessTheNumber";
import InitEvent from "../components/InitEvent";
import BuyTicket from "../components/BuyTicket";

const Home: React.FC = () => (
  <Layout.Content>
    <Layout.Inset>
      <InitEvent />
      <BuyTicket />
    </Layout.Inset>
  </Layout.Content>
);

export default Home;
