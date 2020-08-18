import React from 'react';

interface Props {
    item: any;
    schema?: any; 
}

export default function TypeHelpViewer (props: Props) {
    const { item: it, schema } = props; 
    let help = undefined; 
    if (it.description) {
        help = (
            <div>
                <div><strong>type</strong>: {it.type || `${schema?.type} - ${schema?.title}`}</div>
                <div><strong>description</strong>: {it.description}</div>
            </div>
        );
    } else {
        help = (
            <div>
                <div><strong>type</strong>: {it.type || schema.type} </div> 
                {it.enum ? <div><strong>enum</strong>: {JSON.stringify(it.enum)}</div> : ''}
                {it.items?.enum ? <div><strong>enum</strong>: {JSON.stringify(it.items?.enum)}</div> : ''}                    
                {(schema?.type) && (<div><strong>{schema?.type}</strong>`: ${schema?.title || schema?.xml?.name}`</div>)}
            </div>
        )
    }

    return <div style={{color: 'gray', fontSize: 11}}>{help}</div>
}