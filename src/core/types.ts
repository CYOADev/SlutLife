import { Actions } from 'core/actions';


export enum Labels {
    NAME = '0',
    CREDITS = '1',
    DETAILS = '2',
    REQUIRES = '3',
    CONFLICT = '4',
    AFFECT = '5',  // Not Implemented
    ROOMMATES = '6',  // Not Implemented
    SALARY = '7',  // Not Implemented
    TIME = '8',  // Not Implemented

    TYPE = '9',
    IS_PARENT = '10',

    OTHER_REQU = '11',
    OTHER_CONF = '12',
    OTHER_EV = '13',

    VARIABLE = '14',
}

export enum OptionTypes {
    BO = 0,  // Implemented
    NU = 1,  // Implemented
    FL = 2,  // Implemented
    EV = 3,  // Implemented
    EV_EX = 4,  // Implemented
    CON = 5,
    CON_EX = 6,  // Does not exist yet
    TE = 7,  // Implemented
    OW = 8,  // Partially Implemented
    PU = 9,  // Partially Implemented
    CO = 10,  // Implemented
}

export type ValueType = number | number[] | boolean | string;

export interface ActionInterface {
    type: Actions;
    payload: {
        id: number;
        value: ValueType;
    }
}

export type RequiresType = (number | number[])[];

export type ConflictType = number[];

export type VariableType = [string, number[], number[], number[], number[]][];

export interface VariableInterface {
    name: string;
    requ: number[];
    conf: number[];
    affe: number[];
    ev: number[];
}

export interface OptionInterface {
    name: string;
    credits: number;
    details: string;

    requires?: RequiresType;
    conflict?: ConflictType;
    roommates?: number;
    salary?: number;

    type: [OptionTypes, number?, number?];
    is_parent: boolean;

    other_requ: number[];
    other_conf: number[];
    other_ev: number[];

    variables?: (number | [number, number])[];

    requires_string?: (string | string[])[];
    conflict_string?: string[];
}

export interface OptionStateInterface {
    value: ValueType;
    valid: boolean;
    valid_num: number;
    update_val: number;
}

export interface VariableStateInterface {
    value: number;
    options: number[];
}

export interface RootState {
    option: OptionStateInterface[],
    variables: VariableStateInterface[],
    credits: number,
    page_id: number,
}

export type DispatchType = (x: any) => any;

export type OptionInputPropType = {
    option_idx: number,
};

export type OptionPropType = {
    option_idx: number,
    value: ValueType,
    valid: boolean,
    valid_num: number,
    UpdateOptionValue: (value: ValueType) => void,
};