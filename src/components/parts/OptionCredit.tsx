import React from 'react';
import styled from 'styled-components';


import colors from 'constants/Color';
import { Option } from 'core/util';


const Credit = styled.span<{valid: number}>`
font-size: 20px;
margin-top: 13px;
margin-left: 10px;
color: ${props => props.valid ? colors.ValidText : colors.InvalidText};
`;

const OptionCredit: React.FunctionComponent<{option: Option, valid: boolean}> = (props) => {
    return (
        <Credit valid={+props.valid}>{ props.option.credits }</Credit>
    );
};

export default OptionCredit;