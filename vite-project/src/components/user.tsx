import React from 'react'
import { styled } from 'styled-components';

const User: React.FC = ({ _id, email, send_id }: any) => {

    return (
        <Some>
            <Header>{email}</Header>
            <button onClick={() => send_id(_id)}>add</button>
        </Some>
    )
}
const Header = styled.h1`
  margin-bottom: 2rem;
  color: #ffffff;
  font-size: 16px;
  text-align: left;
  font-weight: 400;
`;
const Some = styled.div`
 display: flex;
 justify-content: space-around;
 column-gap: 2rem;
 align-items: center;
`;
export default User