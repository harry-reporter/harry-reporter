import Clipboard from 'react-clipboard.js';
import styled from 'src/theme';

export const ClipboardStyled = styled(Clipboard)`
  margin-right: 16px;

  &:hover {
    cursor: pointer;
  }
  color: rgb(106, 115, 125);
`;

export const HeaderStyled = styled.div`
  margin: -1px -1px 0;
  padding-top: 13px;
  padding-bottom: 14px;
`;
export const TextStyled = styled.span`
  line-height: 1.25;
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
  vertical-align: middle;
  color: rgb(106, 115, 125);
`;
