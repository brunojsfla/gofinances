import React from "react";

import { HighlightCard } from "../../components/HighlightCard";
import { TransactionCard, CardProps } from "../../components/TransactionCard";

import {
  Container,
  Header,
  UserWraper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
} from "./styles";

export interface TransactionCardListProps extends CardProps {
  id: string;
}

export function Dashboard() {
  const data: TransactionCardListProps[] = [
    {
      id: "1",
      type: "positive",
      title: "Bugs Courart",
      amount: "R$ 1.000,00",
      category: { name: "Trabalho", icon: "dollar-sign" },
      date: "28/02/2022",
    },
    {
      id: "2",
      type: "negative",
      title: "Prestação AP",
      amount: "R$ 1.000,00",
      category: { name: "Fixo", icon: "shopping-bag" },
      date: "28/02/2022",
    },
    {
      id: "3",
      type: "positive",
      title: "Bugs Courart",
      amount: "R$ 1.000,00",
      category: { name: "Trabalho", icon: "dollar-sign" },
      date: "28/02/2022",
    },
  ];
  return (
    <Container>
      <Header>
        <UserWraper>
          <UserInfo>
            <Photo
              source={{
                uri: "https://avatars.githubusercontent.com/u/42036434?v=4",
              }}
            />
            <User>
              <UserGreeting>Olá,</UserGreeting>
              <UserName>Bruno!</UserName>
            </User>
          </UserInfo>
          <LogoutButton onPress={() => {}}>
            <Icon name="power" />
          </LogoutButton>
        </UserWraper>
      </Header>

      <HighlightCards>
        <HighlightCard
          title="Entradas"
          amount="R$ 15.000,00"
          lastTransaction="Última entrada dia 13 de abril"
          type="up"
        />
        <HighlightCard
          title="Saídas"
          amount="R$ 1.000,00"
          lastTransaction="Última saída dia 13 de abril"
          type="down"
        />
        <HighlightCard
          title="Total"
          amount="R$ 14.000,00"
          lastTransaction="Saldo do mês de fevereiro"
          type="total"
        />
      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>
        <TransactionList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />
      </Transactions>
    </Container>
  );
}
