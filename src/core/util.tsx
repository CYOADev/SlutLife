import React from 'react';


import SHEET_DATA from 'assets/sheet_data.json';

import OptionCheckbox from 'components/combined/OptionCheckbox';
import OptionComment from 'components/combined/OptionComment';
import OptionFloat from 'components/combined/OptionFloat';
import OptionNumeric from 'components/combined/OptionNumeric';
import OptionText from 'components/combined/OptionText';

import { Labels, OptionTypes, OptionInterface, RootState, RequiresType, ConflictType, VariableType } from './types';


const get_requ_string = (requires: RequiresType) => {
    let requires_string: (string | string[])[] = [];
    for (let i = 0; i < requires.length; i++) {
        let require = requires[i];
        if (typeof require === "number") {
            if (require < 0) {
                requires_string.push(VARIABLES[-(require + 1)][0]);
            } else {
                requires_string.push(ALL_OPTIONS[require].name);
            }
        } else if (typeof require === "object") {
            requires_string.push([]);
            let requires_string_elem = requires_string[requires_string.length - 1] as string[];
            for (let j = 0; j < require.length; j++) {
                let require_elem = require[j];
                if (typeof require_elem === "string") {
                    requires_string_elem.push(require_elem);
                } else if (typeof require_elem === "number") {
                    if (require_elem < 0) {
                        requires_string_elem.push(VARIABLES[-(require_elem + 1)][0]);
                    } else {
                        requires_string_elem.push(ALL_OPTIONS[require_elem].name);
                    }
                } else {
                    console.error("requires elem is neither string nor number");
                }
            }
        } else {
            console.error("requires elem is neither string nor number nor object");
        }
    }
    return requires_string;
}

const get_conf_string = (conflict: ConflictType) => {
    let conflict_string: string[] = [];
    for (let i = 0; i < conflict.length; i++) {
        let conf = conflict[i];
        if (typeof conf === "number") {
            if (conf < 0) {
                conflict_string.push(VARIABLES[-(conf + 1)][0]);
            } else {
                conflict_string.push(ALL_OPTIONS[conf].name);
            }
        } else {
            console.error("Type of conflict element is not string or number")
        }
    }
    return conflict_string;
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

        if (data[Labels.VARIABLE])
            this.variables = data[Labels.VARIABLE];
    }
}

const OPTION_DATA = SHEET_DATA['option_data'];
let ALL_OPTIONS: OptionInterface[] = [];
let LAYOUT_DATA: ((string | number)[])[] = SHEET_DATA['layout_data'];
const VARIABLES: VariableType = SHEET_DATA['variables'] as VariableType;
const COL_NAMES = SHEET_DATA['col_names'];

function Initialize() {
    for (let i = 0; i < OPTION_DATA.length; i++) {
        ALL_OPTIONS.push(new Option(OPTION_DATA[i]));
    }
    for (let i = 0; i < ALL_OPTIONS.length; i++) {
        let requires = ALL_OPTIONS[i].requires;
        if (requires) {
            ALL_OPTIONS[i].requires_string = get_requ_string(requires);
        }
        let conflict = ALL_OPTIONS[i].conflict;
        if (conflict) {
            ALL_OPTIONS[i].conflict_string = get_conf_string(conflict);
        }
    }
    console.log(ALL_OPTIONS);
    console.log(VARIABLES);
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
    }
}

const get_requ_checked = (option_idx: number, state: RootState) => {
    const option = ALL_OPTIONS[option_idx];
    let requires = option.requires || [];
    let requires_checked: (boolean | boolean[])[] = [];
    for (let i = 0; i < requires.length; i++) {
        let require = requires[i];
        if (typeof require === "number") {
            if (require < 0) {
                if (state.variables[-(require + 1)].value) {
                    requires_checked.push(true);
                } else {
                    requires_checked.push(false);
                }
            } else if (state.option[require].value) {
                requires_checked.push(true);
            } else {
                requires_checked.push(false);
            }
        } else if (typeof require === "object") {
            requires_checked.push([]);
            let requires_checked_elem = requires_checked[requires_checked.length - 1] as boolean[];
            for (let j = 0; j < require.length; j++) {
                let require_elem = require[j];
                if (typeof require_elem === "number") {
                    if (require_elem < 0) {
                        if (state.variables[-(require_elem + 1)].value) {
                            requires_checked_elem.push(true);
                        } else {
                            requires_checked_elem.push(false);
                        }
                        requires_checked_elem.push(false);
                    } else if (state.option[require_elem].value) {
                        requires_checked_elem.push(true);
                    } else {
                        requires_checked_elem.push(false);
                    }
                } else {
                    console.error("Type of requires element is not string or number or object");
                }
            }
        } else {
            console.error("Type of requires element is not string or number or object");
        }
    }
    return requires_checked;
}

const get_conf_checked = (option_idx: number, state: RootState) => {
    const option = ALL_OPTIONS[option_idx];
    let conflict = option.conflict || [];
    let conflict_checked: boolean[] = [];
    for (let i = 0; i < conflict.length; i++) {
        let conf = conflict[i];
        if (typeof conf === "number") {
            if (state.option[option_idx].valid) {
                conflict_checked.push(false);
                continue;
            }
            if (conf < 0) {
                if (state.variables[-(conf + 1)].value) {
                    conflict_checked.push(true);
                } else {
                    conflict_checked.push(false);
                }
            } else if (state.option[conf].value) {
                conflict_checked.push(true);
            } else {
                conflict_checked.push(false);
            }
        } else {
            console.error("Type of conflict element is not string or number");
        }
    }
    return conflict_checked;
}

export { Initialize, ALL_OPTIONS, LAYOUT_DATA, COL_NAMES, VARIABLES, Option,
    constructOption, get_requ_checked, get_conf_checked };