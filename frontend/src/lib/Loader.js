"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

const Loader = () => {
    const loading = useSelector((state) => state.loader.loading);
    if (!loading) return null;
    else {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black/25">
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            </div>
        );
    }
};

export default Loader;
