import Clipboard from 'react-clipboard.js';
import styled from 'src/theme';

export const ClipboardStyled = styled(Clipboard)`
  margin-right: 16px;

  &:hover {
    cursor: pointer;
  }
`;

export const ControlsStyled = styled.div`
  min-width: 230px;
  display: flex;
  justify-content: flex-end;
`;

export const ButtonIconContainerStyled = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

export const HeaderContainerStyled = styled.div`
  background-color: #fff;
`;
