interface ServerDailyData {
    MONDAY: number;
    TUESDAY: number;
    WEDNESDAY: number;
    THURSDAY: number;
    FRIDAY: number;
    SATURDAY: number;
    SUNDAY: number;
}

const DAY_MAPPER = [
    { serverKey: "MONDAY", clientDay: "월" },
    { serverKey: "TUESDAY", clientDay: "화" },
    { serverKey: "WEDNESDAY", clientDay: "수" },
    { serverKey: "THURSDAY", clientDay: "목" },
    { serverKey: "FRIDAY", clientDay: "금" },
    { serverKey: "SATURDAY", clientDay: "토" },
    { serverKey: "SUNDAY", clientDay: "일" },
] as const;

export function transformDailyData(serverData: ServerDailyData) {
    return DAY_MAPPER.map(({ serverKey, clientDay }) => ({
        day: clientDay,
        count: serverData[serverKey] ?? 0,
    }));
}