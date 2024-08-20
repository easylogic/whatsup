
import React from 'react';
import {Input } from 'antd';
import { responseViewState } from '../../state/response-state';
import { useRecoilValue } from 'recoil';

interface JSONInputProps {
    item: any;
    schema: any;
    inputValues: any;
    onChange: (name: string, value: any) => void;
}


function typeToValue (obj: any)   {
    switch(obj.type) {
    case 'string':

        if (obj.format === 'date-time') {
            return "YYYY-MM-DD HH24:mm:ss"
        }

        if (obj.enum) {
            return obj.enum.join(' or ');
        }

        return '';
    case 'boolean':
        return Boolean(false);
    case 'array':
        return [].map(it => {
            return obj.items.type === 'integer' ? parseInt(it) : 0
        })
    }

    return '';
}

interface JSONInterface {
    [key: string]: any;
}

function schemaToJSON(schema: any, definitions: any) {

    let obj: JSONInterface = {}
    
    if (schema?.type) {
        switch(schema.type) {
        case 'object':
            Object.entries(schema?.properties || {}).forEach(([key, value]) => {
                obj[key] = typeToValue(value);
            })
            break;
        default: 
            obj = typeToValue(schema);
        }
        
    } else {        // has a ref 
        Object.entries(schema?.properties || {}).forEach(([key, value]) => {
            obj[key] = typeToValue(value);
        })
    
    }

    return JSON.stringify(obj, null, 4);
}


export default function JSONObjectInput (props: JSONInputProps) {
    const { item, inputValues, schema, onChange } = props; 
    const responseObject = useRecoilValue(responseViewState);    

    return <Input.TextArea rows={5} defaultValue={JSON.stringify(inputValues, null, 4) || schemaToJSON(schema, responseObject.definitions)} onChange ={(e) => {

        try {
            onChange(item.name, JSON.parse(e.target.value))
        } catch (e: any) {
            console.log(`json string's build is failed`, e.message);
        }

    }}
/>
}