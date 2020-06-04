import React from 'react';
import styled from 'styled-components';

import Typography from '@material-ui/core/Typography';


import colors from 'constants/Color';
import { ALL_OPTIONS, calc_affected } from 'core/util';


const Credit = styled(Typography)<{valid: number}>`
font-size: 20px;
margin-top: 13px;
margin-left: 10px;
color: ${props => props.valid ? colors.ValidText : colors.InvalidText};
`;

const OptionCredit: React.FunctionComponent<{option_idx: number, affected: [number, number][], valid: boolean}> = (props) => {
    let credits = calc_affected(ALL_OPTIONS[props.option_idx].credits, props.affected);
    return (
        <Credit valid={+props.valid}>{ credits }</Credit>
    );
};

export default OptionCredit;