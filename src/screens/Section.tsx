import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';


import { constructOption, LAYOUT_DATA } from 'core/util';
import { RootState } from 'core/types';

import SectionHeader from 'components/combined/SectionHeader';


const Container = styled.div`
padding: 20px;
margin-top: 10px;
`;

let listKey = 100000;

const constructElem = (elem: string | number) => {
    if (typeof elem === 'string') {
        return (<SectionHeader title={elem} key={listKey++}/>);
    } else {
        return constructOption(elem);
    }
}

const Section: React.FunctionComponent<{
    section_idx: number,
    is_current_page: boolean,
}> = (props) => {
    return (
        <>
            {props.is_current_page && (<Container>
                {LAYOUT_DATA[props.section_idx].map(constructElem)}
            </Container>)}
        </>
    );
};

const mapStateToProps = (state: RootState, ownProps: {section_idx: number}) => ({
    is_current_page: state.page_id === ownProps.section_idx,
});

export default connect(mapStateToProps)(Section);