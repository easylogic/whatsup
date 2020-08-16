
import React from 'react';
import {Input } from 'antd';

interface TextInputProps {
    item: any;
    inputValues: string;        
    onChange: (name: string, value: any) => void;
}

export default function TextInput (props: TextInputProps) {
    const { item, inputValues, onChange } = props; 

    return <Input 
                value={inputValues} 
                placeholder={item.description}                 
                onChange ={(e) => {
                onChange(item.name, e.target.value)
            }}
        />
}