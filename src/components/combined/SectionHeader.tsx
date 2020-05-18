import React from 'react';
import styled from 'styled-components';


const Container = styled.div`
`;

const Title = styled.h3`
margin-bottom: 10px;
margin-top: 10px;
font-size: 48px;
`;

const SectionHeader: React.FunctionComponent<{
    title: string,
}> = (props) => {
    return (
        <div>
            <Container>
                <Title>{props.title}</Title>
            </Container>
        </div>
    );
};

export default SectionHeader;