import React from 'react';
import styled from 'styled-components';


import colors from 'constants/Color';
import { Option } from 'core/util';


const Credit = styled.span`
font-size: 20px;
margin-top: 13px;
margin-left: 10px;
`;

const OptionCredit: React.FunctionComponent<{option: Option, valid: boolean}> = (props) => {
    const {option, valid} = props;
    return (
        <Credit style={{color: valid ? colors.ValidText : colors.InvalidText}}>{ option.credits }</Credit>
    );
};

export default OptionCredit;