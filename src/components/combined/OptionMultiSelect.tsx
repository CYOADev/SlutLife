import React from 'react';
import styled from 'styled-components';
import { connect, useStore } from 'react-redux';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';


import { Option, ALL_OPTIONS, get_name_strings } from 'core/util';
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
margin-bottom: 8px;
align-content: center;
`;

const SelectContainer = styled.div`
margin-top: 8px;
margin-right: 8px;
`;

const ChipContainer = styled.div`
display: flex;
flex-wrap: wrap;
padding-top: 2px;
padding-bottom: 4px;
min-height: 32px;
`;

const ChipElement = styled(Chip)`
margin-top: 2px;
margin-left: 2px;
`;

const MenuProps = {
    PaperProps: {
        style: {width: 250}
    },
    anchorOrigin: {
        vertical: "bottom" as "bottom",
        horizontal: "left" as "left",
    },
    transformOrigin: {
        vertical: "top" as "top",
        horizontal: "left" as "left",
    },
    getContentAnchorEl: null
}

const get_chips = (
    selected: number[],
    name_strings: [string, number][],
    name_strings_map: {[index: number]: number},
    origin_name: string,
    filtered: boolean
) => {
    let values = selected.map(el => name_strings[name_strings_map[el]][0]);
    if (!filtered && name_strings.length !== 0 && selected.length === name_strings.length) {
        let name = 'All Selected ' + origin_name;
        return (
            <ChipContainer>
                <ChipElement key={name} label={name} variant="outlined"/>
            </ChipContainer>
        )
    } else {
        return (
            <ChipContainer>
                {values.map(name => (
                    <ChipElement key={name} label={name} variant="outlined"/>
                ))}
            </ChipContainer>
        )
    }
}

const OptionMultiSelect: React.FunctionComponent<OptionPropType> = (props) => {
    const { option_idx, valid, value, UpdateOptionValue } = props;
    let value_array: number[] = [];
    if (typeof value === 'object') {
        value_array = value;
    }
    let option: Option = ALL_OPTIONS[option_idx];
    let state: RootState = useStore().getState();
    let { name_strings, name_strings_map, origin_name, filtered } = get_name_strings(option_idx, state);
    return (
        <div>
            <OptionDivider option={option}/>
            <Container>
                <SelectContainer>
                    <Select multiple displayEmpty variant="outlined" disabled={!valid}
                     inputProps={{style: {padding: 6}}} value={value_array}
                     onChange={e => UpdateOptionValue(((e.target as HTMLInputElement).value as unknown as number[]).sort((a, b) => a - b))}
                     renderValue={selected => get_chips(selected as number[], name_strings, name_strings_map, origin_name, filtered)}
                     MenuProps={MenuProps}>
                         {name_strings.map(el => (
                             <MenuItem key={el[1]} value={el[1]}> {el[0]} </MenuItem>
                         ))}
                    </Select>
                </SelectContainer>
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

export default connect(mapStateToProps, mapDispatchToProps)(OptionMultiSelect);