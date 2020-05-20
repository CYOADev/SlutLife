import React from 'react';
import styled from 'styled-components';


import colors from 'constants/Color';
import { Option } from 'core/util';


const DescriptionContainer = styled.div`
margin-left: 10px;
`

const Description = styled.span<{valid: number}>`
color: ${props => props.valid ? colors.ValidText : colors.InvalidText};
`;

const OptionDescription: React.FunctionComponent<{option: Option, valid: boolean}> = (props) => {
    return (
        <DescriptionContainer>
            <Description valid={+props.valid}>{ props.option.details }</Description>
        </DescriptionContainer>
    );
};

export default OptionDescription;