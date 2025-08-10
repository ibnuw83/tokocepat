
"use client";

import * as React from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export function LiveClock() {
    const [time, setTime] = React.useState(new Date());

    React.useEffect(() => {
        const timerId = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, []);

    return (
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-md">
            <span>{format(time, 'eeee, dd MMMM yyyy', { locale: id })}</span>
            <span className="font-semibold text-foreground">{format(time, 'HH:mm:ss')}</span>
        </div>
    );
}
