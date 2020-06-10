import React from 'react';
import styled from 'styled-components';

import Typography from '@material-ui/core/Typography';


import colors from 'constants/Color';
import { Option } from 'core/util';


const DescriptionContainer = styled.div`
margin-left: 10px;
`;

const Description = styled(Typography)<{valid: number}>`
color: ${props => props.valid ? colors.ValidText : colors.InvalidText};
`;

const OptionDescription: React.FunctionComponent<{option: Option, valid: boolean}> = (props) => {
    const string = props.option.details.split("\n").join("<br/>");
    return (
        <DescriptionContainer>
            <Description valid={+props.valid} dangerouslySetInnerHTML={{ __html: string }} />
        </DescriptionContainer>
    );
};

export default OptionDescription;