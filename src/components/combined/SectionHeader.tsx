import React from 'react';
import styled from 'styled-components';

import Typography from '@material-ui/core/Typography';


const Title = styled(Typography)`
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