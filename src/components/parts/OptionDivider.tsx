import React from 'react';
import styled from 'styled-components';

import Divider from '@material-ui/core/Divider';


import { Option } from 'core/util';


const DividerContainer = styled.div`
margin-top: 10px;
`;

const OptionDivider: React.FunctionComponent<{option: Option}> = (props) => {
    return (
        <>
            {props.option.is_parent && <DividerContainer><Divider/></DividerContainer>}
        </>
    );
};

export default OptionDivider;