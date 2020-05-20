import React from 'react';
import styled from 'styled-components';

import Box from '@material-ui/core/Box';
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


const Container = styled(Box)`
display: flex;
flex-direction: row;
margin-left: 10px;
margin-bottom: 4px;
`;

const TextContainer = styled.div`
margin-top: 8px;
margin-left: 8px;
width: 144px;
`;

const OptionText: React.FunctionComponent<OptionPropType> = (props) => {
    const {option_idx, valid, value, UpdateOptionValue} = props;
    let string_value = value as string;
    if (typeof value === "boolean") {
        string_value = "";
    }
    let option: Option = ALL_OPTIONS[option_idx];
    let state: RootState = useStore().getState();
    return (
        <div>
            <OptionDivider option={option}/>
            <Container>
                <OptionTitle option={option} valid={valid}/>
                <TextContainer>
                    <TextField variant="outlined" disabled={!valid}
                     inputProps={{style: {padding: 6, fontSize: 18}}} value={string_value}
                     onChange={e => UpdateOptionValue((e.target as HTMLInputElement).value)}/>
                </TextContainer>
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

export default connect(mapStateToProps, mapDispatchToProps)(OptionText);