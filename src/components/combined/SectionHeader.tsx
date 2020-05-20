import React from 'react';
import styled from 'styled-components';


const Title = styled.span`
margin-bottom: 10px;
margin-top: 10px;
font-size: 48px;
`;

const SectionHeader: React.FunctionComponent<{
    title: string,
}> = (props) => {
    return (
        <Title>{props.title}</Title>
    );
};

export default SectionHeader;