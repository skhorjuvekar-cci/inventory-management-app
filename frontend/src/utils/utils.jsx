export function getCurrentMonth(){
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);

    return currentMonth
}