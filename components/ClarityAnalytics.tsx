'use client';

import { useEffect } from 'react';
import clarity from '@microsoft/clarity';

export default function ClarityAnalytics() {
    useEffect(() => {
        clarity.init('uo4z7xrbhv');
    }, []);

    return null;
}
