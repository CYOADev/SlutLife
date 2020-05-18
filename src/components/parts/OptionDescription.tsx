import React from 'react';
import styled from 'styled-components';


import colors from '../../constants/Color';
import { Option } from '../../core/util';


const DescriptionContainer = styled.div`
margin-left: 10px;
`

const Description = styled.span`
`;

const OptionDescription: React.FunctionComponent<{option: Option, valid: boolean}> = (props) => {
    const {option, valid} = props;
    return (
        <DescriptionContainer>
            <Description style={{color: valid ? colors.ValidText : colors.InvalidText}}>{ option.details }</Description>
        </DescriptionContainer>
    );
};

export default OptionDescription;