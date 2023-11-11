import React from 'react';

import {
  Container,
  Content,
  EmailData,
  EmailTitle,
  GoBackButton,
  Header,
  HeaderTile,
  HeaderTop,
  Icon,
  NameData,
  NameTitle,
  PhotoButton,
  PhotoContainer,
  UserAvatar,
  UserEmailDetail,
  UserNameDetail,
} from './style';

import avatarDefault from '../../assets/avatar02.png';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/Form/Button';

interface ScreenNavigationProp {
  goBack: () => void;
  navigate: (screen: string) => void;
}

export const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const { goBack, navigate } = useNavigation<ScreenNavigationProp>();

  return (
    <Container>
      <Header>
        <HeaderTop>
          <GoBackButton onPress={goBack}>
            <Icon name="chevron-left" />
          </GoBackButton>
          <HeaderTile>Seu Perfil</HeaderTile>
        </HeaderTop>
        <PhotoContainer>
          <UserAvatar
            source={user.avatar_url ? { uri: user.avatar_url } : avatarDefault}
          />
          <PhotoButton>
            <Icon name="camera" />
          </PhotoButton>
        </PhotoContainer>
      </Header>
      <Content>
        <UserNameDetail>
          <NameTitle>NAME</NameTitle>
          <NameData>{user.name}</NameData>
        </UserNameDetail>

        <UserEmailDetail>
          <EmailTitle>EMAIL</EmailTitle>
          <EmailData>{user.email}</EmailData>
        </UserEmailDetail>

        <Button
          title="Editar dados do perfil"
          onPress={() => navigate('UserProfileEdit')}
        />
        <Button
          title="Trocar senha"
          onPress={() => navigate('UserProfilePassword')}
        />
      </Content>
    </Container>
  );
};
