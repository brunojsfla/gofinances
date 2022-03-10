import React, { useState, useEffect } from "react";
import { Modal, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionTypes,
} from "./styles";
import { InputForm } from "../../components/Forms/InputForm";
import { Button } from "../../components/Forms/Button";
import { TransactionTypeButton } from "../../components/Forms/TransactionTypeButton";
import { CategorySelectButton } from "../../components/Forms/CategorySelectButton";
import { CategorySelect } from "../CategorySelect";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useForm } from "react-hook-form";

import AsyncStorage from "@react-native-async-storage/async-storage";

import uuid from "react-native-uuid";

import { useNavigation } from "@react-navigation/native";

interface FormData {
  [x: string]: any;
}

type NavigationProps = {
  navigate: (screen: string) => void;
};

const dataKey = "@gofinances:transactions";

const schema = yup.object().shape({
  name: yup.string().required("O Nome não foi informado."),
  amount: yup.number().positive().required("O Valor não foi informado."),
});

export function Register() {
  const [category, setCategory] = useState({
    key: "category",
    name: "Categoria",
  });
  const [transactionType, setTransactionType] = useState("");
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigation = useNavigation<NavigationProps>();

  const handleTransactionTypesSelect = (type: "positive" | "negative") => {
    setTransactionType(type);
  };

  const handleOpenSelectCategoryModal = () => {
    setCategoryModalOpen(true);
  };

  const handleCloseSelectCategoryModal = () => {
    setCategoryModalOpen(false);
  };

  const handleRegister = async (form: FormData) => {
    if (!transactionType) return Alert.alert("Selecione o tipo da transação.");

    if (category.key === "category")
      return Alert.alert("Selecione a categoria.");

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date(),
    };

    try {
      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];

      const dataFormatted = [...currentData, newTransaction];
      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

      reset();
      setTransactionType("");
      setCategory({
        key: "category",
        name: "Categoria",
      });

      navigation.navigate("Listagem");
    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possível salvar os dados!");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>
        <Form>
          <Fields>
            <InputForm
              name="name"
              placeholder="Nome"
              control={control}
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm
              name="amount"
              placeholder="Preço"
              control={control}
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />
            <TransactionTypes>
              <TransactionTypeButton
                title="Income"
                type="up"
                onPress={() => handleTransactionTypesSelect("positive")}
                isActive={transactionType === "positive"}
              />
              <TransactionTypeButton
                title="Outcome"
                type="down"
                onPress={() => handleTransactionTypesSelect("negative")}
                isActive={transactionType === "negative"}
              />
            </TransactionTypes>
            <CategorySelectButton
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            ></CategorySelectButton>
          </Fields>
          <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
        </Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}
