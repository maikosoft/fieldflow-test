import React from 'react';
import { Spinner } from '@heroui/react';

const Loading: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <Spinner size="lg" className="text-blue-500" />
            {/* <span className="ml-2 text-lg text-gray-700">Loading...</span> */}
        </div>
    );
};

export default Loading;