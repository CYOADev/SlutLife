import React from 'react';
import styled from 'styled-components';

import { Divider } from '@material-ui/core';


import { Option } from '../../core/util';


const DividerContainer = styled.div`
margin-top: 10px;
`

const OptionDivider: React.FunctionComponent<{option: Option}> = (props) => {
    const {option} = props;
    return (
        <div>
            {option.is_parent && <DividerContainer><Divider/></DividerContainer>}
        </div>
    );
};

export default OptionDivider;