import { ValueType, RootState } from 'core/types';


enum Actions {
    DEFAULT_INIT = '@@INIT',
    CHANGE_OPTION_STATE = 'CHANGE_OPTION_STATE',
    CHANGE_TAB = 'CHANGE_TAB',
    RESET_STATE = 'RESET_STATE',
    CHANGE_MULTIPLE_OPTIONS = 'CHANGE_MULTIPLE_OPTIONS',
}

const ChangeOptionState = (id: number, value: ValueType) => ({
    type: Actions.CHANGE_OPTION_STATE as Actions.CHANGE_OPTION_STATE,
    payload: {id, value},
});

const ChangeTab = (id: number) => ({
    type: Actions.CHANGE_TAB as Actions.CHANGE_TAB,
    payload: {id},
});

const ResetState = (state: RootState) => ({
    type: Actions.RESET_STATE as Actions.RESET_STATE,
    payload: {state},
});

const ChangeMultipleOptions = (state: [number, ValueType][]) => ({
    type: Actions.CHANGE_MULTIPLE_OPTIONS as Actions.CHANGE_MULTIPLE_OPTIONS,
    payload: {state},
});

export { Actions, ChangeOptionState, ChangeTab, ResetState, ChangeMultipleOptions };