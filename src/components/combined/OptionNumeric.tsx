import React, { useState } from 'react';
import styled from 'styled-components';
import { connect, useStore } from 'react-redux';

import TextField from '@material-ui/core/TextField';


import { Option, ALL_OPTIONS } from 'core/util';
import { ChangeOptionState } from 'core/actions';
import { ValueType, RootState, DispatchType, OptionInputPropType, OptionPropType } from 'core/types';

import OptionDivider from 'components/parts/OptionDivider';
import OptionTitle from 'components/parts/OptionTitle';
import OptionCredit from 'components/parts/OptionCredit';
import OptionDescription from 'components/parts/OptionDescription';
import OptionRequires from 'components/parts/OptionRequires';
import OptionConflict from 'components/parts/OptionConflict';


const Container = styled.div`
display: flex;
flex-direction: row;
margin-left: 10px;
margin-bottom: 4px;
`;

const NumericContainer = styled.div`
margin-top: 12px;
margin-right: 8px;
width: 72px;
`;

const round = (num: number) => {
    return Math.round(num);
}

const getNumber = (elem: HTMLInputElement, max: number, setFocused: (x: boolean) => void, validate: boolean) => {
    setFocused(!validate);
    let value = parseFloat(elem.value);
    if (Number.isNaN(value)) {
        return false;
    }
    if (!validate) {
        return round(value);
    }
    if (value < 0) {
        value = 0;
    } else if (value > max) {
        value = max;
    }
    return round(value);
}

const OptionNumeric: React.FunctionComponent<OptionPropType> = (props) => {
    const { option_idx, valid, value, UpdateOptionValue } = props;
    let [ focused, setFocused ] = useState(false);
    let option: Option = ALL_OPTIONS[option_idx];
    let max = Infinity;
    let int_value = (typeof value === "number") ? round(value as number) : "";
    let state: RootState = useStore().getState();
    if (!focused) {
        if (option.type.length > 1) {
            max = (option.type[1] || 0) as number;
            if (max < 0) {
                max = state.variables[-(max + 1)].value;
            }
        }
        if (int_value !== "" && (int_value < 0 || int_value > max)) {
            if (int_value < 0) {
                int_value = 0;
            } else {
                int_value = max;
            }
            UpdateOptionValue(int_value);
        }
    }
    return (
        <div>
            <OptionDivider option={option}/>
            <Container>
                <NumericContainer>
                    <TextField type="number" variant="outlined" disabled={!valid}
                     inputProps={{style: {padding: 6}}} value={int_value}
                     onChange={e => UpdateOptionValue(getNumber(e.target as HTMLInputElement, max, setFocused, false))}
                     onBlur={e => UpdateOptionValue(getNumber(e.target as HTMLInputElement, max, setFocused, true))}/>
                </NumericContainer>
                <OptionTitle option={option} valid={valid}/>
                <OptionCredit option_idx={option_idx} affected={state.option[option_idx].affected} valid={valid}/>
            </Container>
            <OptionRequires option_idx={option_idx} state={state} valid={valid}/>
            <OptionConflict option_idx={option_idx} state={state} valid={valid}/>
            <OptionDescription option={option} valid={valid}/>
        </div>
    );
};

const mapStateToProps = (state: RootState, ownProps: OptionInputPropType) => ({
    value: state.option[ownProps.option_idx].value,
    valid: state.option[ownProps.option_idx].valid,
    valid_num: state.option[ownProps.option_idx].valid_num,
    update_val: state.option[ownProps.option_idx].update_val,
});

const mapDispatchToProps = (dispatch: DispatchType, ownProps: OptionInputPropType) => ({
    UpdateOptionValue: (value: ValueType) => dispatch(ChangeOptionState(ownProps.option_idx, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OptionNumeric);