export interface ActivityBlock {
    id: number;
    startTime: string;
    endTime: string;
    homeoffice: boolean;
}

export interface TimeCredit {
    id: number;
    minutes: number;
    reason: string;
}

export interface StudentDay {
    date: string;
    label: string;
    blocks: ActivityBlock[];
    credits: TimeCredit[];
}

export const mockStudentDays: StudentDay[] = [
    {
        date: "2026-09-07",
        label: "Montag, 07.09.2026",
        blocks: [
            {
                id: 1,
                startTime: "08:00",
                endTime: "12:00",
                homeoffice: false,
            },
            {
                id: 2,
                startTime: "13:00",
                endTime: "16:30",
                homeoffice: true,
            },
        ],
        credits: [
            {
                id: 1,
                minutes: 60,
                reason: "Arzttermin",
            },
            {
                id: 2,
                minutes: 30,
                reason: "Sonstiges",
            },
            {
                id: 3,
                minutes: 60,
                reason: "Hochschulveranstaltung",
            },
        ],
    },

    {
        date: "2026-09-08",
        label: "Dienstag, 08.09.2026",
        blocks: [
            {
                id: 3,
                startTime: "09:00",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-09-09",
        label: "Mittwoch, 09.09.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-09-10",
        label: "Donnerstag, 10.09.2026",
        blocks: [
            {
                id: 4,
                startTime: "08:30",
                endTime: "12:30",
                homeoffice: true,
            },
            {
                id: 5,
                startTime: "13:15",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-09-11",
        label: "Freitag, 11.09.2026",
        blocks: [
            {
                id: 6,
                startTime: "08:00",
                endTime: "15:30",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-09-12",
        label: "Samstag, 12.09.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-09-13",
        label: "Sonntag, 13.09.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-09-14",
        label: "Montag, 14.09.2026",
        blocks: [
        ],
        credits: [
            {
                id: 4,
                minutes: 60,
                reason: "Arzttermin",
            },
        ],
    },

    {
        date: "2026-09-15",
        label: "Dienstag, 15.09.2026",
        blocks: [
            {
                id: 7,
                startTime: "08:30",
                endTime: "12:30",
                homeoffice: true,
            },
            {
                id: 8,
                startTime: "13:15",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-09-16",
        label: "Mittwoch, 16.09.2026",
        blocks: [
            {
                id: 9,
                startTime: "08:00",
                endTime: "15:30",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-09-17",
        label: "Donnerstag, 17.09.2026",
        blocks: [
            {
                id: 10,
                startTime: "08:00",
                endTime: "12:00",
                homeoffice: false,
            },
            {
                id: 11,
                startTime: "13:00",
                endTime: "16:30",
                homeoffice: true,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-09-18",
        label: "Freitag, 18.09.2026",
        blocks: [
            {
                id: 12,
                startTime: "09:00",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
            {
                id: 5,
                minutes: 30,
                reason: "Sonstiges",
            },
        ],
    },

    {
        date: "2026-09-19",
        label: "Samstag, 19.09.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-09-20",
        label: "Sonntag, 20.09.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-09-21",
        label: "Montag, 21.09.2026",
        blocks: [
            {
                id: 13,
                startTime: "08:00",
                endTime: "15:30",
                homeoffice: false,
            },
        ],
        credits: [
            {
                id: 6,
                minutes: 60,
                reason: "Arzttermin",
            },
        ],
    },

    {
        date: "2026-09-22",
        label: "Dienstag, 22.09.2026",
        blocks: [
            {
                id: 14,
                startTime: "08:00",
                endTime: "12:00",
                homeoffice: false,
            },
            {
                id: 15,
                startTime: "13:00",
                endTime: "16:30",
                homeoffice: true,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-09-23",
        label: "Mittwoch, 23.09.2026",
        blocks: [
            {
                id: 16,
                startTime: "09:00",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-09-24",
        label: "Donnerstag, 24.09.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-09-25",
        label: "Freitag, 25.09.2026",
        blocks: [
            {
                id: 17,
                startTime: "08:30",
                endTime: "12:30",
                homeoffice: true,
            },
            {
                id: 18,
                startTime: "13:15",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-09-26",
        label: "Samstag, 26.09.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-09-27",
        label: "Sonntag, 27.09.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-09-28",
        label: "Montag, 28.09.2026",
        blocks: [
            {
                id: 19,
                startTime: "09:00",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
            {
                id: 7,
                minutes: 60,
                reason: "Arzttermin",
            },
        ],
    },

    {
        date: "2026-09-29",
        label: "Dienstag, 29.09.2026",
        blocks: [
        ],
        credits: [
            {
                id: 8,
                minutes: 30,
                reason: "Sonstiges",
            },
        ],
    },

    {
        date: "2026-09-30",
        label: "Mittwoch, 30.09.2026",
        blocks: [
            {
                id: 20,
                startTime: "08:30",
                endTime: "12:30",
                homeoffice: true,
            },
            {
                id: 21,
                startTime: "13:15",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-10-01",
        label: "Donnerstag, 01.10.2026",
        blocks: [
            {
                id: 22,
                startTime: "08:00",
                endTime: "15:30",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-10-02",
        label: "Freitag, 02.10.2026",
        blocks: [
            {
                id: 23,
                startTime: "08:00",
                endTime: "12:00",
                homeoffice: false,
            },
            {
                id: 24,
                startTime: "13:00",
                endTime: "16:30",
                homeoffice: true,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-10-03",
        label: "Samstag, 03.10.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-10-04",
        label: "Sonntag, 04.10.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-10-05",
        label: "Montag, 05.10.2026",
        blocks: [
            {
                id: 25,
                startTime: "08:30",
                endTime: "12:30",
                homeoffice: true,
            },
            {
                id: 26,
                startTime: "13:15",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
            {
                id: 9,
                minutes: 60,
                reason: "Arzttermin",
            },
        ],
    },

    {
        date: "2026-10-06",
        label: "Dienstag, 06.10.2026",
        blocks: [
            {
                id: 27,
                startTime: "08:00",
                endTime: "15:30",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-10-07",
        label: "Mittwoch, 07.10.2026",
        blocks: [
            {
                id: 28,
                startTime: "08:00",
                endTime: "12:00",
                homeoffice: false,
            },
            {
                id: 29,
                startTime: "13:00",
                endTime: "16:30",
                homeoffice: true,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-10-08",
        label: "Donnerstag, 08.10.2026",
        blocks: [
            {
                id: 30,
                startTime: "09:00",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-10-09",
        label: "Freitag, 09.10.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-10-10",
        label: "Samstag, 10.10.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-10-11",
        label: "Sonntag, 11.10.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-10-12",
        label: "Montag, 12.10.2026",
        blocks: [
            {
                id: 31,
                startTime: "08:00",
                endTime: "12:00",
                homeoffice: false,
            },
            {
                id: 32,
                startTime: "13:00",
                endTime: "16:30",
                homeoffice: true,
            },
        ],
        credits: [
            {
                id: 10,
                minutes: 60,
                reason: "Arzttermin",
            },
        ],
    },

    {
        date: "2026-10-13",
        label: "Dienstag, 13.10.2026",
        blocks: [
            {
                id: 33,
                startTime: "09:00",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-10-14",
        label: "Mittwoch, 14.10.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-10-15",
        label: "Donnerstag, 15.10.2026",
        blocks: [
            {
                id: 34,
                startTime: "08:30",
                endTime: "12:30",
                homeoffice: true,
            },
            {
                id: 35,
                startTime: "13:15",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-10-16",
        label: "Freitag, 16.10.2026",
        blocks: [
            {
                id: 36,
                startTime: "08:00",
                endTime: "15:30",
                homeoffice: false,
            },
        ],
        credits: [
            {
                id: 11,
                minutes: 60,
                reason: "Hochschulveranstaltung",
            },
        ],
    },

    {
        date: "2026-10-17",
        label: "Samstag, 17.10.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-10-18",
        label: "Sonntag, 18.10.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-10-19",
        label: "Montag, 19.10.2026",
        blocks: [
        ],
        credits: [
            {
                id: 12,
                minutes: 60,
                reason: "Arzttermin",
            },
        ],
    },

    {
        date: "2026-10-20",
        label: "Dienstag, 20.10.2026",
        blocks: [
            {
                id: 37,
                startTime: "08:30",
                endTime: "12:30",
                homeoffice: true,
            },
            {
                id: 38,
                startTime: "13:15",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-10-21",
        label: "Mittwoch, 21.10.2026",
        blocks: [
            {
                id: 39,
                startTime: "08:00",
                endTime: "15:30",
                homeoffice: false,
            },
        ],
        credits: [
            {
                id: 13,
                minutes: 30,
                reason: "Sonstiges",
            },
        ],
    },

    {
        date: "2026-10-22",
        label: "Donnerstag, 22.10.2026",
        blocks: [
            {
                id: 40,
                startTime: "08:00",
                endTime: "12:00",
                homeoffice: false,
            },
            {
                id: 41,
                startTime: "13:00",
                endTime: "16:30",
                homeoffice: true,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-10-23",
        label: "Freitag, 23.10.2026",
        blocks: [
            {
                id: 42,
                startTime: "09:00",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-10-24",
        label: "Samstag, 24.10.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-10-25",
        label: "Sonntag, 25.10.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-10-26",
        label: "Montag, 26.10.2026",
        blocks: [
            {
                id: 43,
                startTime: "08:00",
                endTime: "15:30",
                homeoffice: false,
            },
        ],
        credits: [
            {
                id: 14,
                minutes: 60,
                reason: "Arzttermin",
            },
        ],
    },

    {
        date: "2026-10-27",
        label: "Dienstag, 27.10.2026",
        blocks: [
            {
                id: 44,
                startTime: "08:00",
                endTime: "12:00",
                homeoffice: false,
            },
            {
                id: 45,
                startTime: "13:00",
                endTime: "16:30",
                homeoffice: true,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-10-28",
        label: "Mittwoch, 28.10.2026",
        blocks: [
            {
                id: 46,
                startTime: "09:00",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-10-29",
        label: "Donnerstag, 29.10.2026",
        blocks: [
        ],
        credits: [
            {
                id: 15,
                minutes: 60,
                reason: "Hochschulveranstaltung",
            },
        ],
    },

    {
        date: "2026-10-30",
        label: "Freitag, 30.10.2026",
        blocks: [
            {
                id: 47,
                startTime: "08:30",
                endTime: "12:30",
                homeoffice: true,
            },
            {
                id: 48,
                startTime: "13:15",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-10-31",
        label: "Samstag, 31.10.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-11-01",
        label: "Sonntag, 01.11.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-11-02",
        label: "Montag, 02.11.2026",
        blocks: [
            {
                id: 49,
                startTime: "09:00",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
            {
                id: 16,
                minutes: 60,
                reason: "Arzttermin",
            },
        ],
    },

    {
        date: "2026-11-03",
        label: "Dienstag, 03.11.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-11-04",
        label: "Mittwoch, 04.11.2026",
        blocks: [
            {
                id: 50,
                startTime: "08:30",
                endTime: "12:30",
                homeoffice: true,
            },
            {
                id: 51,
                startTime: "13:15",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-11-05",
        label: "Donnerstag, 05.11.2026",
        blocks: [
            {
                id: 52,
                startTime: "08:00",
                endTime: "15:30",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-11-06",
        label: "Freitag, 06.11.2026",
        blocks: [
            {
                id: 53,
                startTime: "08:00",
                endTime: "12:00",
                homeoffice: false,
            },
            {
                id: 54,
                startTime: "13:00",
                endTime: "16:30",
                homeoffice: true,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-11-07",
        label: "Samstag, 07.11.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-11-08",
        label: "Sonntag, 08.11.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-11-09",
        label: "Montag, 09.11.2026",
        blocks: [
            {
                id: 55,
                startTime: "08:30",
                endTime: "12:30",
                homeoffice: true,
            },
            {
                id: 56,
                startTime: "13:15",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
            {
                id: 17,
                minutes: 60,
                reason: "Arzttermin",
            },
        ],
    },

    {
        date: "2026-11-10",
        label: "Dienstag, 10.11.2026",
        blocks: [
            {
                id: 57,
                startTime: "08:00",
                endTime: "15:30",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-11-11",
        label: "Mittwoch, 11.11.2026",
        blocks: [
            {
                id: 58,
                startTime: "08:00",
                endTime: "12:00",
                homeoffice: false,
            },
            {
                id: 59,
                startTime: "13:00",
                endTime: "16:30",
                homeoffice: true,
            },
        ],
        credits: [
            {
                id: 18,
                minutes: 60,
                reason: "Hochschulveranstaltung",
            },
        ],
    },

    {
        date: "2026-11-12",
        label: "Donnerstag, 12.11.2026",
        blocks: [
            {
                id: 60,
                startTime: "09:00",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
            {
                id: 19,
                minutes: 30,
                reason: "Sonstiges",
            },
        ],
    },

    {
        date: "2026-11-13",
        label: "Freitag, 13.11.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-11-14",
        label: "Samstag, 14.11.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-11-15",
        label: "Sonntag, 15.11.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-11-16",
        label: "Montag, 16.11.2026",
        blocks: [
            {
                id: 61,
                startTime: "08:00",
                endTime: "12:00",
                homeoffice: false,
            },
            {
                id: 62,
                startTime: "13:00",
                endTime: "16:30",
                homeoffice: true,
            },
        ],
        credits: [
            {
                id: 20,
                minutes: 60,
                reason: "Arzttermin",
            },
        ],
    },

    {
        date: "2026-11-17",
        label: "Dienstag, 17.11.2026",
        blocks: [
            {
                id: 63,
                startTime: "09:00",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-11-18",
        label: "Mittwoch, 18.11.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-11-19",
        label: "Donnerstag, 19.11.2026",
        blocks: [
            {
                id: 64,
                startTime: "08:30",
                endTime: "12:30",
                homeoffice: true,
            },
            {
                id: 65,
                startTime: "13:15",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-11-20",
        label: "Freitag, 20.11.2026",
        blocks: [
            {
                id: 66,
                startTime: "08:00",
                endTime: "15:30",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-11-21",
        label: "Samstag, 21.11.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-11-22",
        label: "Sonntag, 22.11.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-11-23",
        label: "Montag, 23.11.2026",
        blocks: [
        ],
        credits: [
            {
                id: 21,
                minutes: 60,
                reason: "Arzttermin",
            },
            {
                id: 22,
                minutes: 30,
                reason: "Sonstiges",
            },
        ],
    },

    {
        date: "2026-11-24",
        label: "Dienstag, 24.11.2026",
        blocks: [
            {
                id: 67,
                startTime: "08:30",
                endTime: "12:30",
                homeoffice: true,
            },
            {
                id: 68,
                startTime: "13:15",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
            {
                id: 23,
                minutes: 60,
                reason: "Hochschulveranstaltung",
            },
        ],
    },

    {
        date: "2026-11-25",
        label: "Mittwoch, 25.11.2026",
        blocks: [
            {
                id: 69,
                startTime: "08:00",
                endTime: "15:30",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-11-26",
        label: "Donnerstag, 26.11.2026",
        blocks: [
            {
                id: 70,
                startTime: "08:00",
                endTime: "12:00",
                homeoffice: false,
            },
            {
                id: 71,
                startTime: "13:00",
                endTime: "16:30",
                homeoffice: true,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-11-27",
        label: "Freitag, 27.11.2026",
        blocks: [
            {
                id: 72,
                startTime: "09:00",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-11-28",
        label: "Samstag, 28.11.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-11-29",
        label: "Sonntag, 29.11.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-11-30",
        label: "Montag, 30.11.2026",
        blocks: [
            {
                id: 73,
                startTime: "08:00",
                endTime: "15:30",
                homeoffice: false,
            },
        ],
        credits: [
            {
                id: 24,
                minutes: 60,
                reason: "Arzttermin",
            },
        ],
    },

    {
        date: "2026-12-01",
        label: "Dienstag, 01.12.2026",
        blocks: [
            {
                id: 74,
                startTime: "08:00",
                endTime: "12:00",
                homeoffice: false,
            },
            {
                id: 75,
                startTime: "13:00",
                endTime: "16:30",
                homeoffice: true,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-12-02",
        label: "Mittwoch, 02.12.2026",
        blocks: [
            {
                id: 76,
                startTime: "09:00",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-12-03",
        label: "Donnerstag, 03.12.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-12-04",
        label: "Freitag, 04.12.2026",
        blocks: [
            {
                id: 77,
                startTime: "08:30",
                endTime: "12:30",
                homeoffice: true,
            },
            {
                id: 78,
                startTime: "13:15",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
            {
                id: 25,
                minutes: 30,
                reason: "Sonstiges",
            },
        ],
    },

    {
        date: "2026-12-05",
        label: "Samstag, 05.12.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-12-06",
        label: "Sonntag, 06.12.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-12-07",
        label: "Montag, 07.12.2026",
        blocks: [
            {
                id: 79,
                startTime: "09:00",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
            {
                id: 26,
                minutes: 60,
                reason: "Arzttermin",
            },
            {
                id: 27,
                minutes: 60,
                reason: "Hochschulveranstaltung",
            },
        ],
    },

    {
        date: "2026-12-08",
        label: "Dienstag, 08.12.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-12-09",
        label: "Mittwoch, 09.12.2026",
        blocks: [
            {
                id: 80,
                startTime: "08:30",
                endTime: "12:30",
                homeoffice: true,
            },
            {
                id: 81,
                startTime: "13:15",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-12-10",
        label: "Donnerstag, 10.12.2026",
        blocks: [
            {
                id: 82,
                startTime: "08:00",
                endTime: "15:30",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-12-11",
        label: "Freitag, 11.12.2026",
        blocks: [
            {
                id: 83,
                startTime: "08:00",
                endTime: "12:00",
                homeoffice: false,
            },
            {
                id: 84,
                startTime: "13:00",
                endTime: "16:30",
                homeoffice: true,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-12-12",
        label: "Samstag, 12.12.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-12-13",
        label: "Sonntag, 13.12.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-12-14",
        label: "Montag, 14.12.2026",
        blocks: [
            {
                id: 85,
                startTime: "08:30",
                endTime: "12:30",
                homeoffice: true,
            },
            {
                id: 86,
                startTime: "13:15",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
            {
                id: 28,
                minutes: 60,
                reason: "Arzttermin",
            },
        ],
    },

    {
        date: "2026-12-15",
        label: "Dienstag, 15.12.2026",
        blocks: [
            {
                id: 87,
                startTime: "08:00",
                endTime: "15:30",
                homeoffice: false,
            },
        ],
        credits: [
            {
                id: 29,
                minutes: 30,
                reason: "Sonstiges",
            },
        ],
    },

    {
        date: "2026-12-16",
        label: "Mittwoch, 16.12.2026",
        blocks: [
            {
                id: 88,
                startTime: "08:00",
                endTime: "12:00",
                homeoffice: false,
            },
            {
                id: 89,
                startTime: "13:00",
                endTime: "16:30",
                homeoffice: true,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-12-17",
        label: "Donnerstag, 17.12.2026",
        blocks: [
            {
                id: 90,
                startTime: "09:00",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-12-18",
        label: "Freitag, 18.12.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-12-19",
        label: "Samstag, 19.12.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-12-20",
        label: "Sonntag, 20.12.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-12-21",
        label: "Montag, 21.12.2026",
        blocks: [
            {
                id: 91,
                startTime: "08:00",
                endTime: "12:00",
                homeoffice: false,
            },
            {
                id: 92,
                startTime: "13:00",
                endTime: "16:30",
                homeoffice: true,
            },
        ],
        credits: [
            {
                id: 30,
                minutes: 60,
                reason: "Arzttermin",
            },
        ],
    },

    {
        date: "2026-12-22",
        label: "Dienstag, 22.12.2026",
        blocks: [
            {
                id: 93,
                startTime: "09:00",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-12-23",
        label: "Mittwoch, 23.12.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-12-24",
        label: "Donnerstag, 24.12.2026",
        blocks: [
            {
                id: 94,
                startTime: "08:30",
                endTime: "12:30",
                homeoffice: true,
            },
            {
                id: 95,
                startTime: "13:15",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-12-25",
        label: "Freitag, 25.12.2026",
        blocks: [
            {
                id: 96,
                startTime: "08:00",
                endTime: "15:30",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-12-26",
        label: "Samstag, 26.12.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-12-27",
        label: "Sonntag, 27.12.2026",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2026-12-28",
        label: "Montag, 28.12.2026",
        blocks: [
        ],
        credits: [
            {
                id: 31,
                minutes: 60,
                reason: "Arzttermin",
            },
        ],
    },

    {
        date: "2026-12-29",
        label: "Dienstag, 29.12.2026",
        blocks: [
            {
                id: 97,
                startTime: "08:30",
                endTime: "12:30",
                homeoffice: true,
            },
            {
                id: 98,
                startTime: "13:15",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-12-30",
        label: "Mittwoch, 30.12.2026",
        blocks: [
            {
                id: 99,
                startTime: "08:00",
                endTime: "15:30",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2026-12-31",
        label: "Donnerstag, 31.12.2026",
        blocks: [
            {
                id: 100,
                startTime: "08:00",
                endTime: "12:00",
                homeoffice: false,
            },
            {
                id: 101,
                startTime: "13:00",
                endTime: "16:30",
                homeoffice: true,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2027-01-01",
        label: "Freitag, 01.01.2027",
        blocks: [
            {
                id: 102,
                startTime: "09:00",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2027-01-02",
        label: "Samstag, 02.01.2027",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2027-01-03",
        label: "Sonntag, 03.01.2027",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2027-01-04",
        label: "Montag, 04.01.2027",
        blocks: [
            {
                id: 103,
                startTime: "08:00",
                endTime: "15:30",
                homeoffice: false,
            },
        ],
        credits: [
            {
                id: 32,
                minutes: 60,
                reason: "Arzttermin",
            },
        ],
    },

    {
        date: "2027-01-05",
        label: "Dienstag, 05.01.2027",
        blocks: [
            {
                id: 104,
                startTime: "08:00",
                endTime: "12:00",
                homeoffice: false,
            },
            {
                id: 105,
                startTime: "13:00",
                endTime: "16:30",
                homeoffice: true,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2027-01-06",
        label: "Mittwoch, 06.01.2027",
        blocks: [
            {
                id: 106,
                startTime: "09:00",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
            {
                id: 33,
                minutes: 30,
                reason: "Sonstiges",
            },
        ],
    },

    {
        date: "2027-01-07",
        label: "Donnerstag, 07.01.2027",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2027-01-08",
        label: "Freitag, 08.01.2027",
        blocks: [
            {
                id: 107,
                startTime: "08:30",
                endTime: "12:30",
                homeoffice: true,
            },
            {
                id: 108,
                startTime: "13:15",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2027-01-09",
        label: "Samstag, 09.01.2027",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2027-01-10",
        label: "Sonntag, 10.01.2027",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2027-01-11",
        label: "Montag, 11.01.2027",
        blocks: [
            {
                id: 109,
                startTime: "09:00",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
            {
                id: 34,
                minutes: 60,
                reason: "Arzttermin",
            },
        ],
    },

    {
        date: "2027-01-12",
        label: "Dienstag, 12.01.2027",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2027-01-13",
        label: "Mittwoch, 13.01.2027",
        blocks: [
            {
                id: 110,
                startTime: "08:30",
                endTime: "12:30",
                homeoffice: true,
            },
            {
                id: 111,
                startTime: "13:15",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2027-01-14",
        label: "Donnerstag, 14.01.2027",
        blocks: [
            {
                id: 112,
                startTime: "08:00",
                endTime: "15:30",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2027-01-15",
        label: "Freitag, 15.01.2027",
        blocks: [
            {
                id: 113,
                startTime: "08:00",
                endTime: "12:00",
                homeoffice: false,
            },
            {
                id: 114,
                startTime: "13:00",
                endTime: "16:30",
                homeoffice: true,
            },
        ],
        credits: [
            {
                id: 35,
                minutes: 60,
                reason: "Hochschulveranstaltung",
            },
        ],
    },

    {
        date: "2027-01-16",
        label: "Samstag, 16.01.2027",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2027-01-17",
        label: "Sonntag, 17.01.2027",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2027-01-18",
        label: "Montag, 18.01.2027",
        blocks: [
            {
                id: 115,
                startTime: "08:30",
                endTime: "12:30",
                homeoffice: true,
            },
            {
                id: 116,
                startTime: "13:15",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
            {
                id: 36,
                minutes: 60,
                reason: "Arzttermin",
            },
        ],
    },

    {
        date: "2027-01-19",
        label: "Dienstag, 19.01.2027",
        blocks: [
            {
                id: 117,
                startTime: "08:00",
                endTime: "15:30",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2027-01-20",
        label: "Mittwoch, 20.01.2027",
        blocks: [
            {
                id: 118,
                startTime: "08:00",
                endTime: "12:00",
                homeoffice: false,
            },
            {
                id: 119,
                startTime: "13:00",
                endTime: "16:30",
                homeoffice: true,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2027-01-21",
        label: "Donnerstag, 21.01.2027",
        blocks: [
            {
                id: 120,
                startTime: "09:00",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2027-01-22",
        label: "Freitag, 22.01.2027",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2027-01-23",
        label: "Samstag, 23.01.2027",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2027-01-24",
        label: "Sonntag, 24.01.2027",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2027-01-25",
        label: "Montag, 25.01.2027",
        blocks: [
            {
                id: 121,
                startTime: "08:00",
                endTime: "12:00",
                homeoffice: false,
            },
            {
                id: 122,
                startTime: "13:00",
                endTime: "16:30",
                homeoffice: true,
            },
        ],
        credits: [
            {
                id: 37,
                minutes: 60,
                reason: "Arzttermin",
            },
        ],
    },

    {
        date: "2027-01-26",
        label: "Dienstag, 26.01.2027",
        blocks: [
            {
                id: 123,
                startTime: "09:00",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2027-01-27",
        label: "Mittwoch, 27.01.2027",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2027-01-28",
        label: "Donnerstag, 28.01.2027",
        blocks: [
            {
                id: 124,
                startTime: "08:30",
                endTime: "12:30",
                homeoffice: true,
            },
            {
                id: 125,
                startTime: "13:15",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
            {
                id: 38,
                minutes: 30,
                reason: "Sonstiges",
            },
            {
                id: 39,
                minutes: 60,
                reason: "Hochschulveranstaltung",
            },
        ],
    },

    {
        date: "2027-01-29",
        label: "Freitag, 29.01.2027",
        blocks: [
            {
                id: 126,
                startTime: "08:00",
                endTime: "15:30",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2027-01-30",
        label: "Samstag, 30.01.2027",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2027-01-31",
        label: "Sonntag, 31.01.2027",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2027-02-01",
        label: "Montag, 01.02.2027",
        blocks: [
        ],
        credits: [
            {
                id: 40,
                minutes: 60,
                reason: "Arzttermin",
            },
        ],
    },

    {
        date: "2027-02-02",
        label: "Dienstag, 02.02.2027",
        blocks: [
            {
                id: 127,
                startTime: "08:30",
                endTime: "12:30",
                homeoffice: true,
            },
            {
                id: 128,
                startTime: "13:15",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2027-02-03",
        label: "Mittwoch, 03.02.2027",
        blocks: [
            {
                id: 129,
                startTime: "08:00",
                endTime: "15:30",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2027-02-04",
        label: "Donnerstag, 04.02.2027",
        blocks: [
            {
                id: 130,
                startTime: "08:00",
                endTime: "12:00",
                homeoffice: false,
            },
            {
                id: 131,
                startTime: "13:00",
                endTime: "16:30",
                homeoffice: true,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2027-02-05",
        label: "Freitag, 05.02.2027",
        blocks: [
            {
                id: 132,
                startTime: "09:00",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2027-02-06",
        label: "Samstag, 06.02.2027",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2027-02-07",
        label: "Sonntag, 07.02.2027",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2027-02-08",
        label: "Montag, 08.02.2027",
        blocks: [
            {
                id: 133,
                startTime: "08:00",
                endTime: "15:30",
                homeoffice: false,
            },
        ],
        credits: [
            {
                id: 41,
                minutes: 60,
                reason: "Arzttermin",
            },
            {
                id: 42,
                minutes: 30,
                reason: "Sonstiges",
            },
        ],
    },

    {
        date: "2027-02-09",
        label: "Dienstag, 09.02.2027",
        blocks: [
            {
                id: 134,
                startTime: "08:00",
                endTime: "12:00",
                homeoffice: false,
            },
            {
                id: 135,
                startTime: "13:00",
                endTime: "16:30",
                homeoffice: true,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2027-02-10",
        label: "Mittwoch, 10.02.2027",
        blocks: [
            {
                id: 136,
                startTime: "09:00",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
            {
                id: 43,
                minutes: 60,
                reason: "Hochschulveranstaltung",
            },
        ],
    },

    {
        date: "2027-02-11",
        label: "Donnerstag, 11.02.2027",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2027-02-12",
        label: "Freitag, 12.02.2027",
        blocks: [
            {
                id: 137,
                startTime: "08:30",
                endTime: "12:30",
                homeoffice: true,
            },
            {
                id: 138,
                startTime: "13:15",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2027-02-13",
        label: "Samstag, 13.02.2027",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2027-02-14",
        label: "Sonntag, 14.02.2027",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2027-02-15",
        label: "Montag, 15.02.2027",
        blocks: [
            {
                id: 139,
                startTime: "09:00",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
            {
                id: 44,
                minutes: 60,
                reason: "Arzttermin",
            },
        ],
    },

    {
        date: "2027-02-16",
        label: "Dienstag, 16.02.2027",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2027-02-17",
        label: "Mittwoch, 17.02.2027",
        blocks: [
            {
                id: 140,
                startTime: "08:30",
                endTime: "12:30",
                homeoffice: true,
            },
            {
                id: 141,
                startTime: "13:15",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2027-02-18",
        label: "Donnerstag, 18.02.2027",
        blocks: [
            {
                id: 142,
                startTime: "08:00",
                endTime: "15:30",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2027-02-19",
        label: "Freitag, 19.02.2027",
        blocks: [
            {
                id: 143,
                startTime: "08:00",
                endTime: "12:00",
                homeoffice: false,
            },
            {
                id: 144,
                startTime: "13:00",
                endTime: "16:30",
                homeoffice: true,
            },
        ],
        credits: [
            {
                id: 45,
                minutes: 30,
                reason: "Sonstiges",
            },
        ],
    },

    {
        date: "2027-02-20",
        label: "Samstag, 20.02.2027",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2027-02-21",
        label: "Sonntag, 21.02.2027",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2027-02-22",
        label: "Montag, 22.02.2027",
        blocks: [
            {
                id: 145,
                startTime: "08:30",
                endTime: "12:30",
                homeoffice: true,
            },
            {
                id: 146,
                startTime: "13:15",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
            {
                id: 46,
                minutes: 60,
                reason: "Arzttermin",
            },
        ],
    },

    {
        date: "2027-02-23",
        label: "Dienstag, 23.02.2027",
        blocks: [
            {
                id: 147,
                startTime: "08:00",
                endTime: "15:30",
                homeoffice: false,
            },
        ],
        credits: [
            {
                id: 47,
                minutes: 60,
                reason: "Hochschulveranstaltung",
            },
        ],
    },

    {
        date: "2027-02-24",
        label: "Mittwoch, 24.02.2027",
        blocks: [
            {
                id: 148,
                startTime: "08:00",
                endTime: "12:00",
                homeoffice: false,
            },
            {
                id: 149,
                startTime: "13:00",
                endTime: "16:30",
                homeoffice: true,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2027-02-25",
        label: "Donnerstag, 25.02.2027",
        blocks: [
            {
                id: 150,
                startTime: "09:00",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2027-02-26",
        label: "Freitag, 26.02.2027",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2027-02-27",
        label: "Samstag, 27.02.2027",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2027-02-28",
        label: "Sonntag, 28.02.2027",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2027-03-01",
        label: "Montag, 01.03.2027",
        blocks: [
            {
                id: 151,
                startTime: "08:00",
                endTime: "12:00",
                homeoffice: false,
            },
            {
                id: 152,
                startTime: "13:00",
                endTime: "16:30",
                homeoffice: true,
            },
        ],
        credits: [
            {
                id: 48,
                minutes: 60,
                reason: "Arzttermin",
            },
        ],
    },

    {
        date: "2027-03-02",
        label: "Dienstag, 02.03.2027",
        blocks: [
            {
                id: 153,
                startTime: "09:00",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
            {
                id: 49,
                minutes: 30,
                reason: "Sonstiges",
            },
        ],
    },

    {
        date: "2027-03-03",
        label: "Mittwoch, 03.03.2027",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2027-03-04",
        label: "Donnerstag, 04.03.2027",
        blocks: [
            {
                id: 154,
                startTime: "08:30",
                endTime: "12:30",
                homeoffice: true,
            },
            {
                id: 155,
                startTime: "13:15",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2027-03-05",
        label: "Freitag, 05.03.2027",
        blocks: [
            {
                id: 156,
                startTime: "08:00",
                endTime: "15:30",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2027-03-06",
        label: "Samstag, 06.03.2027",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2027-03-07",
        label: "Sonntag, 07.03.2027",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2027-03-08",
        label: "Montag, 08.03.2027",
        blocks: [
        ],
        credits: [
            {
                id: 50,
                minutes: 60,
                reason: "Arzttermin",
            },
            {
                id: 51,
                minutes: 60,
                reason: "Hochschulveranstaltung",
            },
        ],
    },

    {
        date: "2027-03-09",
        label: "Dienstag, 09.03.2027",
        blocks: [
            {
                id: 157,
                startTime: "08:30",
                endTime: "12:30",
                homeoffice: true,
            },
            {
                id: 158,
                startTime: "13:15",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2027-03-10",
        label: "Mittwoch, 10.03.2027",
        blocks: [
            {
                id: 159,
                startTime: "08:00",
                endTime: "15:30",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2027-03-11",
        label: "Donnerstag, 11.03.2027",
        blocks: [
            {
                id: 160,
                startTime: "08:00",
                endTime: "12:00",
                homeoffice: false,
            },
            {
                id: 161,
                startTime: "13:00",
                endTime: "16:30",
                homeoffice: true,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2027-03-12",
        label: "Freitag, 12.03.2027",
        blocks: [
            {
                id: 162,
                startTime: "09:00",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2027-03-13",
        label: "Samstag, 13.03.2027",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2027-03-14",
        label: "Sonntag, 14.03.2027",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2027-03-15",
        label: "Montag, 15.03.2027",
        blocks: [
            {
                id: 163,
                startTime: "08:00",
                endTime: "15:30",
                homeoffice: false,
            },
        ],
        credits: [
            {
                id: 52,
                minutes: 60,
                reason: "Arzttermin",
            },
        ],
    },

    {
        date: "2027-03-16",
        label: "Dienstag, 16.03.2027",
        blocks: [
            {
                id: 164,
                startTime: "08:00",
                endTime: "12:00",
                homeoffice: false,
            },
            {
                id: 165,
                startTime: "13:00",
                endTime: "16:30",
                homeoffice: true,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2027-03-17",
        label: "Mittwoch, 17.03.2027",
        blocks: [
            {
                id: 166,
                startTime: "09:00",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2027-03-18",
        label: "Donnerstag, 18.03.2027",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2027-03-19",
        label: "Freitag, 19.03.2027",
        blocks: [
            {
                id: 167,
                startTime: "08:30",
                endTime: "12:30",
                homeoffice: true,
            },
            {
                id: 168,
                startTime: "13:15",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

    {
        date: "2027-03-20",
        label: "Samstag, 20.03.2027",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2027-03-21",
        label: "Sonntag, 21.03.2027",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2027-03-22",
        label: "Montag, 22.03.2027",
        blocks: [
            {
                id: 169,
                startTime: "09:00",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
            {
                id: 53,
                minutes: 60,
                reason: "Arzttermin",
            },
        ],
    },

    {
        date: "2027-03-23",
        label: "Dienstag, 23.03.2027",
        blocks: [
        ],
        credits: [
        ],
    },

    {
        date: "2027-03-24",
        label: "Mittwoch, 24.03.2027",
        blocks: [
            {
                id: 170,
                startTime: "08:30",
                endTime: "12:30",
                homeoffice: true,
            },
            {
                id: 171,
                startTime: "13:15",
                endTime: "17:00",
                homeoffice: false,
            },
        ],
        credits: [
            {
                id: 54,
                minutes: 30,
                reason: "Sonstiges",
            },
        ],
    },

    {
        date: "2027-03-25",
        label: "Donnerstag, 25.03.2027",
        blocks: [
            {
                id: 172,
                startTime: "08:00",
                endTime: "15:30",
                homeoffice: false,
            },
        ],
        credits: [
        ],
    },

];