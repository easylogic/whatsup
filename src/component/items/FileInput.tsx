
import React from 'react';
import {Input } from 'antd';

interface FileInputProps {
    item: any;
    inputValues: File;
    onChange: (name: string, value: any) => void;
}

export default function FileInput (props: FileInputProps) {
    const { item, inputValues, onChange } = props; 

    function onChangeField(value: any) { 
        onChange(item.name, value);
    }

    return (
        <Input 
            type="file"  
            value={inputValues as any}
            onChange={(e: any) => {
                onChangeField((e.target.files ||[])[0])
            }}
        />
    )

}