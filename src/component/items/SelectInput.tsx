
import React from 'react';
import {Select } from 'antd';

interface SelectInputProps {
    item: any;
    inputValues: string;
    onChange: (name: string, value: any) => void;
}

const { Option } = Select;

export default function SelectInput (props: SelectInputProps) {
    const { item, inputValues, onChange } = props; 
    const enumList =  ['', ...item.enum];

    return  <Select 
                value={inputValues}
                style={{
                    minWidth: 300
                }}
                placeholder={item.description}                 
                onChange={(value) => {
                    onChange(item.name, value)
                }} 

            >
            {enumList.map((enumString: string) => (
                <Option key={enumString} value={enumString}>{enumString || '--Select Value--'}</Option>
            ))}
    </Select>

}