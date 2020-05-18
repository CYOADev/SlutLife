import { Actions } from './actions';


export enum Labels {
    NAME = '0',
    CREDITS = '1',
    DETAILS = '2',
    REQUIRES = '3',
    CONFLICT = '4',
    AFFECT = '5',
    EFFECT = '6',
    ROOMMATES = '7',
    SALARY = '8',
    TIME = '9',

    TYPE = '10',
    IS_PARENT = '11',

    OTHER_REQU = '12',
    OTHER_CONF = '13',
    OTHER_NUMERIC = '14',
    OTHER_EVERY = '15',
}

export enum OptionTypes {
    BO = 0,  // Implemented
    NU = 1,  // Implemented
    FL = 2,  // Implemented
    EV = 3,
    EV_EX = 4,
    CON = 5,
    CON_EX = 6,
    TE = 7,  // Implemented
    OW = 8,
    PU = 9,
    CO = 10,
}

export enum OtherOptionTypes {
    NOTHING = 0,
    SET = 1,
    SET_VALUE = 2,
}

export type ValueType = number | number[] | boolean | string;

export type OptionIDType = string | number;

export interface OptionStateInterface {
    value: ValueType;
    valid: boolean;
    valid_num: number;
    update_val: number;
}

export interface ActionInterface {
    type: Actions;
    payload: {
        id: number;
        value: ValueType;
    }
}

export type RequiresType = (OptionIDType | OptionIDType[])[];

export type ConflictType = OptionIDType[];

export interface OptionInterface {
    name: string;
    credits: number;
    details: string;

    requires?: (OptionIDType | OptionIDType[])[];
    conflict?: OptionIDType[];
    roommates?: number;
    salary?: number;

    type: [[OptionTypes, (number | string)?, (number | string)?],
            [OtherOptionTypes, (string | ([string, number]))?]];
    is_parent: boolean;

    other_requ: number[];
    other_conf: number[];

    requires_string?: (string | string[])[];
    conflict_string?: string[];
}

export interface RootState {
    option: OptionStateInterface[],
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