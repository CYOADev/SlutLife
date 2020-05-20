import produce from 'immer';


import { ALL_OPTIONS } from 'core/util';
import { Actions } from 'core/actions';
import { ValueType, OptionStateInterface, ActionInterface, RootState } from 'core/types';


const get_num_requ = (idx: number) => {
    return (ALL_OPTIONS[idx].requires || []).length;
}


const does_change = (idx: number, prev_id: number | string, new_state: OptionStateInterface[]) => {
    let requires = ALL_OPTIONS[idx].requires || [];
    for (let i = 0; i < requires.length; i++) {
        let require = requires[i];
        if (typeof require === "number" || typeof require === "string") {
            if (prev_id === require) {
                return true;
            }
        } else if (typeof require === "object") {
            let matches = false;
            let has_elem = false;
            for (let j = 0; j < require.length; j++) {
                let require_elem = require[j];
                if (require_elem === prev_id) {
                    has_elem = true;
                } else if (typeof require_elem === "string") {
                    // TODO: stuff
                } else if (typeof require_elem === "number") {
                    if (require_elem < 0) {
                        // TODO: variable stuff
                    } else if (new_state[require_elem].value) {
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
    return old_value;
}


const propogateTruthy = (idx: number, new_state: RootState) => {
    let other_requ = ALL_OPTIONS[idx].other_requ || [];
    for (let i = 0; i < other_requ.length; i++) {
        if (does_change(other_requ[i], idx, new_state.option)) {
            let valid_num = ++new_state.option[other_requ[i]].valid_num;
            if (valid_num === get_num_requ(other_requ[i])) {
                new_state.option[other_requ[i]].valid = true;
            }
        } else {
            new_state.option[other_requ[i]].update_val++;
        }
    }

    let other_conf = ALL_OPTIONS[idx].other_conf || [];
    for (let i = 0; i < other_conf.length; i++) {
        let valid_num = --new_state.option[other_conf[i]].valid_num;
        let num_requ = get_num_requ(other_conf[i])
        if (valid_num !== num_requ) {
            let old_value = get_credit_change(new_state, other_conf[i], false);
            if (old_value) {
                propogateFalsy(other_conf[i], new_state);
            }
            new_state.option[other_conf[i]].valid = false;
        }
    }
}


const propogateFalsy = (idx: number, new_state: RootState) => {
    let other_requ = ALL_OPTIONS[idx].other_requ || [];
    for (let i = 0; i < other_requ.length; i++) {
        if (does_change(other_requ[i], idx, new_state.option)) {
            let valid_num = --new_state.option[other_requ[i]].valid_num;
            if (valid_num !== get_num_requ(other_requ[i])) {
                let old_value = get_credit_change(new_state, other_requ[i], false);
                if (old_value) {
                    propogateFalsy(other_requ[i], new_state);
                }
                new_state.option[other_requ[i]].valid = false;
            }
        } else {
            new_state.option[other_requ[i]].update_val++;
        }
    }

    let other_conf = ALL_OPTIONS[idx].other_conf || [];
    for (let i = 0; i < other_conf.length; i++) {
        let valid_num = ++new_state.option[other_conf[i]].valid_num;
        if (valid_num === get_num_requ(other_conf[i])) {
            new_state.option[other_conf[i]].valid = true;
        }
    }
}


const ChangeOptionState = (state: RootState, value: ValueType, id: number) => {
    return produce(state, new_state => {
        let old_value = get_credit_change(new_state, id, value);
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


const Reducer = (state: RootState = {option: [], credits: 0, page_id: 0}, action: ActionInterface) => {
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
    return {option: OptionInitialState, credits: 0, page_id: 0};
}

export { Reducer, GetInitialState };