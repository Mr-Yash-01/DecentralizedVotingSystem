import React from 'react';

const CandidateCard = ({ firstName, middleName, lastName, partyName }) => {
    return (
        <div className='flex flex-col rounded-lg border border-slate-400 overflow-hidden '>
            <div className='flex flex-col px-2 flex-grow'>
                <p className='text-2xl'>
                    <span className='text-lg opacity-50 font-medium'> Name :
                    </span> {firstName} {middleName} {lastName}
                </p>
                <p className='text-2xl'>
                    <span className='text-lg opacity-50 font-medium'> Party :
                    </span> {partyName}
                </p>
            </div>
            <div className='bg-slate-800 h-6 mt-4 flex-grow-0'></div>
        </div>
    );
};

export default CandidateCard;
