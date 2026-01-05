import React, { useState } from 'react';
import { PoweroffOutlined, SyncOutlined } from '@ant-design/icons';
import { Flex, Switch, Typography, Button, Divider } from 'antd';


export default function EditorOutput() {
    const padding = 16;
    const [isAiEnabled, setIsAiEnabled] = useState(false);
    const changeIsAiEnabled = value => {
        setIsAiEnabled(value);
    };


    const [loadings, setLoadings] = useState([]);
    const enterLoading = index => {
        console.log('Start loading:', index);
        setLoadings(prevLoadings => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = true;
            return newLoadings;
        });
        setTimeout(() => {
            setLoadings(prevLoadings => {
                const newLoadings = [...prevLoadings];
                newLoadings[index] = false;
                return newLoadings;
            });
        }, 3000);
    };

    return (
        <Flex
            vertical
            gap="small"
            style={{
                height: `calc(100% - ${padding * 2}px)`,
                padding: `${padding}px`,
            }}
        >
            <Flex justify="space-between" align="center">
                <Flex justify="flex-start" align="center" gap="small">
                    <Typography.Text strong>AI Mode</Typography.Text>
                    <Divider orientation="vertical" />
                    <Switch
                        checked={isAiEnabled}
                        onChange={changeIsAiEnabled}
                        checkedChildren="ON"
                        unCheckedChildren="OFF"
                    />
                </Flex>
                <Button type="primary" disabled={!isAiEnabled} loading={loadings[0]} onClick={() => enterLoading(0)}>
                    Generate
                </Button>
            </Flex>
        </Flex>
    );
};
