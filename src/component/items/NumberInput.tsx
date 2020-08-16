
import React from 'react';
import {InputNumber } from 'antd';

interface NumberInputProps {
    item: any;
    inputValues: number;
    onChange: (name: string, value: any) => void;
}

export default function NumberInput (props: NumberInputProps) {
    const { item, inputValues, onChange } = props; 

    let min = 0, max = 1000000000; 

    if (item.name === 'page') {
        max = 10000; 
    }

    return <InputNumber min={min} max={max} value={inputValues} onChange ={(value) => {
                onChange(item.name, value)
            }}
        />
}