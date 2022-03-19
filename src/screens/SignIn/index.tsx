import React, { useState } from "react";
import { ActivityIndicator, Platform } from "react-native";
import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SigInTitle,
  Footer,
  FooterWrapper,
} from "./styles";

import AppleSvg from "../../assets/apple.svg";
import GoogleSvg from "../../assets/google.svg";
import LogoSvg from "../../assets/logo.svg";
import { RFValue } from "react-native-responsive-fontsize";

import { SignInSocialButton } from "../../components/SigInSocialButton";
import { useAuth } from "../../hooks/auth";
import { Alert } from "react-native";
import { useTheme } from "styled-components/native";

export function SignIn() {
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle, signInWithApple } = useAuth();
  const { colors } = useTheme();

  async function handleSignInWithGoogle() {
    try {
      setLoading(true);
      return await signInWithGoogle();
    } catch (error) {
      console.log(error);
      Alert.alert("Falha ao conectar à conta Google.");
      setLoading(false);
    }
  }

  async function handleSignInWithApple() {
    try {
      setLoading(true);
      return await signInWithApple();
    } catch (error) {
      console.log(error);
      Alert.alert("Falha ao conectar à conta Apple.");
      setLoading(false);
    }
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg width={RFValue(120)} height={RFValue(68)} />
          <Title>
            Controle suas {"\n"} finanças de forma {"\n"} muito simples
          </Title>
        </TitleWrapper>

        <SigInTitle>Faça seu login com {"\n"} uma das contas abaixo</SigInTitle>
      </Header>
      <Footer>
        <FooterWrapper>
          <SignInSocialButton
            title="Entrar com Google"
            svg={GoogleSvg}
            onPress={handleSignInWithGoogle}
          />
          {Platform.OS === "ios" && (
            <SignInSocialButton
              title="Entrar com Apple"
              svg={AppleSvg}
              onPress={handleSignInWithApple}
            />
          )}
        </FooterWrapper>
        {loading && (
          <ActivityIndicator
            color={colors.background}
            size={"large"}
            style={{ marginTop: RFValue(18) }}
          />
        )}
      </Footer>
    </Container>
  );
}
