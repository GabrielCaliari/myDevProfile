import React, { useState } from 'react';
import {
  Container,
  Content,
  CreateAccount,
  CreateAccountTitle,
  ForgotPasswordButton,
  ForgotPasswordTitle,
  IconEye,
  IconLogin,
  Logo,
  PassWord,
  Title,
} from './styles';

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInputProps,
  View,
} from 'react-native';
import { Button } from '../../components/Form/Button';
import logo from '../../assets/logo.png';
import { useNavigation } from '@react-navigation/native';
import { useForm, FieldValues } from 'react-hook-form';
import { InputControl } from '../../components/Form/InputControl';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';

interface ScreenNavigationProp {
  navigate: (screen: string) => void;
}

interface IFormInputs {
  [name: string]: any;
}
interface InputProps extends TextInputProps {
  secureTextEntry?: boolean;
}

const formSchema = yup.object({
  email: yup.string().email('Email inválido.').required('Informe o email.'),
  password: yup.string().required('Informe a senha.'),
});

export const SignIn = ({ secureTextEntry }: InputProps) => {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentSecure, setCurrentSecure] = useState<boolean>(
    !!secureTextEntry,
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: yupResolver(formSchema),
  });
  const { navigate } = useNavigation<ScreenNavigationProp>();

  const handleCreateAccount = () => {
    navigate('SignUp');
  };

  const handleSignIn = (form: IFormInputs) => {
    const data = {
      email: form.email,
      password: form.password,
    };
    try {
      setLoading(true);
      signIn(data);
    } catch (error) {
      Alert.alert(
        'Erro na autenticação',
        'Ocorreu um erro ao fazer o login, verifique as credenciais',
      );
    }
  };

  const handleOnPressEye = () => {
    setCurrentSecure(current => !current);
  };

  return (
    <KeyboardAvoidingView
      enabled
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <Container>
          <Content>
            <Logo source={logo} />
            <View>
              <Title>Faça seu login</Title>
            </View>
            <InputControl
              autoCapitalize="none"
              autoCorrect={false}
              control={control}
              name="email"
              placeholder="Email"
              keyboardType="email-address"
              error={errors.email && errors.email.message}
            />
            <PassWord>
              <InputControl
                control={control}
                name="password"
                placeholder="Senha"
                autoCorrect={false}
                secureTextEntry={currentSecure}
                error={errors.password && errors.password.message}
              />
              <IconEye
                onPress={handleOnPressEye}
                name={currentSecure ? 'eye' : 'eye-off'}
                size={20}
                color="white"
              />
            </PassWord>
            <Button
              title="Entrar"
              disabled={loading || errors.email || errors.password}
              onPress={handleSubmit(handleSignIn)}
            />

            <ForgotPasswordButton onPress={() => navigate('ForgotPassword')}>
              <ForgotPasswordTitle>Esqueci minha senha</ForgotPasswordTitle>
            </ForgotPasswordButton>
          </Content>
        </Container>
      </ScrollView>
      <CreateAccount onPress={handleCreateAccount}>
        <IconLogin name="log-in" />
        <CreateAccountTitle>Criar uma conta</CreateAccountTitle>
      </CreateAccount>
    </KeyboardAvoidingView>
  );
};
