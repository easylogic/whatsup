
import React from 'react';
import {Switch } from 'antd';

interface BooleanInputProps {
    item: any;
    inputValues: boolean; 
    onChange: (name: string, value: any) => void;
}

export default function BooleanInput (props: BooleanInputProps) {
    const { item, inputValues, onChange } = props; 

    return <Switch checked={inputValues} onChange ={(value: boolean) => {
                    onChange(item.name, value)
            }}
        />
}