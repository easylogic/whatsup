
import React from 'react';
import {Input } from 'antd';

interface TextAreaInputProps {
    inputValues: string;        
    onChange: (value: any) => void;
}

export default function TextInput (props: TextAreaInputProps) {
    const { inputValues, onChange } = props; 

    return <Input.TextArea rows={20} value={inputValues} onChange ={(e) => {
                onChange(e.target.value)
            }}
        />
}