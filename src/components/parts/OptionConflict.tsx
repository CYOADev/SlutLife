import React from 'react';
import styled from 'styled-components';

import Typography from '@material-ui/core/Typography';


import colors from 'constants/Color';
import { Option, get_conf_checked } from 'core/util';
import { RootState } from 'core/types';


const ConflictContainer = styled.div<{valid: number}>`
display: flex;
flex-direction: row;
flex-wrap: wrap;
position: relative;
top: -10px;
margin-left: 10px;
font-size: 13px;
color: ${props => props.valid ? colors.ValidText : colors.InvalidText};
`

const ConflictText = styled(Typography)<{value: number}>`
color: ${props => props.value ? colors.UncheckedColor : colors.CheckedColor};
`;

const ConflictElement: React.FunctionComponent<{name: string, value: boolean}> = (props) => {
    return (
        <ConflictText value={+props.value}>{props.name}</ConflictText>
    );
};

const OptionConflict: React.FunctionComponent<{
    option: Option,
    state: RootState,
    valid: boolean,
}> = (props) => {
    const { option, state, valid } = props;
    const conflict_checked = get_conf_checked(option, state);
    const conflict_string = option.conflict_string || [];
    let result: JSX.Element[] = [];
    let elem_idx = 0;
    if (conflict_string.length > 0) {
        result.push(<span key={elem_idx++}>Conflict:&nbsp;</span>)
    }
    for (let i = 0; i < conflict_string.length; i++) {
        let conflict_string_elem = conflict_string[i];
        result.push((<ConflictElement name={conflict_string_elem} value={conflict_checked[i] as boolean} key={elem_idx++}/>))
        if (i !== conflict_string.length - 1) {
            result.push((<span key={elem_idx++}>,&nbsp;</span>))
        }
    }
    return (
        <ConflictContainer valid={+valid}>
            {result}
        </ConflictContainer>
    );
};

export default OptionConflict;