import styled from 'src/theme';

export const NavStyled = styled.div`
  width: ${(p) => p.width};
`;

export const NavItemStyled = styled.div`
  &:hover {
    cursor: pointer;
  }
`;
