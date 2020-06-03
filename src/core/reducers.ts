import produce from 'immer';


import { ALL_OPTIONS, ALL_VARIABLES } from 'core/util';
import { Actions } from 'core/actions';
import {
    ValueType,
    OptionStateInterface,
    ActionInterface,
    RootState,
    VariableStateInterface,
    OptionTypes
} from 'core/types';


const get_num_requ = (idx: number) => {
    return (ALL_OPTIONS[idx].requires || []).length;
}

const does_change = (idx: number, prev_id: number, new_state: RootState) => {
    let requires = ALL_OPTIONS[idx].requires || [];
    for (let i = 0; i < requires.length; i++) {
        let require = requires[i];
        if (typeof require === "number" && prev_id === require) {
            return true;
        } else if (typeof require === "object") {
            let matches = false;
            let has_elem = false;
            for (let j = 0; j < require.length; j++) {
                let require_elem = require[j];
                if (require_elem === prev_id) {
                    has_elem = true;
                } else {
                    if (require_elem < 0 && new_state.variables[-(require_elem + 1)].value) {
                        matches = true;
                    } else if (new_state.option[require_elem].value) {
                        matches = true;
                    }
                }
            }
            if (has_elem) {
                return !matches;
            }
        }
    }
    return false;
}

const get_credit_change = (new_state: RootState, id: number, value: ValueType) => {
    let num_credits = ALL_OPTIONS[id].credits;
    let old_value = new_state.option[id].value;
    let old_value_number = 0;
    if (typeof old_value === "boolean" || typeof old_value === "number") {
        old_value_number = +old_value;
    } else if (typeof old_value === "object") {
        old_value_number = old_value.length;
    }
    let new_value_number = 0;
    if (typeof value === "boolean" || typeof value === "number") {
        new_value_number = +value;
    } else if (typeof value === "object") {
        new_value_number = value.length;
    }
    new_state.credits += (new_value_number - old_value_number) * num_credits
    new_state.option[id].value = value;
    return { old_value, old_value_number, new_value_number };
}

const propogateTruthy = (idx: number, new_state: RootState, filter=-1) => {
    let other_requ: number[];
    if (idx >= 0) {
        other_requ = ALL_OPTIONS[idx].other_requ || [];
    } else {
        other_requ = ALL_VARIABLES[-(idx + 1)].requ;
    }
    other_requ.forEach(el => {
        if (does_change(el, idx, new_state)) {
            if (++new_state.option[el].valid_num === get_num_requ(el)) {
                new_state.option[el].valid = true;
            }
        } else {
            new_state.option[el].update_val++;
        }
    })

    let other_conf: number[];
    if (idx >= 0) {
        other_conf = ALL_OPTIONS[idx].other_conf || [];
    } else {
        other_conf = ALL_VARIABLES[-(idx + 1)].conf;
    }
    other_conf.forEach(el => {
        if (el === filter) {
            return;
        }
        let num_requ = get_num_requ(el)
        if (--new_state.option[el].valid_num !== num_requ) {
            let { old_value, old_value_number } = get_credit_change(new_state, el, false);
            if (old_value) {
                propogateFalsy(el, new_state);
                changeVariables(el, old_value_number, 0, new_state);
                propogateNumeric(new_state, el, old_value_number, 0);
            }
            new_state.option[el].valid = false;
        }
    })
}

const propogateFalsy = (idx: number, new_state: RootState, filter=-1) => {
    let other_requ: number[];
    if (idx >= 0) {
        other_requ = ALL_OPTIONS[idx].other_requ || [];
    } else {
        other_requ = ALL_VARIABLES[-(idx + 1)].requ;
    }
    other_requ.forEach(el => {
        if (does_change(el, idx, new_state)) {
            if (--new_state.option[el].valid_num !== get_num_requ(el)) {
                let { old_value, old_value_number } = get_credit_change(new_state, el, false);
                if (old_value) {
                    propogateFalsy(el, new_state);
                    changeVariables(el, old_value_number, 0, new_state);
                    propogateNumeric(new_state, el, old_value_number, 0);
                }
                new_state.option[el].valid = false;
            }
        } else {
            new_state.option[el].update_val++;
        }
    });

    let other_conf: number[];
    if (idx >= 0) {
        other_conf = ALL_OPTIONS[idx].other_conf || [];
    } else {
        other_conf = ALL_VARIABLES[-(idx + 1)].conf;
    }
    other_conf.forEach(el => {
        if (el === filter) {
            return;
        }
        if (++new_state.option[el].valid_num === get_num_requ(el)) {
            new_state.option[el].valid = true;
        } else {
            new_state.option[el].update_val++;
        }
    });
}

const propogateVariables = (
    id: number, op_id: number, old_val: number, new_val: number, new_state: RootState, op_updated: number
) => {
    ALL_VARIABLES[id].affe.forEach(el => new_state.option[el].update_val++)
    if (op_updated !== -1) {
        if (op_updated) {
            new_state.variables[id].options.push(op_id);
        } else {
            let idx = new_state.variables[id].options.indexOf(op_id);
            if (idx > -1) {
                new_state.variables[id].options.splice(idx, 1);
            }
        }
        ALL_VARIABLES[id].ev.forEach(el => {
            let op_ev_value = new_state.option[el].value;
            if (typeof op_ev_value === 'object') {
                let result = op_ev_value.filter(el => !!new_state.option[el].value);
                let { old_value } = get_credit_change(new_state, el, result);
                if (typeof old_value === 'object') {
                    propogateEvery(new_state, el);
                }
            }
            new_state.option[el].update_val++;
        });
    }
    new_state.variables[id].value = new_val;
    if (old_val === 0 && new_val !== 0) {
        propogateTruthy(-(id + 1), new_state, op_id);
    } else if (old_val !== 0 && new_val === 0) {
        propogateFalsy(-(id + 1), new_state, op_id);
    }
};

const changeVariables = (id: number, old_val: number, new_val: number, new_state: RootState) => {
    const option = ALL_OPTIONS[id];
    if (option.variables) {
        let op_updated = (!!old_val !== !!new_val) ? new_val : -1;
        option.variables.forEach(variable_op => {
            let old_var_val: number;
            let new_var_val: number;
            if (typeof variable_op === "number") {
                old_var_val = new_state.variables[variable_op].value;
                new_var_val = old_var_val + new_val - old_val;
                propogateVariables(variable_op, id, old_var_val, new_var_val, new_state, op_updated);
            } else if (typeof variable_op === "object") {
                let var_idx = variable_op[0];
                old_var_val = new_state.variables[var_idx].value;
                new_var_val = old_var_val + variable_op[1] * (new_val - old_val);
                propogateVariables(var_idx, id, old_var_val, new_var_val, new_state, op_updated);
            } else {
                console.error("variable op is not of type number or object");
            }
        });
    }
}

const propogateEvery = (new_state: RootState, id: number) => {
    if (ALL_OPTIONS[id].type[0] !== OptionTypes.EV && ALL_OPTIONS[id].type[0] !== OptionTypes.EV_EX) {
        return;
    } else if (ALL_OPTIONS[id].other_ev === undefined) {
        return;
    }
    let new_value = new_state.option[id].value as number[];
    ALL_OPTIONS[id].other_ev.forEach(el => {
        new_state.option[el].update_val++;
        let elem_value = new_state.option[el].value;
        if (typeof elem_value === 'object') {
            let result = elem_value.filter(x => new_value.indexOf(x) !== -1);
            if (result !== elem_value) {
                get_credit_change(new_state, el, result);
                propogateEvery(new_state, el);
            }
        }
    });
}

const propogateNumeric = (new_state: RootState, id: number, old_value: number, new_value: number) => {
    if (ALL_OPTIONS[id].type[0] !== OptionTypes.NU || ALL_OPTIONS[id].other_ev === undefined) {
        return;
    }
    ALL_OPTIONS[id].other_ev.forEach(el => new_state.option[el].update_val++);
    if (new_value >= old_value) {
        return;
    }
    ALL_OPTIONS[id].other_ev.forEach(el => {
        let other_ev_val = new_state.option[el].value;
        if (typeof other_ev_val === 'object') {
            let result = other_ev_val.filter(el => el < new_value);
            let { old_value } = get_credit_change(new_state, el, result);
            if (typeof old_value === 'object') {
                propogateEvery(new_state, el);
            }
        }
    });
}

const ChangeOptionState = (state: RootState, value: ValueType, id: number) => {
    return produce(state, new_state => {
        let { old_value, old_value_number, new_value_number } = get_credit_change(new_state, id, value);
        propogateNumeric(new_state, id, old_value as number, value as number);
        propogateEvery(new_state, id);
        changeVariables(id, old_value_number, new_value_number, new_state);
        if (!old_value !== !value) {
            if (value) {
                propogateTruthy(id, new_state);
            } else {
                propogateFalsy(id, new_state);
            }
        }
    })
};

const ChangeTabState = (state: RootState, id: number) => {
    return produce(state, new_state => {
        new_state.page_id = id;
    });
};

const Reducer = (
    state: RootState = {option: [], variables: [], credits: 0, page_id: 0},
    action: ActionInterface
) => {
    switch (action.type) {
        case Actions.CHANGE_OPTION_STATE:
            return ChangeOptionState(state, action.payload.value, action.payload.id);
        case Actions.CHANGE_TAB:
            return ChangeTabState(state, action.payload.id);
        default:
            // console.error("ACTION NOT RECOGNIZED: " + action.type);
    }
    return state;
}

const GetInitialState = () => {
    let OptionInitialState: OptionStateInterface[] = Array(ALL_OPTIONS.length);
    for (let i = 0; i < ALL_OPTIONS.length; i++) {
        OptionInitialState[i] = {
            valid: ALL_OPTIONS[i].requires === undefined,
            value: false,
            valid_num: 0,
            update_val: 0,
        }
    }
    let VariableInitialState: VariableStateInterface[] = Array(ALL_VARIABLES.length);
    for (let i = 0; i < ALL_VARIABLES.length; i++) {
        VariableInitialState[i] = {
            value: 0,
            options: [],
        }
    }
    return {option: OptionInitialState, variables: VariableInitialState, credits: 0, page_id: 0};
}

export { Reducer, GetInitialState };