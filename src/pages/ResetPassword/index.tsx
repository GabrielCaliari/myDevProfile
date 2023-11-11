import React from 'react';
import {
  BackToSignIn,
  BackToSignInTitle,
  Container,
  Content,
  Icon,
  Logo,
  Title,
} from './styles';

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Button } from '../../components/Form/Button';
import logo from '../../assets/logo.png';
import { useNavigation } from '@react-navigation/native';
import { useForm, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { InputControl } from '../../components/Form/InputControl';
import { api } from '../../services/api';

export interface ScreenNavigationProp {
  navigate(screen: string): void;
}

interface IFormInputs {
  [name: string]: any;
}

const formSchema = yup.object({
  token: yup.string().uuid('Codigo inválido.').required('Informe o codigo.'),
  password: yup.string().required('Informe a nova senha.'),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Confirmação incorreta'),
});

export const ResetPassword: React.FC = () => {
  const { navigate } = useNavigation<ScreenNavigationProp>();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: yupResolver(formSchema),
  });

  const handleBackSignIn = () => {
    navigate('SignIn');
  };

  const handleResetPassword = async (form: IFormInputs) => {
    const data = {
      token: form.token,
      password: form.password,
      password_confirmation: form.password_confirmation,
    };

    try {
      await api.post('password/reset', data);
      Alert.alert('Senha redefinida', 'A senha foi redefinida, com sucesso.');
      navigate('SignIn');
    } catch (error) {
      Alert.alert(
        'Error ao resetar senha',
        'Ocorreu um erro ao resetar a senha. Tente novamente ',
      );
    }
  };

  return (
    <KeyboardAvoidingView
      enabled
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flex: 1 }}
      >
        <Container>
          <Content>
            <Logo source={logo} />
            <Title>Redefinir a senha</Title>
            <InputControl
              autoCapitalize="none"
              autoCorrect={false}
              control={control}
              name="token"
              placeholder="Código"
              error={errors.token && errors.name.message}
            />

            <InputControl
              control={control}
              name="password"
              placeholder="Nova senha"
              autoCorrect={false}
              secureTextEntry
              error={errors.password && errors.password.message}
            />
            <InputControl
              control={control}
              name="password_confirmation"
              placeholder="Confirme a senha"
              autoCorrect={false}
              secureTextEntry
              error={
                errors.password_confirmatio &&
                errors.password_confirmatio.message
              }
            />
            <Button
              title="Entrar"
              onPress={handleSubmit(handleResetPassword)}
            />
          </Content>
        </Container>
      </ScrollView>
      <BackToSignIn onPress={handleBackSignIn}>
        <Icon name="arrow-left" />
        <BackToSignInTitle>Voltar para o logIn</BackToSignInTitle>
      </BackToSignIn>
    </KeyboardAvoidingView>
  );
};
