import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';


import { Option, ALL_OPTIONS } from 'core/util';
import { ChangeOptionState } from 'core/actions';
import { ValueType, RootState, DispatchType, OptionInputPropType, OptionPropType } from 'core/types';

import OptionDivider from 'components/parts/OptionDivider';
import OptionTitle from 'components/parts/OptionTitle';
import OptionDescription from 'components/parts/OptionDescription';


const Container = styled.div`
display: flex;
flex-direction: row;
`;

const OptionComment: React.FunctionComponent<OptionPropType> = (props) => {
    const { option_idx, valid } = props;
    let option: Option = ALL_OPTIONS[option_idx];
    return (
        <div ref={props.div_ref}>
            <OptionDivider option={option}/>
            <Container>
                <OptionTitle option={option} valid={valid}/>
            </Container>
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

export default connect(mapStateToProps, mapDispatchToProps)(OptionComment);