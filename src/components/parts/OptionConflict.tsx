import React from 'react';
import styled from 'styled-components';

import Typography from '@material-ui/core/Typography';


import colors from 'constants/Color';
import { ALL_OPTIONS, get_conf_checked } from 'core/util';
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

const NormalText = styled(Typography)`
font-size: 13px;
`

const ConflictText = styled(Typography)<{value: number}>`
font-size: 13px;
color: ${props => props.value ? colors.UncheckedColor : colors.CheckedColor};
`;

const ConflictElement: React.FunctionComponent<{name: string, value: boolean}> = (props) => {
    return (
        <ConflictText value={+props.value}>{props.name}</ConflictText>
    );
};

const OptionConflict: React.FunctionComponent<{
    option_idx: number,
    state: RootState,
    valid: boolean,
}> = (props) => {
    const { option_idx, state, valid } = props;
    const option = ALL_OPTIONS[option_idx];
    const conflict_checked = get_conf_checked(option_idx, state);
    const conflict_string = option.conflict_string || [];
    let result: JSX.Element[] = [];
    let elem_idx = 0;
    if (conflict_string.length > 0) {
        result.push(<NormalText key={elem_idx++}>Conflict:&nbsp;</NormalText>)
    }
    for (let i = 0; i < conflict_string.length; i++) {
        let conflict_string_elem = conflict_string[i];
        result.push((<ConflictElement name={conflict_string_elem} value={conflict_checked[i] as boolean} key={elem_idx++}/>))
        if (i !== conflict_string.length - 1) {
            result.push((<NormalText key={elem_idx++}>,&nbsp;</NormalText>))
        }
    }
    return (
        <ConflictContainer valid={+valid}>
            {result}
        </ConflictContainer>
    );
};

export default OptionConflict;