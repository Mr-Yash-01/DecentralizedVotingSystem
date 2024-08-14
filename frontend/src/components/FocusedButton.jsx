import React from "react";

export default function FocusedButton({ payload, onclick, id, disabled }) {
    return <button disabled={disabled} id={id} onClick={onclick} className="bg-white mt-4 w-full border-2 !text-slate-800 border-slate-700 font-bold py-2 px-4 rounded">
        {payload}
    </button>

}