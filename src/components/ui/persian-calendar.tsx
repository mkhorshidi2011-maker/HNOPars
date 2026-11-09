"use client";

import * as React from "react";
import { cn } from "cn";
import { toJalaali, toGregorian, jalaaliMonthLength } from "jalaali-js";

import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const PERSIAN_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

const PERSIAN_WEEKDAYS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

function toPersianDigits(str: string): string {
  return str.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);
}

interface PersianCalendarProps {
  className?: string;
  selected?: Date | undefined;
  onSelect?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  locale?: string;
}

function Calendar({
  className,
  selected,
  onSelect,
  disabled,
  locale,
}: PersianCalendarProps) {
  const isPersian = locale?.startsWith("fa");

  const [viewDate, setViewDate] = React.useState<Date>(() => {
    if (selected) return selected;
    if (isPersian) {
      const now = new Date();
      const j = toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
      const greg = toGregorian(j.jy, j.jm, j.jd);
      return new Date(greg.gy, greg.gm - 1, greg.gd);
    }
    return new Date();
  });

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(selected);

  const navigateMonth = (delta: number) => {
    if (isPersian) {
      const j = toJalaali(viewDate.getFullYear(), viewDate.getMonth() + 1, viewDate.getDate());
      let newJm = j.jm + delta;
      let newJy = j.jy;
      while (newJm > 12) {
        newJm -= 12;
        newJy++;
      }
      while (newJm < 1) {
        newJm += 12;
        newJy--;
      }
      const greg = toGregorian(newJy, newJm, Math.min(j.jd, jalaaliMonthLength(newJy, newJm)));
      setViewDate(new Date(greg.gy, greg.gm - 1, greg.gd));
    } else {
      setViewDate((d) => {
        const nd = new Date(d);
        nd.setMonth(nd.getMonth() + delta);
        return nd;
      });
    }
  };

  const handleDayClick = (day: Date) => {
    if (disabled?.(day)) return;
    setSelectedDate(day);
    onSelect?.(day);
  };

  const getPersianDate = (date: Date) => {
    return toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate());
  };

  const formatMonthCaption = (date: Date) => {
    if (isPersian) {
      const j = getPersianDate(date);
      return `${PERSIAN_MONTHS[j.jm - 1]} ${toPersianDigits(j.jy.toString())}`;
    }
    return date.toLocaleString(locale, { month: "long", year: "numeric" });
  };

  const formatWeekday = (date: Date) => {
    if (isPersian) {
      return PERSIAN_WEEKDAYS[date.getDay()];
    }
    return date.toLocaleString(locale, { weekday: "short" });
  };

  const formatDay = (date: Date) => {
    if (isPersian) {
      const j = getPersianDate(date);
      return toPersianDigits(j.jd.toString());
    }
    return date.getDate().toString();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const s = new Date(selectedDate);
    s.setHours(0, 0, 0, 0);
    return d.getTime() === s.getTime();
  };

  const isDisabled = (date: Date) => {
    if (disabled) return disabled(date);
    return false;
  };

  const weeks = React.useMemo(() => {
    const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const startDay = firstDayOfMonth.getDay();
    const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();

    if (isPersian) {
      const j = getPersianDate(firstDayOfMonth);
      const firstDayJalali = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
      const startDayJalali = firstDayJalali.getDay();
      const daysInMonthJalali = jalaaliMonthLength(j.jy, j.jm);

      const weeks: Date[][] = [];
      let week: Date[] = [];

      for (let i = 0; i < startDayJalali; i++) {
        const prevMonthDay = new Date(firstDayJalali);
        prevMonthDay.setDate(prevMonthDay.getDate() - (startDayJalali - i));
        week.push(prevMonthDay);
      }

      for (let day = 1; day <= daysInMonthJalali; day++) {
        const greg = toGregorian(j.jy, j.jm, day);
        week.push(new Date(greg.gy, greg.gm - 1, greg.gd));
        if (week.length === 7) {
          weeks.push(week);
          week = [];
        }
      }

      let nextMonthDay = 1;
      while (week.length < 7) {
        const nextMonth = j.jm === 12 ? 1 : j.jm + 1;
        const nextYear = j.jm === 12 ? j.jy + 1 : j.jy;
        const greg = toGregorian(nextYear, nextMonth, nextMonthDay);
        week.push(new Date(greg.gy, greg.gm - 1, greg.gd));
        nextMonthDay++;
      }
      if (week.length > 0) weeks.push(week);

      return weeks;
    }

    const weeks: Date[][] = [];
    let week: Date[] = [];

    for (let i = 0; i < startDay; i++) {
      const prevMonthDay = new Date(firstDayOfMonth);
      prevMonthDay.setDate(prevMonthDay.getDate() - (startDay - i));
      week.push(prevMonthDay);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
      week.push(date);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }

    let nextMonthDay = 1;
    while (week.length < 7) {
      const date = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, nextMonthDay);
      week.push(date);
      nextMonthDay++;
    }
    if (week.length > 0) weeks.push(week);

    return weeks;
  }, [viewDate, isPersian]);

  return (
    <div
      className={cn(
        "group/calendar bg-background p-2 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(7)]",
        className
      )}
      dir={isPersian ? "rtl" : "ltr"}
    >
      <div className="flex items-center justify-between gap-1 mb-4">
        <Button
          variant="ghost"
          size="icon"
          className="size-(--cell-size) p-0 select-none"
          onClick={() => navigateMonth(-1)}
          aria-label={isPersian ? "ماه قبل" : "Previous month"}
        >
          <ChevronRightIcon className="size-4" />
        </Button>
        <div className="flex-1 text-center font-medium">
          {formatMonthCaption(viewDate)}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-(--cell-size) p-0 select-none"
          onClick={() => navigateMonth(1)}
          aria-label={isPersian ? "ماه بعد" : "Next month"}
        >
          <ChevronLeftIcon className="size-4" />
        </Button>
      </div>

      <table className="w-full border-collapse" role="grid">
        <thead>
          <tr className="flex" role="row">
            {PERSIAN_WEEKDAYS.map((day, i) => (
              <th key={day} className="flex-1 rounded-(--cell-radius) text-[0.8rem] font-normal text-muted-foreground select-none py-2" role="columnheader">
                {isPersian ? day : new Date(2024, 0, i).toLocaleString(locale, { weekday: "short" })}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr key={weekIndex} className="mt-2 flex w-full" role="row">
              {week.map((day, dayIndex) => (
                <td key={dayIndex} className="flex-1" role="gridcell">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 leading-none font-normal",
                      isToday(day) && "bg-muted",
                      isSelected(day) && "bg-primary text-primary-foreground",
                      isDisabled(day) && "text-muted-foreground opacity-50 pointer-events-none",
                      day.getMonth() !== viewDate.getMonth() && "text-muted-foreground"
                    )}
                    onClick={() => handleDayClick(day)}
                    disabled={isDisabled(day)}
                    aria-selected={isSelected(day)}
                    aria-current={isToday(day) ? "date" : undefined}
                    tabIndex={isSelected(day) ? 0 : -1}
                  >
                    <span className="text-xs opacity-70">{formatDay(day)}</span>
                  </Button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { Calendar };