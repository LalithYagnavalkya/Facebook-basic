const formatTime = (timeSlot: string): string => {
    const [hour, minute] = timeSlot.split(":");
    const time = new Date();
    time.setHours(parseInt(hour, 10), parseInt(minute, 10));
    return time.toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};

export { formatTime };