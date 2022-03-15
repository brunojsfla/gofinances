import React, { useState, useEffect, useCallback } from "react";

import { ActivityIndicator } from "react-native";
import { useTheme } from "styled-components";

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
  LoadData,
} from "./styles";
import { color } from "react-native-reanimated";

export interface TransactionCardListProps extends CardProps {
  id: string;
}

interface HighlightProps {
  total: string;
  lastTransaction: string;
}
interface HighlightData {
  entries: HighlightProps;
  expensives: HighlightProps;
  balance: HighlightProps;
}

export function Dashboard() {
  const months = [
    {
      id: 0,
      name: "janeiro",
    },
    {
      id: 1,
      name: "fevereiro",
    },
    {
      id: 2,
      name: "março",
    },
    {
      id: 3,
      name: "abril",
    },
    {
      id: 4,
      name: "maio",
    },
    {
      id: 5,
      name: "junho",
    },
    {
      id: 6,
      name: "julho",
    },
    {
      id: 7,
      name: "agosto",
    },
    {
      id: 8,
      name: "setembro",
    },
    {
      id: 9,
      name: "outubro",
    },
    {
      id: 10,
      name: "novembro",
    },
    {
      id: 11,
      name: "dezembro",
    },
  ];

  const dataKey = "@gofinances:transactions";

  const [transactionCard, setTransactionCard] = useState<
    TransactionCardListProps[]
  >([]);

  const [highlightData, setHighlightData] = useState<HighlightData>(
    {} as HighlightData
  );

  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  function getLastTransactionDate(
    collection: TransactionCardListProps[],
    transactionType: "positive" | "negative"
  ) {
    const lastTransactions = new Date(
      Math.max.apply(
        Math,
        collection
          .filter((transaction) => transaction.type === transactionType)
          .map((transaction) => new Date(transaction.date).getTime())
      )
    );

    const monthFormatted = months
      .filter((month) => month.id === lastTransactions.getMonth())
      .map((month) => month.name);

    return isNaN(lastTransactions.getTime())
      ? false
      : `${lastTransactions.getDate()} de ${monthFormatted}`;
  }

  async function getTransactions() {
    const data = await AsyncStorage.getItem(dataKey);
    const transactions = data ? JSON.parse(data) : [];

    let entriesTotal = 0;
    let expensiveTotal = 0;

    const transactionsFormatted: TransactionCardListProps[] = transactions.map(
      (item: TransactionCardListProps) => {
        if (item.type === "positive") {
          entriesTotal += Number(item.amount);
        } else {
          expensiveTotal += Number(item.amount);
        }

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
          type: item.type,
        };
      }
    );

    setTransactionCard(transactionsFormatted);

    const lastTransactionsEntries = getLastTransactionDate(
      transactions,
      "positive"
    );
    const lastTransactionsExpensives = getLastTransactionDate(
      transactions,
      "negative"
    );

    const totalInterval = `01 à ${lastTransactionsExpensives}`;

    setHighlightData({
      entries: {
        total: entriesTotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: !lastTransactionsEntries
          ? ""
          : `Última entrada dia ${lastTransactionsEntries}`,
      },
      expensives: {
        total: expensiveTotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: !lastTransactionsExpensives
          ? ""
          : `Última saída dia ${lastTransactionsExpensives}`,
      },
      balance: {
        total: Number(entriesTotal - expensiveTotal).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: totalInterval,
      },
    });

    setLoading(false);
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
      {loading && (
        <LoadData>
          <ActivityIndicator size="large" color={colors.primary} />
        </LoadData>
      )}
      {!loading && (
        <>
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
              amount={highlightData.entries.total}
              lastTransaction={highlightData.entries.lastTransaction}
              type="up"
            />
            <HighlightCard
              title="Saídas"
              amount={highlightData.expensives.total}
              lastTransaction={highlightData.expensives.lastTransaction}
              type="down"
            />
            <HighlightCard
              title="Total"
              amount={highlightData.balance.total}
              lastTransaction={highlightData.balance.lastTransaction}
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
        </>
      )}
    </Container>
  );
}
