import React from 'react';
import { Container, Title } from './styles';
import { TouchableOpacityProps } from 'react-native';

interface ButttonProps extends TouchableOpacityProps {
  title: string;
}

export const Button: React.FC<ButttonProps> = ({ title, ...otherProps }) => {
  return (
    <Container {...otherProps}>
      <Title>{title}</Title>
    </Container>
  );
};
