import React from 'react';
import styled from 'styled-components';

import { Box, TextField } from '@material-ui/core';

import { connect, useStore } from 'react-redux';


import { Option, ALL_OPTIONS } from '../../core/util';
import { ChangeOptionState } from '../../core/actions';
import { ValueType, RootState, DispatchType, OptionInputPropType, OptionPropType } from '../../core/types';

import OptionDivider from '../parts/OptionDivider';
import OptionTitle from '../parts/OptionTitle';
import OptionCredit from '../parts/OptionCredit';
import OptionDescription from '../parts/OptionDescription';
import OptionRequires from '../parts/OptionRequires';
import OptionConflict from '../parts/OptionConflict';


const Container = styled(Box)`
display: flex;
flex-direction: row;
margin-left: 10px;
margin-bottom: 4px;
`;

const NumericContainer = styled.div`
margin-top: 8px;
margin-left: 8px;
width: 72px;
`;

const round = (num: number) => {
    return Math.round(num);
}

const getNumber = (elem: HTMLInputElement, max: number) => {
    let value = parseFloat(elem.value);
    if (value < 0) {
        value = 0;
    } else if (value > max) {
        value = max;
    }
    return round(value);
}

const OptionNumeric: React.FunctionComponent<OptionPropType> = (props) => {
    const {option_idx, valid, value, UpdateOptionValue} = props;
    let option: Option = ALL_OPTIONS[option_idx];
    let max = Infinity;
    if (option.type[0].length > 1) {
        max = (option.type[0][1] || 0) as number;
        if (typeof max === "string") {
            // TODO: Handle variables
            max = Infinity;
        }
    }
    let int_value = (typeof value === "number") ? round(value as number) : "";
    let state: RootState = useStore().getState();
    return (
        <div>
            <OptionDivider option={option}/>
            <Container>
                <OptionTitle option={option} valid={valid}/>
                <OptionCredit option={option} valid={valid}/>
                <NumericContainer>
                    <TextField type="number" variant="outlined" disabled={!valid}
                     inputProps={{style: {padding: 6, fontSize: 18}}} value={int_value}
                     onChange={e => UpdateOptionValue(getNumber(e.target as HTMLInputElement, max))}/>
                </NumericContainer>
            </Container>
            <OptionRequires option={option} state={state} valid={valid}/>
            <OptionConflict option={option} state={state} valid={valid}/>
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