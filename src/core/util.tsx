import React from 'react';


import SHEET_DATA from 'assets/sheet_data.json';

import OptionCheckbox from 'components/combined/OptionCheckbox';
import OptionComment from 'components/combined/OptionComment';
import OptionFloat from 'components/combined/OptionFloat';
import OptionNumeric from 'components/combined/OptionNumeric';
import OptionText from 'components/combined/OptionText';
import OptionMultiSelect from 'components/combined/OptionMultiSelect';

import {
    Labels,
    OptionTypes,
    OptionInterface,
    RootState,
    RequiresType,
    ConflictType,
    VariableType,
    VariableInterface,
} from './types';


const get_requ_string = (requires: RequiresType): (string | string[])[] => {
    return requires.map(require => {
        if (typeof require === "number") {
            if (require < 0) {
                return ALL_VARIABLES[-(require + 1)].name;
            } else {
                return ALL_OPTIONS[require].name;
            }
        } else if (typeof require === "object") {
            return get_requ_string(require) as string[];
        } else {
            console.error("requires elem is neither string nor number nor object");
        }
        return "UNDEFINED";
    });
}

const get_conf_string = (conflict: ConflictType) => {
    return conflict.map(conf => {
        if (typeof conf === "number") {
            if (conf < 0) {
                return ALL_VARIABLES[-(conf + 1)].name;
            } else {
                return ALL_OPTIONS[conf].name;
            }
        } else {
            console.error("Type of conflict element is not string or number")
        }
        return "UNDEFINED"
    })
}

interface Option extends OptionInterface {}
class Option {
    constructor(data: any) {
        this.name = data[Labels.NAME] || "NO NAME";
        this.credits = data[Labels.CREDITS] || 0;
        this.details = data[Labels.DETAILS] || "";

        if (data[Labels.REQUIRES])
            this.requires = data[Labels.REQUIRES];
        if (data[Labels.CONFLICT])
            this.conflict = data[Labels.CONFLICT];

        if (data[Labels.ROOMMATES])
            this.roommates = data[Labels.ROOMMATES];
        if (data[Labels.SALARY])
            this.salary = data[Labels.SALARY];

        if (data[Labels.TYPE])
            this.type = data[Labels.TYPE];
        if (data[Labels.IS_PARENT])
            this.is_parent = data[Labels.IS_PARENT];
        if (data[Labels.OTHER_REQU])
            this.other_requ = data[Labels.OTHER_REQU];
        if (data[Labels.OTHER_CONF])
            this.other_conf = data[Labels.OTHER_CONF];
        if (data[Labels.OTHER_EV])
            this.other_ev = data[Labels.OTHER_EV];

        if (data[Labels.VARIABLE])
            this.variables = data[Labels.VARIABLE];
    }
}

const OPTION_DATA = SHEET_DATA['option_data'];
let ALL_OPTIONS: OptionInterface[] = [];
let LAYOUT_DATA: ((string | number)[])[] = SHEET_DATA['layout_data'];
const VARIABLE_DATA: VariableType = SHEET_DATA['variables'] as VariableType;
const COL_NAMES = SHEET_DATA['col_names'];
let ALL_VARIABLES: VariableInterface[] = [];

function Initialize() {
    ALL_OPTIONS = OPTION_DATA.map(el => new Option(el));
    ALL_VARIABLES = VARIABLE_DATA.map(el => ({
        name: el[0], requ: el[1], conf: el[2], affe: el[3], ev: el[4],
    }));
    ALL_OPTIONS.forEach(el => {
        let requires = el.requires;
        if (requires) {
            el.requires_string = get_requ_string(requires);
        }
        let conflict = el.conflict;
        if (conflict) {
            el.conflict_string = get_conf_string(conflict);
        }
    })
    console.log(ALL_OPTIONS);
    console.log(ALL_VARIABLES);
    console.log(COL_NAMES);
}

function constructOption(idx: number) {
    switch (ALL_OPTIONS[idx].type[0]) {
        case OptionTypes.BO:
            return <OptionCheckbox option_idx={idx} key={idx}/>
        case OptionTypes.CO:
            return <OptionComment option_idx={idx} key={idx}/>
        case OptionTypes.FL:
            return <OptionFloat option_idx={idx} key={idx}/>
        case OptionTypes.NU:
            return <OptionNumeric option_idx={idx} key={idx}/>
        case OptionTypes.TE:
            return <OptionText option_idx={idx} key={idx}/>
        case OptionTypes.OW:  // TODO: have actual custom option
            return <OptionCheckbox option_idx={idx} key={idx}/>
        case OptionTypes.EV:
            return <OptionMultiSelect option_idx={idx} key={idx}/>
    }
}

const get_requ_checked = (option_idx: number, state: RootState, requ_obj?: number[]): (boolean | boolean[])[] => {
    const option = ALL_OPTIONS[option_idx];
    let requires = requ_obj || option.requires || [];
    return requires.map(require => {
        if (typeof require === "number") {
            if (require < 0) {
                return !!state.variables[-(require + 1)].value;
            } else {
                return !!state.option[require].value;
            }
        } else if (typeof require === "object") {
            return get_requ_checked(option_idx, state, require) as boolean[];
        } else {
            console.error("Type of requires element is not string or number or object");
        }
        return false;
    });
}

const get_conf_checked = (option_idx: number, state: RootState) => {
    const option = ALL_OPTIONS[option_idx];
    let conflict = option.conflict || [];
    return conflict.map(conf => {
        if (typeof conf === "number") {
            if (state.option[option_idx].valid) {
                return false;
            } else if (conf < 0) {
                return !!state.variables[-(conf + 1)].value;
            } else {
                return !!state.option[conf].value;
            }
        } else {
            console.error("Type of conflict element is not string or number");
        }
        return false;
    })
}

const get_name_strings = (option_idx: number, state: RootState) => {
    let option: Option = ALL_OPTIONS[option_idx];
    let name_strings: [string, number][] = [];
    let name_strings_map: {[index: number]: number} = {};
    let origin_name = '';
    let idx = 0;
    let other_idx = option.type[1] as number;
    if (other_idx >= 0) {
        let other_option: Option = ALL_OPTIONS[other_idx];
        let other_value = state.option[other_idx].value as number | number[];
        origin_name = other_option.name;
        if (other_option.type[0] === OptionTypes.NU) {
            for (let i = 0; i < other_value; i++) {
                name_strings.push([`#${i + 1} ${other_option.name}`, i]);
                name_strings_map[i] = idx++;
            }
        } else if (other_option.type[0] === OptionTypes.EV || other_option.type[0] === OptionTypes.EV_EX) {
            let parent_value = state.option[other_idx].value;
            if (typeof parent_value === 'object') {
                let parent_numeric = "";
                let parent = other_option;
                while (typeof parent.type[1] === 'number' && parent.type[1] >= 0) {
                    parent = ALL_OPTIONS[parent.type[1]];
                    if (typeof parent.type[0] === 'number' && parent.type[0] === OptionTypes.NU) {
                        parent_numeric = parent.name;
                        break;
                    }
                }
                if (parent_numeric === "") {
                    parent_value.forEach(el => {
                        name_strings.push([ALL_OPTIONS[el].name, el]);
                        name_strings_map[el] = idx++;
                    });
                } else {
                    parent_value.forEach(el => {
                        name_strings.push([`#${el + 1} ${parent_numeric}`, el]);
                        name_strings_map[el] = idx++;
                    });
                }
            }
        }
    } else {
        origin_name = ALL_VARIABLES[-(other_idx + 1)].name;
        let options = state.variables[-(other_idx + 1)].options;
        options.forEach(el => {
            name_strings.push([ALL_OPTIONS[el].name, el]);
            name_strings_map[el] = idx++;
        });
    }
    return { name_strings, name_strings_map, origin_name };
};

export { Initialize, ALL_OPTIONS, LAYOUT_DATA, COL_NAMES, ALL_VARIABLES, Option,
    constructOption, get_requ_checked, get_conf_checked, get_name_strings };