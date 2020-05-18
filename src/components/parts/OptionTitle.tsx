import React from 'react';
import styled from 'styled-components';


import colors from '../../constants/Color';
import { Option } from '../../core/util';


const Title = styled.h3`
margin-bottom: 10px;
margin-top: 10px;
font-size: 24px;
`;

const OptionTitle: React.FunctionComponent<{option: Option, valid: boolean}> = (props) => {
    const {option, valid} = props;
    return (
        <Title style={{color: valid ? colors.ValidText : colors.InvalidText}}>{ option.name }</Title>
    );
};

export default OptionTitle;