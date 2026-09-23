import { Course, CourseBundle, DayOfWeek, DAY_ORDER, OptimizedTimetable, ScheduleAssignment, SectionOption, Session } from '../types';

export function canonicalDay(day: string): DayOfWeek {
  const d = day.trim();
  const map: Record<string, DayOfWeek> = {
    'السبت': 'السبت',
    'saturday': 'السبت',
    'الأحد': 'الأحد',
    'الاحد': 'الأحد',
    'sunday': 'الأحد',
    'الاثنين': 'الاثنين',
    'الإثنين': 'الاثنين',
    'monday': 'الاثنين',
    'الثلاثاء': 'الثلاثاء',
    'tuesday': 'الثلاثاء',
    'الأربعاء': 'الأربعاء',
    'الاربعاء': 'الأربعاء',
    'wednesday': 'الأربعاء',
    'الخميس': 'الخميس',
    'thursday': 'الخميس',
    'الجمعة': 'الجمعة',
    'friday': 'الجمعة',
  };
  return map[d.toLowerCase()] || map[d] || 'السبت';
}

export function dayIndex(day: string): number {
  const c = canonicalDay(day);
  const idx = DAY_ORDER.indexOf(c);
  return idx >= 0 ? idx : 0;
}

export function sessionDuration(s: Session): number {
  if (s.end_min > s.start_min) {
    return s.end_min - s.start_min;
  }
  return 60; // fallback
}

/** Check if two time intervals overlap (same day) */
export function hasTimeOverlap(s1: number, e1: number, s2: number, e2: number): boolean {
  // End of one lecture coinciding with start of another is allowed (s1 < e2 && s2 < e1)
  return s1 < e2 && s2 < e1;
}

/** Check if two sessions overlap */
export function sessionsOverlap(s1: Session, s2: Session): boolean {
  if (canonicalDay(s1.day) !== canonicalDay(s2.day)) {
    return false;
  }
  return hasTimeOverlap(s1.start_min, s1.end_min, s2.start_min, s2.end_min);
}

/** Check if a list of sessions has internal conflict */
export function hasInternalOverlap(sessions: Session[]): boolean {
  for (let i = 0; i < sessions.length; i++) {
    for (let j = i + 1; j < sessions.length; j++) {
      if (sessionsOverlap(sessions[i], sessions[j])) {
        return true;
      }
    }
  }
  return false;
}

/** Generate a bitmask for a session's minutes */
export function sessionMask(s: Session): bigint {
  const start = BigInt(Math.max(0, s.start_min));
  const end = BigInt(Math.min(1440, s.end_min));
  if (end <= start) return 0n;
  const count = end - start;
  return ((1n << count) - 1n) << start;
}

/** Build course bundles (each bundle is a consistent combo of theory + lab sections for that course) */
export function buildCourseBundles(course: Course): CourseBundle[] {
  const byActivity: Record<string, Record<string, Session[]>> = {};

  for (const s of course.sessions) {
    const act = s.activity || 'نظري';
    const sec = s.section || '1';
    if (!byActivity[act]) byActivity[act] = {};
    if (!byActivity[act][sec]) byActivity[act][sec] = [];
    byActivity[act][sec].push(s);
  }

  const activities = Object.keys(byActivity);
  if (activities.length === 0) return [];

  const activityOptions: SectionOption[][] = [];
  for (const act of activities) {
    const sections = byActivity[act];
    const opts: SectionOption[] = [];
    for (const secId of Object.keys(sections)) {
      const sessList = sections[secId];
      if (hasInternalOverlap(sessList)) continue;
      opts.push({
        course_code: course.code,
        course_name: course.name,
        activity: act,
        section_id: secId,
        sessions: sessList,
      });
    }
    if (opts.length > 0) {
      activityOptions.push(opts);
    }
  }

  if (activityOptions.length === 0) return [];

  // Cartesian product across activities for this course
  let partials: { options: SectionOption[]; sessions: Session[] }[] = [{ options: [], sessions: [] }];

  for (const actOpts of activityOptions) {
    const nextPartials: { options: SectionOption[]; sessions: Session[] }[] = [];
    for (const p of partials) {
      for (const opt of actOpts) {
        // check compatibility with already chosen options for this course
        let conflict = false;
        for (const s1 of p.sessions) {
          for (const s2 of opt.sessions) {
            if (sessionsOverlap(s1, s2)) {
              conflict = true;
              break;
            }
          }
          if (conflict) break;
        }

        if (!conflict) {
          nextPartials.push({
            options: [...p.options, opt],
            sessions: [...p.sessions, ...opt.sessions],
          });
        }
      }
    }
    partials = nextPartials;
    if (partials.length === 0) break;
  }

  const bundles: CourseBundle[] = [];
  const seenSignatures = new Set<string>();

  for (const p of partials) {
    // Unique signature based on days and timings
    const sig = p.sessions
      .map((s) => `${canonicalDay(s.day)}_${s.start_min}_${s.end_min}`)
      .sort()
      .join('|');
    if (seenSignatures.has(sig)) continue;
    seenSignatures.add(sig);

    let daysMask = 0;
    const earliestMap: Record<number, number> = {};

    for (const s of p.sessions) {
      const dIdx = dayIndex(s.day);
      daysMask |= 1 << dIdx;
      if (earliestMap[dIdx] === undefined || s.start_min < earliestMap[dIdx]) {
        earliestMap[dIdx] = s.start_min;
      }
    }

    const earliestByDay: [number, number][] = Object.entries(earliestMap).map(([k, v]) => [
      Number(k),
      v,
    ]);

    bundles.push({
      course_code: course.code,
      course_name: course.name,
      options: p.options,
      sessions: p.sessions,
      days_mask: daysMask,
      earliest_by_day: earliestByDay,
    });
  }

  return bundles;
}

/** Check if two course bundles conflict with each other */
export function bundlesConflict(b1: CourseBundle, b2: CourseBundle): boolean {
  if ((b1.days_mask & b2.days_mask) === 0) {
    return false; // don't even share any days
  }
  for (const s1 of b1.sessions) {
    for (const s2 of b2.sessions) {
      if (sessionsOverlap(s1, s2)) {
        return true;
      }
    }
  }
  return false;
}

/** Calculate metrics: days, gap minutes, earliest start minutes */
export function evaluateTimetable(bundles: CourseBundle[]): {
  daysCount: number;
  gapMinutes: number;
  earliestMinutesSum: number;
  activeDays: DayOfWeek[];
} {
  const byDay: Record<string, Session[]> = {};

  for (const b of bundles) {
    for (const s of b.sessions) {
      const cd = canonicalDay(s.day);
      if (!byDay[cd]) byDay[cd] = [];
      byDay[cd].push(s);
    }
  }

  const activeDays = DAY_ORDER.filter((d) => byDay[d] && byDay[d].length > 0);
  const daysCount = activeDays.length;
  let gapMinutes = 0;
  let earliestMinutesSum = 0;

  for (const day of activeDays) {
    const list = [...byDay[day]].sort((a, b) => a.start_min - b.start_min);
    if (list.length > 0) {
      earliestMinutesSum += list[0].start_min;
    }
    for (let i = 1; i < list.length; i++) {
      const prevEnd = list[i - 1].end_min;
      const currStart = list[i].start_min;
      if (currStart > prevEnd) {
        gapMinutes += currStart - prevEnd;
      }
    }
  }

  return { daysCount, gapMinutes, earliestMinutesSum, activeDays };
}

/**
 * Compare two schedules lexicographically:
 * 1. Fewer study days (less days of attendance)
 * 2. Fewer total gap minutes between classes
 * 3. Earlier starting time sum (tie-breaker)
 */
export function isBetterSchedule(
  daysA: number,
  gapsA: number,
  earlyA: number,
  daysB: number,
  gapsB: number,
  earlyB: number
): boolean {
  if (daysA !== daysB) return daysA < daysB;
  if (gapsA !== gapsB) return gapsA < gapsB;
  return earlyA < earlyB;
}

/**
 * Exact Branch & Bound Search to find the optimal conflict-free schedule.
 * If all courses cannot fit without conflicts, searches for the maximum possible subset.
 */
export function findBestSchedules(
  courses: Course[],
  maxAlternatives = 2,
  timeBudgetMs = 6000
): OptimizedTimetable {
  const startTime = Date.now();
  let timedOut = false;

  // Filter courses with available sessions
  const validCourses: Course[] = [];
  const excludedEmpty: { code: string; name: string }[] = [];

  for (const c of courses) {
    if (!c.sessions || c.sessions.length === 0) {
      excludedEmpty.push({ code: c.code, name: c.name });
    } else {
      validCourses.push(c);
    }
  }

  if (validCourses.length === 0) {
    return {
      id: 'empty',
      bundleChoices: [],
      assignments: [],
      daysCount: 0,
      gapMinutes: 0,
      activeDays: [],
      earliestMinutesSum: 0,
      optimalProven: true,
      timedOut: false,
      excludedCourses: excludedEmpty,
      alternatives: [],
    };
  }

  // Precompute bundles for each course
  const courseBundlesMap = new Map<string, CourseBundle[]>();
  const invalidCourseCodes: string[] = [];

  for (const c of validCourses) {
    const bundles = buildCourseBundles(c);
    if (bundles.length === 0) {
      invalidCourseCodes.push(c.code);
      excludedEmpty.push({ code: c.code, name: c.name });
    } else {
      courseBundlesMap.set(c.code, bundles);
    }
  }

  const schedulableCourses = validCourses.filter((c) => !invalidCourseCodes.includes(c.code));
  if (schedulableCourses.length === 0) {
    return {
      id: 'no-valid',
      bundleChoices: [],
      assignments: [],
      daysCount: 0,
      gapMinutes: 0,
      activeDays: [],
      earliestMinutesSum: 0,
      optimalProven: true,
      timedOut: false,
      excludedCourses: excludedEmpty,
      alternatives: [],
    };
  }

  // Solve for target count: first try all schedulableCourses.length.
  // If no conflict-free solution exists, decrement target size to find maximal compatible subset!
  let bestFound: {
    bundles: CourseBundle[];
    days: number;
    gaps: number;
    early: number;
    coursesIncluded: string[];
  } | null = null;

  const alternativesList: {
    bundles: CourseBundle[];
    days: number;
    gaps: number;
    early: number;
    coursesIncluded: string[];
  }[] = [];

  // Helper search function for a specific subset of courses
  function searchSubset(
    targetCourseCodes: string[]
  ): {
    bestSolution: CourseBundle[] | null;
    bestDays: number;
    bestGaps: number;
    bestEarly: number;
  } {
    // Dynamic MRV: order courses by number of remaining bundle options
    const sortedCodes = [...targetCourseCodes].sort((a, b) => {
      const lenA = courseBundlesMap.get(a)?.length || 0;
      const lenB = courseBundlesMap.get(b)?.length || 0;
      return lenA - lenB;
    });

    let currentBestSolution: CourseBundle[] | null = null;
    let minDays = 999;
    let minGaps = 999999;
    let minEarly = 999999;

    function backtrack(
      courseIndex: number,
      currentBundles: CourseBundle[],
      busyByDay: Record<number, bigint>
    ) {
      if (Date.now() - startTime > timeBudgetMs) {
        timedOut = true;
        return;
      }

      if (courseIndex === sortedCodes.length) {
        const evalRes = evaluateTimetable(currentBundles);
        if (
          isBetterSchedule(
            evalRes.daysCount,
            evalRes.gapMinutes,
            evalRes.earliestMinutesSum,
            minDays,
            minGaps,
            minEarly
          )
        ) {
          minDays = evalRes.daysCount;
          minGaps = evalRes.gapMinutes;
          minEarly = evalRes.earliestMinutesSum;
          currentBestSolution = [...currentBundles];
        } else if (
          evalRes.daysCount === minDays &&
          evalRes.gapMinutes === minGaps &&
          currentBestSolution &&
          alternativesList.length < maxAlternatives
        ) {
          // Alternative schedule candidate
          alternativesList.push({
            bundles: [...currentBundles],
            days: evalRes.daysCount,
            gaps: evalRes.gapMinutes,
            early: evalRes.earliestMinutesSum,
            coursesIncluded: targetCourseCodes,
          });
        }
        return;
      }

      const cCode = sortedCodes[courseIndex];
      const availableBundles = courseBundlesMap.get(cCode) || [];

      for (const b of availableBundles) {
        if (Date.now() - startTime > timeBudgetMs) {
          timedOut = true;
          return;
        }

        // Check conflict with currently placed bundles
        let clash = false;
        for (const cb of currentBundles) {
          if (bundlesConflict(b, cb)) {
            clash = true;
            break;
          }
        }
        if (clash) continue;

        // Pruning: if current unique days already exceed minDays, prune
        const tempBundles = [...currentBundles, b];
        const partialEval = evaluateTimetable(tempBundles);
        if (partialEval.daysCount > minDays) {
          continue;
        }

        // Forward search
        currentBundles.push(b);
        backtrack(courseIndex + 1, currentBundles, busyByDay);
        currentBundles.pop();
      }
    }

    backtrack(0, [], {});
    return {
      bestSolution: currentBestSolution,
      bestDays: minDays,
      bestGaps: minGaps,
      bestEarly: minEarly,
    };
  }

  // Try finding a solution for all courses first
  const allCodes = schedulableCourses.map((c) => c.code);
  const fullResult = searchSubset(allCodes);

  if (fullResult.bestSolution) {
    bestFound = {
      bundles: fullResult.bestSolution,
      days: fullResult.bestDays,
      gaps: fullResult.bestGaps,
      early: fullResult.bestEarly,
      coursesIncluded: allCodes,
    };
  } else {
    // If impossible to combine all, find the maximal subset
    let foundMaximal = false;
    for (let k = allCodes.length - 1; k >= 1 && !foundMaximal; k--) {
      // Generate subsets of size k
      const subsets: string[][] = [];
      function makeSubsets(start: number, curr: string[]) {
        if (curr.length === k) {
          subsets.push([...curr]);
          return;
        }
        for (let i = start; i < allCodes.length; i++) {
          curr.push(allCodes[i]);
          makeSubsets(i + 1, curr);
          curr.pop();
        }
      }
      makeSubsets(0, []);

      // Try subsets of size k
      for (const sub of subsets) {
        if (Date.now() - startTime > timeBudgetMs) {
          timedOut = true;
          break;
        }
        const res = searchSubset(sub);
        if (res.bestSolution) {
          if (
            !bestFound ||
            isBetterSchedule(
              res.bestDays,
              res.bestGaps,
              res.bestEarly,
              bestFound.days,
              bestFound.gaps,
              bestFound.early
            )
          ) {
            bestFound = {
              bundles: res.bestSolution,
              days: res.bestDays,
              gaps: res.bestGaps,
              early: res.bestEarly,
              coursesIncluded: sub,
            };
            foundMaximal = true;
          }
        }
      }
    }
  }

  if (!bestFound || bestFound.bundles.length === 0) {
    return {
      id: 'none',
      bundleChoices: [],
      assignments: [],
      daysCount: 0,
      gapMinutes: 0,
      activeDays: [],
      earliestMinutesSum: 0,
      optimalProven: !timedOut,
      timedOut,
      excludedCourses: courses.map((c) => ({ code: c.code, name: c.name })),
      alternatives: [],
    };
  }

  // Build assignments
  const assignments: ScheduleAssignment[] = [];
  for (const b of bestFound.bundles) {
    for (const opt of b.options) {
      for (const s of opt.sessions) {
        assignments.push({
          course_code: opt.course_code,
          course_name: opt.course_name,
          activity: opt.activity,
          section_id: opt.section_id,
          session: s,
        });
      }
    }
  }

  const includedSet = new Set(bestFound.coursesIncluded);
  const excludedDueToConflict = courses
    .filter((c) => !includedSet.has(c.code))
    .map((c) => ({ code: c.code, name: c.name }));

  const activeDays = DAY_ORDER.filter((d) =>
    assignments.some((a) => canonicalDay(a.session.day) === d)
  );

  // Convert alternatives
  const alternatives: OptimizedTimetable[] = alternativesList.slice(0, maxAlternatives).map((alt, idx) => {
    const altAssignments: ScheduleAssignment[] = [];
    for (const b of alt.bundles) {
      for (const opt of b.options) {
        for (const s of opt.sessions) {
          altAssignments.push({
            course_code: opt.course_code,
            course_name: opt.course_name,
            activity: opt.activity,
            section_id: opt.section_id,
            session: s,
          });
        }
      }
    }
    const altDays = DAY_ORDER.filter((d) =>
      altAssignments.some((a) => canonicalDay(a.session.day) === d)
    );
    return {
      id: `alt-${idx + 1}`,
      bundleChoices: alt.bundles,
      assignments: altAssignments,
      daysCount: alt.days,
      gapMinutes: alt.gaps,
      activeDays: altDays,
      earliestMinutesSum: alt.early,
      optimalProven: true,
      timedOut: false,
      excludedCourses: excludedDueToConflict,
    };
  });

  return {
    id: 'optimal-1',
    bundleChoices: bestFound.bundles,
    assignments,
    daysCount: bestFound.days,
    gapMinutes: bestFound.gaps,
    activeDays,
    earliestMinutesSum: bestFound.early,
    optimalProven: !timedOut,
    timedOut,
    excludedCourses: excludedDueToConflict,
    alternatives,
  };
}
