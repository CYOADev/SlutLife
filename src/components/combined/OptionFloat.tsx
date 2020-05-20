import React from 'react';
import styled from 'styled-components';

import TextField from '@material-ui/core/TextField';

import { connect, useStore } from 'react-redux';


import { Option, ALL_OPTIONS } from 'core/util';
import { ChangeOptionState } from 'core/actions';
import { ValueType, RootState, DispatchType, OptionInputPropType, OptionPropType } from 'core/types';

import OptionDivider from 'components/parts/OptionDivider';
import OptionTitle from 'components/parts/OptionTitle';
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
margin-top: 8px;
margin-left: 8px;
width: 72px;
`;

const round = (num: number) => {
    return parseFloat(num.toFixed(2));
}

const getNumber = (elem: HTMLInputElement, min: number, max: number) => {
    let value = elem.valueAsNumber;
    if (typeof value !== "number") {
        return false;
    }
    if (value < min) {
        value = min;
    } else if (value > max) {
        value = max;
    }
    return round((value || min) - min);
}

const OptionFloat: React.FunctionComponent<OptionPropType> = (props) => {
    const { option_idx, valid, value, UpdateOptionValue } = props;
    let option: Option = ALL_OPTIONS[option_idx];
    let min: number = (option.type[0][1] || 0) as number;
    let max: number = (option.type[0][2] || 0) as number;
    let float_value = (typeof value === "number") ? round(value as number + min) : "";
    let state: RootState = useStore().getState();
    return (
        <div>
            <OptionDivider option={option}/>
            <Container>
                <OptionTitle option={option} valid={valid}/>
                <NumericContainer>
                    <TextField type="number" variant="outlined" disabled={!valid}
                     inputProps={{style: {padding: 6, fontSize: 18}}} value={float_value}
                     onChange={e => UpdateOptionValue(getNumber(e.target as HTMLInputElement, min, max))}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(OptionFloat);