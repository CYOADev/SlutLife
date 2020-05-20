import React from 'react';
import styled from 'styled-components';
import { connect, useStore } from 'react-redux';

import Checkbox from '@material-ui/core/Checkbox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';


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
`;

const OptionCheckbox: React.FunctionComponent<OptionPropType> = (props) => {
    const { option_idx, valid, value, UpdateOptionValue } = props;
    let boolean_value = value as boolean;
    let option: Option = ALL_OPTIONS[option_idx];
    let state: RootState = useStore().getState();
    return (
        <div>
            <OptionDivider option={option}/>
            <Container>
                <Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite />}
                 onClick={e => UpdateOptionValue((e.target as HTMLInputElement).checked)}
                 disabled={!valid} checked={boolean_value}/>
                <OptionTitle option={option} valid={valid}/>
                <OptionCredit option={option} valid={valid}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(OptionCheckbox);