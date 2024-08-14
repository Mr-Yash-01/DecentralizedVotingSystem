    import React from "react";

    export default function Button({payload,onclick, id, disabled}) {
        return <button disabled={disabled} id={id} onClick={onclick} className="bg-slate-800 mt-4 w-full hover:bg-slate-500 text-white font-bold py-2 px-4 rounded">
            {payload}
        </button>
    }