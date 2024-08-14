import React, { forwardRef } from "react";

const Inputbox = forwardRef(({ title, hint, onchange, inputId, onKeyDown, type = "text" }, ref) => {
    return (
        <div>
            <h1 className="mt-2 ml-2">
                {title}
            </h1>
            <input
                id={inputId}
                ref={ref}
                onChange={onchange}
                onKeyDown={onKeyDown}
                className="border-2 w-full rounded-lg px-[12px] py-[3px] focus:outline-gray-500"
                type={type}
                placeholder={hint}
            />
        </div>
    );
});

export default Inputbox;
