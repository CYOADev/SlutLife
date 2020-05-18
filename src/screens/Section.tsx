import React from 'react';
import { connect } from 'react-redux';


import { constructOption, LAYOUT_DATA } from '../core/util';
import { RootState } from '../core/types';

import SectionHeader from '../components/combined/SectionHeader';


let listKey = 100000;


function constructElem(elem: string | number) {
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
    let layout = LAYOUT_DATA[props.section_idx];
    return (
        <div style={{marginTop: 30}}>
            {props.is_current_page && layout.map(constructElem)}
        </div>
    )
}

const mapStateToProps = (state: RootState, ownProps: {section_idx: number}) => ({
    is_current_page: state.page_id === ownProps.section_idx,
})

export default connect(mapStateToProps)(Section);