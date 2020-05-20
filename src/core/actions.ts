import { ValueType } from 'core/types';


enum Actions {
    CHANGE_OPTION_STATE = 'CHANGE_OPTION_STATE',
    CHANGE_TAB = 'CHANGE_TAB',
}

const ChangeOptionState = (id: number, value: ValueType) => ({
    type: Actions.CHANGE_OPTION_STATE,
    payload: {id, value},
});

const ChangeTab = (id: number) => ({
    type: Actions.CHANGE_TAB,
    payload: {id, value: 0},
});

export { Actions, ChangeOptionState, ChangeTab };