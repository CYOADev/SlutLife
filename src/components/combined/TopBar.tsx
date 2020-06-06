import React, { useState } from 'react';
import styled from 'styled-components';
import { connect, useStore } from 'react-redux';

import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';


import colors from 'constants/Color';

import { RootState, DispatchType } from 'core/types';

import { ChangeTab, ResetState } from 'core/actions';


const CreditText = styled(Typography)`
margin-right: 10px;
font-size: 24px;
margin-left: 10px;
`

const TopAppBar = styled(AppBar)`
display: flex;
flex-direction: row;
align-items: center;
`

const DrawerContainer = styled.div`
padding-left: 15px;
padding-right: 15px;
display: flex;
flex-direction: column;
background-color: ${colors.BackgroundColor};
height: 100vh;
`

const BackIconContainer = styled.div`
display: flex;
justify-content: flex-end;
`

const SettingButton = styled(Button)`
margin: 8px;
`

const TopBar: React.FunctionComponent<{
    names: string[],
    credits: number,
    page_id: number,
    UpdateTab: (page_id: number) => void,
    LoadState: (state: RootState) => void,
}> = (props) => {
    let tab_idx = 0;
    let [ drawerOpen, setDrawerOpen ] = useState(false);
    let state: RootState = useStore().getState();
    const save_to_local_storage = () => {
        try {
            localStorage.setItem("data", JSON.stringify(state));
            alert("Saved successfully");
        } catch (err) {
            alert("Failed to save to local storage");
        }
    };
    const load_from_local_storage = () => {
        let res = localStorage.getItem("data");
        try {
            if (res !== null) {
                props.LoadState(JSON.parse(res));
                alert("Loaded successfully");
            } else {
                alert("Data does not exist");
            }
        } catch (err) {
            alert("Failed to load from local storage");
        }
    };
    const save_to_file = () => {
        const a = document.createElement("a");
        const file = new Blob([JSON.stringify(state)], {type: "application/json"});
        a.href = URL.createObjectURL(file);
        a.download = "data.json";
        a.click();
        alert("Loading from file implemented yet");
    };
    const load_from_file = () => {
        // TODO: load from file
        alert("Not implemented yet");
    }
    return (
        <>
            <TopAppBar position="sticky">
                <IconButton onClick={() => setDrawerOpen(true)}>
                    <MenuIcon/>
                </IconButton>
                <Tabs value={props.page_id} variant="scrollable" onChange={(e, val) => props.UpdateTab(val)}>
                    {props.names.map(name => (
                        <Tab label={name} key={tab_idx++}></Tab>
                    ))}
                </Tabs>
                <CreditText>{ props.credits }</CreditText>
            </TopAppBar>
            <Drawer variant="persistent" anchor="left" open={drawerOpen}>
                <DrawerContainer>
                    <BackIconContainer>
                        <IconButton onClick={() => setDrawerOpen(false)}>
                            <ChevronLeftIcon/>
                        </IconButton>
                    </BackIconContainer>
                    <Divider/>
                    <SettingButton variant="outlined" onClick={save_to_local_storage}>Save to Local Storage</SettingButton>
                    <Divider/>
                    <SettingButton variant="outlined" onClick={save_to_file}>Download to File</SettingButton>
                    <Divider/>
                    <SettingButton variant="outlined" onClick={load_from_local_storage}>Load from Local Storage</SettingButton>
                    <Divider/>
                    <label htmlFor="upload-file-button">
                        <Button variant="outlined" component="span" onClick={load_from_file}
                         style={{width: "93.49%", margin: 8}}>Load from File</Button>
                    </label>
                    <input type="file" id="upload-file-button" hidden/>
                </DrawerContainer>
            </Drawer>
        </>
    );
};

const mapStateToProps = (state: RootState) => ({
    credits: state.credits,
    page_id: state.page_id,
});

const mapDispatchToProps = (dispatch: DispatchType) => ({
    UpdateTab: (page_id: number) => dispatch(ChangeTab(page_id)),
    LoadState: (state: RootState) => dispatch(ResetState(state)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);