import React from 'react';
import styled from 'styled-components';

import Typography from '@material-ui/core/Typography';


import colors from 'constants/Color';
import { ALL_OPTIONS, get_requ_checked } from 'core/util';
import { RootState } from 'core/types';


const RequiresContainer = styled.div<{valid: number}>`
display: flex;
flex-direction: row;
flex-wrap: wrap;
position: relative;
top: -10px;
margin-left: 10px;
color: ${props => props.valid ? colors.ValidText : colors.InvalidText};
`;

const RequiresGroupContainer = styled.div`
display: flex;
flex-direction: row;
flex-wrap: wrap;
`;

const NormalText = styled(Typography)`
font-size: 13px;
`

const RequiresText = styled(Typography)<{value: number}>`
font-size: 13px;
color: ${props => props.value ? colors.CheckedColor : colors.UncheckedColor};
`;

const RequiresElement: React.FunctionComponent<{name: string, value: boolean}> = (props) => {
    return (
        <RequiresText value={+props.value}>{props.name}</RequiresText>
    );
};

const RequiresGroup: React.FunctionComponent<{names: string[], values: boolean[]}> = (props) => {
    const { names, values } = props;
    let result: JSX.Element[] = [];
    let elem_idx = 0;
    for (let i = 0; i < names.length; i++) {
        result.push((<RequiresElement name={names[i]} value={values[i]} key={elem_idx++}/>));
        if (i !== names.length - 1) {
            result.push((<NormalText key={elem_idx++}>&nbsp;/&nbsp;</NormalText>))
        }
    }
    return (
        <RequiresGroupContainer>
            <NormalText>(</NormalText>
            {result}
            <NormalText>)</NormalText>
        </RequiresGroupContainer>
    );
};

const OptionRequires: React.FunctionComponent<{
    option_idx: number,
    state: RootState,
    valid: boolean,
}> = (props) => {
    const { option_idx, state, valid } = props;
    const option = ALL_OPTIONS[option_idx];
    const requires_checked = get_requ_checked(option_idx, state);
    const requires_string = option.requires_string || [];
    let result: JSX.Element[] = [];
    let elem_idx = 0;
    if (requires_string.length > 0) {
        result.push(<NormalText key={elem_idx++}>Requires:&nbsp;</NormalText>)
    }
    for (let i = 0; i < requires_string.length; i++) {
        let requires_string_elem = requires_string[i];
        if (typeof requires_string_elem === "string") {
            result.push((<RequiresElement name={requires_string_elem} value={requires_checked[i] as boolean} key={elem_idx++}/>))
        } else if (typeof requires_string_elem === "object") {
            result.push((<RequiresGroup names={requires_string_elem} values={requires_checked[i] as boolean[]} key={elem_idx++}/>))
        }
        if (i !== requires_string.length - 1) {
            result.push((<NormalText key={elem_idx++}>,&nbsp;</NormalText>))
        }
    }
    return (
        <RequiresContainer valid={+valid}>
            {result}
        </RequiresContainer>
    );
};

export default OptionRequires;