import React from 'react';
import styled from 'styled-components';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import CssBaseline from '@material-ui/core/CssBaseline';
import ThemeProvider from '@material-ui/styles/ThemeProvider';


import { Initialize, COL_NAMES } from 'core/util';
import { Reducer, GetInitialState } from 'core/reducers'
import colors from 'constants/Color';

import TopBar from 'components/combined/TopBar';
import Section from 'screens/Section';


const MainContainer = styled.div`
background-color: ${colors.BackgroundColor};
min-height: 100vh;
padding: 20px;
`;

const theme = createMuiTheme({
    palette: {
        primary: {
            main: colors.PrimaryColor,
        },
        secondary: {
            main: colors.SecondaryColor,
        },
    }
});

const Main: React.FunctionComponent = () => {
    Initialize();
    let store = createStore(Reducer, GetInitialState(), (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__());
    let sections: JSX.Element[] = [];
    for (let i = 0; i < COL_NAMES.length; i++) {
        sections.push(<Section section_idx={i} key={i}/>);
    }
    return (
        <>
            <CssBaseline/>
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <TopBar names={COL_NAMES}/>
                    <MainContainer>
                        {sections}
                    </MainContainer>
                </ThemeProvider>
            </Provider>
        </>
    )
}

export default Main;