import React, { useState, useEffect, useCallback } from "react";

import { HighlightCard } from "../../components/HighlightCard";
import { TransactionCard, CardProps } from "../../components/TransactionCard";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

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
  const dataKey = "@gofinances:transactions";

  const [transactionCard, setTransactionCard] = useState<
    TransactionCardListProps[]
  >([]);

  async function getTransactions() {
    const data = await AsyncStorage.getItem(dataKey);
    const transactions = data ? JSON.parse(data) : [];

    const transactionsFormatted: TransactionCardListProps[] = transactions.map(
      (item: TransactionCardListProps) => {
        const amount = Number(item.amount).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        const date = Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(new Date(item.date));

        return {
          id: item.id,
          name: item.name,
          amount,
          category: item.category,
          date,
          type: item.type
        };
      }
    );
    console.log(transactionsFormatted);
    setTransactionCard(transactionsFormatted);
  }

  useEffect(() => {
    getTransactions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getTransactions();
    }, [])
  );

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
          data={transactionCard}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />
      </Transactions>
    </Container>
  );
}
