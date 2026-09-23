export type DayOfWeek =
  | 'السبت'
  | 'الأحد'
  | 'الاثنين'
  | 'الثلاثاء'
  | 'الأربعاء'
  | 'الخميس'
  | 'الجمعة';

export const DAY_ORDER: DayOfWeek[] = [
  'السبت',
  'الأحد',
  'الاثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
];

export const DAY_EN_MAP: Record<string, string> = {
  السبت: 'Saturday',
  الأحد: 'Sunday',
  الاثنين: 'Monday',
  الثلاثاء: 'Tuesday',
  الأربعاء: 'Wednesday',
  الخميس: 'Thursday',
  الجمعة: 'Friday',
};

export interface Session {
  day: string;
  activity: string; // 'نظري' | 'عملي'
  start: string;
  end: string;
  start_min: number;
  end_min: number;
  room: string;
  section: string;
  teacher: string;
}

export interface Course {
  code: string;
  name: string;
  year: number;
  sessions: Session[];
}

export interface SectionOption {
  course_code: string;
  course_name: string;
  activity: string;
  section_id: string;
  sessions: Session[];
}

export interface CourseBundle {
  course_code: string;
  course_name: string;
  options: SectionOption[];
  sessions: Session[];
  days_mask: number;
  earliest_by_day: [number, number][]; // [dayIndex, startMin]
}

export interface ScheduleAssignment {
  course_code: string;
  course_name: string;
  activity: string;
  section_id: string;
  session: Session;
}

export interface OptimizedTimetable {
  id: string;
  bundleChoices: CourseBundle[];
  assignments: ScheduleAssignment[];
  daysCount: number;
  gapMinutes: number;
  activeDays: DayOfWeek[];
  earliestMinutesSum: number;
  optimalProven: boolean;
  timedOut: boolean;
  excludedCourses: { code: string; name: string }[];
  alternatives?: OptimizedTimetable[];
}
