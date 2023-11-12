import React, { useState } from 'react';
import {
  Container,
  GoBackButton,
  Icon,
  HeaderTile,
  UserAvatar,
  Content,
  Title,
  Header,
  IconEye,
} from './styles';

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInputProps,
} from 'react-native';
import { Button } from '../../components/Form/Button';

import { useNavigation } from '@react-navigation/native';
import { useForm, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { InputControl } from '../../components/Form/InputControl';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import avatarDefault from '../../assets/avatar02.png';
import { PassWord } from '../SignIn/styles';

export interface ScreenNavigationProp {
  goBack: () => void;
}

interface IFormInputs {
  [name: string]: any;
}

interface InputProps extends TextInputProps {
  secureTextEntry?: boolean;
}

const formSchema = yup.object({
  old_password: yup.string().required('Campo obrigatório.'),
  password: yup.string().required('Campo obrigatório'),
  password_confirmation: yup
    .string()
    .required('')
    .oneOf([yup.ref('password'), null], 'Confirmação incorreta'),
});

export const UserProfilePassword: React.FC = ({
  secureTextEntry,
}: InputProps) => {
  const { user, updateUser } = useAuth();
  const { goBack } = useNavigation<ScreenNavigationProp>();
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

  const handleUpdatePasswordEdit = async (form: IFormInputs) => {
    const data = {
      name: user.name,
      email: user.email,
      old_password: form.old_password,
      password: form.password,
      password_confirmation: form.password_confirmation,
    };

    try {
      const response = await api.put('profile', data);
      updateUser(response.data);
      Alert.alert('Senha atualizada', 'Senha atualizada com sucesso');
      goBack();
    } catch (error) {
      Alert.alert('Erro ao atualizar', 'Ocorreu um erro ao atualizar a senha.');
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
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flex: 1 }}
      >
        <Container>
          <Header>
            <GoBackButton onPress={goBack}>
              <Icon name="chevron-left" />
            </GoBackButton>
            <HeaderTile>Seu perfil</HeaderTile>
            <UserAvatar
              source={
                user.avatar_url ? { uri: user.avatar_url } : avatarDefault
              }
            />
          </Header>
          <Content>
            <Title> Altera senha</Title>
            <InputControl
              autoCapitalize="none"
              autoCorrect={false}
              control={control}
              secureTextEntry
              name="old_password"
              placeholder="Senha atual"
              error={errors.old_password && errors.old_password.message}
            />
            <InputControl
              autoCapitalize="none"
              autoCorrect={false}
              control={control}
              secureTextEntry
              name="password"
              placeholder="Nova senha"
              error={errors.password && errors.password.message}
            />
            <PassWord>
              <InputControl
                autoCapitalize="none"
                autoCorrect={false}
                control={control}
                secureTextEntry={currentSecure}
                name="password_confirmation"
                placeholder="Confirmar senha"
                error={
                  errors.password_confirmation &&
                  errors.password_confirmation.message
                }
              />
              <IconEye
                onPress={handleOnPressEye}
                name={currentSecure ? 'eye' : 'eye-off'}
                size={20}
                color="white"
              />
            </PassWord>
            <Button
              title="Salvar alterações"
              onPress={handleSubmit(handleUpdatePasswordEdit)}
              disabled={
                !!errors.old_password ||
                !!errors.password ||
                !!errors.password_confirmation
              }
            />
          </Content>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
