import React from 'react';
import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { connect } from 'react-redux';


import { RootState, DispatchType } from '../../core/types';

import { ChangeTab } from '../../core/actions';


const CreditText = styled.span`
margin-right: 10px;
font-size: 24px;
margin-left: 10px;
`


const TopBar: React.FunctionComponent<{
    names: string[],
    credits: number,
    page_id: number,
    UpdateTab: (page_id: number) => void,
}> = (props) => {
    let tab_idx = 0;
    return (
        <div>
            <AppBar position="fixed" style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                <Tabs value={props.page_id} variant="scrollable" onChange={(e, val) => props.UpdateTab(val)}>
                    {props.names.map(name => (
                        <Tab label={name} key={tab_idx++}></Tab>
                    ))}
                </Tabs>
                <CreditText>{ props.credits }</CreditText>
            </AppBar>
        </div>
    );
};

const mapStateToProps = (state: RootState) => ({
    credits: state.credits,
    page_id: state.page_id,
});

const mapDispatchToProps = (dispatch: DispatchType) => ({
    UpdateTab: (page_id: number) => dispatch(ChangeTab(page_id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);