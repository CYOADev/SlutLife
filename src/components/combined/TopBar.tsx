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
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';


import colors from 'constants/Color';

import { RootState, DispatchType } from 'core/types';

import { ChangeTab, ChangeMultipleOptions } from 'core/actions';

import { get_save_state, load_save_state } from 'core/util';


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
}> = (props) => {
    let tab_idx = 0;
    let [ drawerOpen, setDrawerOpen ] = useState(false);
    const store = useStore();
    const state: RootState = store.getState();
    const inputRef = React.createRef<HTMLInputElement>();

    let [ snackbarOpen, setSnackbarOpen ] = useState(false);
    let [ snackbarSeverity, setSnackbarSeverity ] = useState('success');
    let [ snackbarText, setSnackbarText ] = useState('');

    const set_message = (text: string, severity: string) => {
        setSnackbarOpen(true);
        setSnackbarSeverity(severity);
        setSnackbarText(text);
    }

    const save_to_local_storage = () => {
        try {
            localStorage.setItem("data", JSON.stringify(get_save_state(state)));
            set_message("Saved successfully", "success");
        } catch (err) {
            set_message("Failed to save to local storage", "error");
        }
    };
    const load_from_local_storage = () => {
        let res = localStorage.getItem("data");
        try {
            if (res !== null) {
                store.dispatch(ChangeMultipleOptions(load_save_state(JSON.parse(res))));
                set_message("Loaded successfully", "success");
            } else {
                set_message("Data does not exist", "warning");
            }
        } catch (err) {
            set_message("Failed to load from local storage", "error");
        }
    };
    const save_to_file = () => {
        const a = document.createElement("a");
        const file = new Blob([JSON.stringify(get_save_state(state))], {type: "application/json"});
        a.href = URL.createObjectURL(file);
        a.download = "data.json";
        a.click();
        set_message("Saved successfully", "success");
    };
    const load_from_file = () => {
        let el = inputRef.current;
        if (el === null) {
            set_message("Input element does not exist", "error");
            return;
        }
        let files = el.files;
        if (files === null) {
            set_message("There are no files", "warning");
            return;
        }
        let file = files[0];
        if (!file) {
            set_message("File is invalid", "warning");
            return;
        }
        let reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = evt => {
            if (evt.target === null || evt.target.result === null) {
                set_message("Error reading from file", "error");
                return;
            }
            try {
                store.dispatch(ChangeMultipleOptions(
                    load_save_state(JSON.parse(evt.target.result as string))));
                set_message("Loaded successfully", "success");
            } catch (err) {
                set_message("Error parsing file", "error");
            }
        };
        reader.onerror = evt => {
            set_message("Error reading from file", "error");
        }
    }

    const onSnackbarClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason !== 'clickaway') {
            setSnackbarOpen(false);
        }
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
                        <Button variant="outlined" component="span" onClick={() => inputRef.current!.value = ''}
                         style={{width: "93.49%", margin: 8}}>Load from File</Button>
                    </label>
                    <input ref={inputRef} type="file" id="upload-file-button" onChange={load_from_file} hidden/>
                </DrawerContainer>
            </Drawer>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={onSnackbarClose}
             anchorOrigin={{vertical: "bottom", horizontal: "left"}}>
                <MuiAlert onClose={onSnackbarClose} severity={snackbarSeverity as "success" | "warning" | "error"}>
                    {snackbarText}
                </MuiAlert>
            </Snackbar>
        </>
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