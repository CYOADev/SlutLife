import React from 'react';
import styled from 'styled-components';

import Typography from '@material-ui/core/Typography';


import colors from 'constants/Color';
import { Option } from 'core/util';


const Title = styled(Typography)<{valid: number}>`
margin-bottom: 10px;
margin-top: 10px;
font-size: 24px;
color: ${props => props.valid ? colors.ValidText : colors.InvalidText};
`;

const OptionTitle: React.FunctionComponent<{option: Option, valid: boolean}> = (props) => {
    return (
        <Title valid={+props.valid}>{ props.option.name }</Title>
    );
};

export default OptionTitle;