// NOT IMPLEMENTED YET


import React from 'react';
import styled from 'styled-components';

import TextField from '@material-ui/core/TextField';

const Container = styled.div`
display: flex;
flex-direction: row;
`;

const SelectContainer = styled.div`
margin-top: 6px;
margin-right: 8px;
width: 64px;
`;

const Title = styled.h3`
margin-bottom: 10px;
margin-top: 10px;
font-size: 24px;
`;

const Credit = styled.span`
font-size: 20px;
margin-top: 13px;
margin-left: 10px;
`;

const Description = styled.span`
margin-left: 10px;
`;

const OptionNumeric: React.FunctionComponent<{
    title: string,
    desc: string,
    cred: number,
}> = (props) => {
    return (
        <div>
            <Container>
                <SelectContainer>
                    <TextField type="number" variant="outlined" inputProps={{style: {
                        padding: 8, fontSize: 18
                    }}}/>
                </SelectContainer>
                <Title>{ props.title }</Title>
                <Credit>{ props.cred }</Credit>
            </Container>
            <Description>{ props.desc }</Description>
        </div>
    );
};

export default OptionNumeric;