import React from "react";

export default function Heading({payload}) {
    return <h1 className="text-3xl font-semibold text-center">
        {payload}
    </h1>
}