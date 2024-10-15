import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import NepaliDate from "nepali-date-converter";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  endLastSixMonthDate,
  formattedfiscalYearEndDate,
  formattedfiscalYearStartDate,
  formattedlastFIvefiscalYearStartDate,
  formattedlastfiscalYearEndDate,
  formattedlastfiscalYearStartDate,
  getEndOfQuarter,
  getLastQuarterEnd,
  getLastQuarterStart,
  getStartOfQuarter,
  startDateBeforeLast4Quarters,
  startLastSixMonthDate,
  thisSixMonthDate,
} from "../../utils/DateUtil";
import { ToastContainer } from "../../utils/toast";
import PageTitle from "../Typography/PageTitle";
import SingleSelectCheckbox from "../form/SingleSelectCheckbox";
import { getCurrentFormattedDate } from "../functions/getCurrentDateTime";

const CommonDateRange = ({ pageTitle = "", headerTitle = "", route = "" }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const cancelButtonRef = useRef(null);
  const dateFormat = localStorage.getItem("date");
  const [selectedDay, setSelectedDay] = useState("Today");
  const handleChange = (day) => {
    setSelectedDay(day);
  };

  const {
    setValue,
    watch,
    handleSubmit,
    getValues,
    register,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue("date_status", "today");
  }, []);

  const dateStatus = watch("date_status");

  //* to get todays date as default
  const todayDate = new Date();
  const previousDate = new Date();
  previousDate.setMonth(previousDate.getMonth() - 1);
  const defaultDate = todayDate.toLocaleDateString("en-CA");
  const defaultPreviousDate = previousDate.toLocaleDateString("en-CA");
  const previousNepaliDate = new NepaliDate(
    new Date(defaultPreviousDate)
  ).format("YYYY-MM-DD");

  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const defaultTomorrowDate = tomorrowDate.toLocaleDateString("en-CA");

  const yesterdayDate = new Date(todayDate);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const defaultYesterdayDate = yesterdayDate.toLocaleDateString("en-CA");

  const lastThreeDays = new Date(todayDate);
  lastThreeDays.setDate(todayDate.getDate() - 3);
  const defaultlastThreeDays = lastThreeDays.toLocaleDateString("en-CA");

  const lastSevenDays = new Date(todayDate);
  lastSevenDays.setDate(todayDate.getDate() - 7);
  const defaultlastSevenDays = lastSevenDays.toLocaleDateString("en-CA");

  const lastFourteenDays = new Date(todayDate);
  lastFourteenDays.setDate(todayDate.getDate() - 14);
  const defaultlastFourteenDays = lastFourteenDays.toLocaleDateString("en-CA");

  const currentDayOfWeek = todayDate.getDay();
  const daysUntilSunday = currentDayOfWeek === 0 ? 0 : currentDayOfWeek;
  const currentSunday = new Date(todayDate);
  currentSunday.setDate(todayDate.getDate() - daysUntilSunday);
  const defaultThisWeek = currentSunday.toLocaleDateString("en-CA");

  const currentDate = new Date();
  const currentDay = currentDate.getDay();
  const daysSinceLastSunday = currentDay === 0 ? 0 : currentDay;
  const daysUntilLastSunday = daysSinceLastSunday + 7;
  const daysUntilLastSaturday = daysSinceLastSunday + 1;
  const lastSundayDate = new Date(currentDate);
  lastSundayDate.setDate(currentDate.getDate() - daysUntilLastSunday);
  // new Date object for the last Saturday
  const lastSaturdayDate = new Date(currentDate);
  lastSaturdayDate.setDate(currentDate.getDate() - daysUntilLastSaturday);
  // Format the dates
  const formattedLastSundayDate = lastSundayDate.toLocaleDateString("en-CA");
  const formattedLastSaturdayDate =
    lastSaturdayDate.toLocaleDateString("en-CA");

  const daysInFourWeeks = 28;
  const dateBeforeFourWeeks = new Date(todayDate);
  dateBeforeFourWeeks.setDate(todayDate.getDate() - daysInFourWeeks);
  const formattedDateBeforeFourWeeks =
    dateBeforeFourWeeks.toLocaleDateString("en-CA");
  const daysInTwelveWeeks = 84;
  const dateBeforeTwelveWeeks = new Date(todayDate);
  dateBeforeTwelveWeeks.setDate(todayDate.getDate() - daysInTwelveWeeks);
  const formattedDateBeforeTwelveWeeks =
    dateBeforeTwelveWeeks.toLocaleDateString("en-CA");

  const dyasInFiftyTwoWeeks = 364;
  const dateBeforeFiftyTwoWeeks = new Date(todayDate);
  dateBeforeFiftyTwoWeeks.setDate(todayDate.getDate() - dyasInFiftyTwoWeeks);
  const formattedDateBeforeFiftyTwoWeeks =
    dateBeforeFiftyTwoWeeks.toLocaleDateString("en-CA");

  const firstDayOfMonth = new Date(
    todayDate.getFullYear(),
    todayDate.getMonth(),
    1
  );
  const defaultThisMonth = firstDayOfMonth.toLocaleDateString("en-CA");

  // last month date calculated

  const lastDayOfPreviousMonth = new Date(
    todayDate.getFullYear(),
    todayDate.getMonth(),
    0
  );
  const firstDayOfPreviousMonth = new Date(
    lastDayOfPreviousMonth.getFullYear(),
    lastDayOfPreviousMonth.getMonth(),
    1
  );
  const defaultFirstDayOfPreviousMonth =
    firstDayOfPreviousMonth.toLocaleDateString("en-CA");
  const defaultLastDayOfPreviousMonth =
    lastDayOfPreviousMonth.toLocaleDateString("en-CA");

  const sixmonthDate = new Date();
  sixmonthDate.setMonth(sixmonthDate.getMonth() - 6);
  const defaultSixmonthDate = sixmonthDate.toLocaleDateString("en-CA");

  const twelvemonthDate = new Date();
  twelvemonthDate.setMonth(twelvemonthDate.getMonth() - 12);
  const defaultTwelvemonthDate = twelvemonthDate.toLocaleDateString("en-CA");

  const currentYear = todayDate.getFullYear();
  const firstDateOfYear = new Date(currentYear, 0, 1);
  const defaultFirstDateOfYear = firstDateOfYear.toLocaleDateString("en-CA");

  const firstDayOfPreviousYear = new Date(todayDate.getFullYear() - 1, 0, 1);
  const defaultFirstDayOfPreviousYear =
    firstDayOfPreviousYear.toLocaleDateString("en-CA");
  const lastDayOfPreviousYear = new Date(todayDate.getFullYear(), 0, 0);
  const defaultLastDayOfPreviousYear =
    lastDayOfPreviousYear.toLocaleDateString("en-CA");

  const dateBeforeFiveYears = new Date(todayDate);
  dateBeforeFiveYears.setFullYear(todayDate.getFullYear() - 5);
  const defaultDateBeforeFiveYears =
    dateBeforeFiveYears.toLocaleDateString("en-CA");

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const defaultOneWeekDate = oneWeekAgo.toLocaleDateString("en-CA");

  const threemonthDate = new Date();
  threemonthDate.setMonth(threemonthDate.getMonth() - 3);
  const defaultThreemonthDate = threemonthDate.toLocaleDateString("en-CA");

  // const currentyear = new Date();
  // currentYear.setFullYear(currentYear.getFullYear() - 1);
  // const defaultCurrentYear = currentYear.toLocaleDateString("en-CA");

  const onsubmit = async () => {
    let fromDate, toDate;
    const year = getValues("year");
    const month = getValues("month");

    if (selectedDay === "Today") {
      fromDate = getCurrentFormattedDate();
      toDate = defaultTomorrowDate;
    } else if (selectedDay === "Yesterday") {
      fromDate = defaultYesterdayDate;
      toDate = defaultDate;
    } else if (selectedDay === "Last_3_days") {
      fromDate = defaultlastThreeDays;
      toDate = defaultDate;
    } else if (selectedDay === "Last_7_days") {
      fromDate = defaultlastSevenDays;
      toDate = defaultDate;
    } else if (selectedDay === "Last_14_days") {
      fromDate = defaultlastFourteenDays;
      toDate = defaultDate;
    } else if (selectedDay === "this_week") {
      fromDate = defaultThisWeek;
      toDate = defaultTomorrowDate;
    } else if (selectedDay === "last_week") {
      fromDate = formattedLastSundayDate;
      toDate = formattedLastSaturdayDate;
    } else if (selectedDay === "Last_4_weeks") {
      fromDate = formattedDateBeforeFourWeeks;
      toDate = defaultTomorrowDate;
    } else if (selectedDay === "Last_12_weeks") {
      fromDate = formattedDateBeforeTwelveWeeks;
      toDate = defaultTomorrowDate;
    } else if (selectedDay === "Last_52_weeks") {
      fromDate = formattedDateBeforeFiftyTwoWeeks;
      toDate = defaultTomorrowDate;
    } else if (selectedDay === "this_month") {
      fromDate = defaultThisMonth;
      toDate = defaultTomorrowDate;
    } else if (selectedDay === "last_month") {
      fromDate = defaultFirstDayOfPreviousMonth;
      toDate = defaultLastDayOfPreviousMonth;
    } else if (selectedDay === "last_3_months") {
      fromDate = defaultThreemonthDate;
      toDate = defaultTomorrowDate;
    } else if (selectedDay === "last_6_months") {
      fromDate = defaultSixmonthDate;
      toDate = defaultTomorrowDate;
    } else if (selectedDay === "last_12_months") {
      fromDate = defaultTwelvemonthDate;
      toDate = defaultTomorrowDate;
    } else if (selectedDay === "this_year") {
      fromDate = defaultFirstDateOfYear;
      toDate = getCurrentFormattedDate();
    } else if (selectedDay === "last_year") {
      fromDate = defaultFirstDayOfPreviousYear;
      toDate = defaultLastDayOfPreviousYear;
    } else if (selectedDay === "last_5_years") {
      fromDate = defaultDateBeforeFiveYears;
      toDate = getCurrentFormattedDate();
    } else if (selectedDay === "this_quarter") {
      fromDate = getStartOfQuarter();
      toDate = getEndOfQuarter();
    } else if (selectedDay === "last_quarter") {
      fromDate = getLastQuarterStart();
      toDate = getLastQuarterEnd();
    } else if (selectedDay === "last_4_quarters") {
      fromDate = startDateBeforeLast4Quarters;
      toDate = getCurrentFormattedDate();
    } else if (selectedDay === "this_six_month") {
      fromDate = thisSixMonthDate;
      toDate = getCurrentFormattedDate();
    } else if (selectedDay === "last_six_month") {
      fromDate = startLastSixMonthDate;
      toDate = endLastSixMonthDate;
    } else if (selectedDay === "last_2_six_months") {
      fromDate = startLastSixMonthDate;
      toDate = getCurrentFormattedDate();
    } else if (selectedDay === "this_financial_year") {
      fromDate = formattedfiscalYearStartDate;
      toDate = formattedfiscalYearEndDate;
    } else if (selectedDay === "last_financial_year") {
      fromDate = formattedlastfiscalYearStartDate;
      toDate = formattedlastfiscalYearEndDate;
    } else if (selectedDay === "last_5_financial_year") {
      fromDate = formattedlastFIvefiscalYearStartDate;
      toDate = formattedlastfiscalYearEndDate;
    } else if (dateStatus === "current_year") {
      fromDate = defaultCurrentYear;
      toDate = defaultTomorrowDate;
    } else if (selectedDay === "custom") {
      fromDate = getValues("from_date");
      toDate = getValues("to_date");
    }

    //* function to change nepali date to english for 9.1,9.2,9.3 generate report
    if (year && month) {
      const getFrom = new NepaliDate(year, month, 1).getAD();
      const getTo = new NepaliDate(year, month, 32).getAD();

      const getFromYear = getFrom.month === 0 ? getFrom.year - 1 : getFrom.year;
      const getToYear = getTo.month === 0 ? getTo.year - 1 : getTo.year;

      const getFromMonth = getFrom.month === 0 ? 12 : getFrom.month;
      const getToMonth = getTo.month === 0 ? 12 : getTo.month;

      fromDate = `${getFromYear}-${getFromMonth
        .toString()
        .padStart(2, "0")}-${getFrom.date.toString().padStart(2, "0")}`;
      toDate = `${getToYear}-${getToMonth
        .toString()
        .padStart(2, "0")}-${getTo.date.toString().padStart(2, "0")}`;
    }

    navigate(`${route}`, {
      state: { fromDate, toDate },
    });
  };
  return (
    <div>
      <ToastContainer />
      <PageTitle>{pageTitle}</PageTitle>
      <form className="grid col-span-1 gap-5 bg-white dark:bg-gray-800 dark:text-white p-5">
        <div>
          <span className="text-gray-700 dark:text-gray-200 font-bold">
            Please select date range below to view {headerTitle}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="">
            <div className="text-gray-700 dark:text-gray-200 font-bold">
              Days
            </div>
            <SingleSelectCheckbox
              id="today"
              label="Today"
              value="Today"
              register={register}
              checked={selectedDay === "Today"}
              handleChange={handleChange}
            />
            <SingleSelectCheckbox
              id="Yesterday"
              label="Yesterday"
              value="Yesterday"
              register={register}
              checked={selectedDay === "Yesterday"}
              handleChange={handleChange}
            />
            <SingleSelectCheckbox
              id="Last_3_days"
              label="Last 3 Days"
              value="Last_3_days"
              register={register}
              checked={selectedDay === "Last_3_days"}
              handleChange={handleChange}
            />
            <SingleSelectCheckbox
              id="Last_7_days"
              label="Last 7 Days"
              value="Last_7_days"
              register={register}
              checked={selectedDay === "Last_7_days"}
              handleChange={handleChange}
            />
            <SingleSelectCheckbox
              id="Last_14_days"
              label="Last 14 Days"
              value="Last_14_days"
              register={register}
              checked={selectedDay === "Last_14_days"}
              handleChange={handleChange}
            />
          </div>
          <div className="">
            <div className="text-gray-700 dark:text-gray-200 font-bold">
              Weeks
            </div>
            <SingleSelectCheckbox
              id="this_week"
              label="This Week"
              value="this_week"
              register={register}
              checked={selectedDay === "this_week"}
              handleChange={handleChange}
            />
            <SingleSelectCheckbox
              id="last_week"
              label="Last Week"
              value="last_week"
              register={register}
              checked={selectedDay === "last_week"}
              handleChange={handleChange}
            />
            <SingleSelectCheckbox
              id="Last_4_weeks"
              label="Last 4 weeks"
              value="Last_4_weeks"
              register={register}
              checked={selectedDay === "Last_4_weeks"}
              handleChange={handleChange}
            />
            <SingleSelectCheckbox
              id="Last_12_weeks"
              label="Last 12 Weeks"
              value="Last_12_weeks"
              register={register}
              checked={selectedDay === "Last_12_weeks"}
              handleChange={handleChange}
            />
            <SingleSelectCheckbox
              id="Last_52_weeks"
              label="Last 52 Weeks"
              value="Last_52_weeks"
              register={register}
              checked={selectedDay === "Last_52_weeks"}
              handleChange={handleChange}
            />
            {/* <SingleSelectCheckbox
                            id="weeks_this_year"
                            label="Weeks This Year"
                            value="weeks_this_year"
                            register={register}
                            checked={selectedDay === "weeks_this_year"}
                            handleChange={handleChange}
                          /> */}
          </div>
          <div className="">
            <div className="text-gray-700 dark:text-gray-200 font-bold">
              Months
            </div>
            <SingleSelectCheckbox
              id="this_month"
              label="This month"
              value="this_month"
              register={register}
              checked={selectedDay === "this_month"}
              handleChange={handleChange}
            />
            <SingleSelectCheckbox
              id="last_month"
              label="Last month"
              value="last_month"
              register={register}
              checked={selectedDay === "last_month"}
              handleChange={handleChange}
            />
            <SingleSelectCheckbox
              id="last_3_months"
              label="Last 3 months"
              value="last_3_months"
              register={register}
              checked={selectedDay === "last_3_months"}
              handleChange={handleChange}
            />
            <SingleSelectCheckbox
              id="last_6_months"
              label="Last 6 months"
              value="last_6_months"
              register={register}
              checked={selectedDay === "last_6_months"}
              handleChange={handleChange}
            />
            <SingleSelectCheckbox
              id="last_12_months"
              label="Last 12 months"
              value="last_12_months"
              register={register}
              checked={selectedDay === "last_12_months"}
              handleChange={handleChange}
            />
            {/* <SingleSelectCheckbox
                            id="months_this_year"
                            label="months This Year"
                            value="months_this_year"
                            register={register}
                            checked={selectedDay === "months_this_year"}
                            handleChange={handleChange}
                          /> */}
          </div>
          <div className="">
            <div className="text-gray-700 dark:text-gray-200 font-bold">
              Years
            </div>
            <SingleSelectCheckbox
              id="this_year"
              label="This Year"
              value="this_year"
              register={register}
              checked={selectedDay === "this_year"}
              handleChange={handleChange}
            />
            <SingleSelectCheckbox
              id="last_year"
              label="Last Year"
              value="last_year"
              register={register}
              checked={selectedDay === "last_year"}
              handleChange={handleChange}
            />
            <SingleSelectCheckbox
              id="last_5_years"
              label="Last 5 Years"
              value="last_5_years"
              register={register}
              checked={selectedDay === "last_5_years"}
              handleChange={handleChange}
            />
          </div>
          <div className="">
            <div className="text-gray-700 dark:text-gray-200 font-bold">
              Quarters
            </div>
            <SingleSelectCheckbox
              id="this_quarter"
              label="This Quarter"
              value="this_quarter"
              register={register}
              checked={selectedDay === "this_quarter"}
              handleChange={handleChange}
            />
            <SingleSelectCheckbox
              id="last_quarter"
              label="Last Quarter"
              value="last_quarter"
              register={register}
              checked={selectedDay === "last_quarter"}
              handleChange={handleChange}
            />
            <SingleSelectCheckbox
              id="last_4_quarters"
              label="Last 4 Quarters"
              value="last_4_quarters"
              register={register}
              checked={selectedDay === "last_4_quarters"}
              handleChange={handleChange}
            />
          </div>
          <div className="">
            <div className="text-gray-700 dark:text-gray-200 font-bold">
              Six-months
            </div>
            <SingleSelectCheckbox
              id="this_six_month"
              label="This six-month"
              value="this_six_month"
              register={register}
              checked={selectedDay === "this_six_month"}
              handleChange={handleChange}
            />
            <SingleSelectCheckbox
              id="last_six_month"
              label="Last six-month"
              value="last_six_month"
              register={register}
              checked={selectedDay === "last_six_month"}
              handleChange={handleChange}
            />
            <SingleSelectCheckbox
              id="last_2_six_months"
              label="Last 2 Six-months"
              value="last_2_six_months"
              register={register}
              checked={selectedDay === "last_2_six_months"}
              handleChange={handleChange}
            />
          </div>
          <div className="">
            <div className="text-gray-700 dark:text-gray-200 font-bold">
              Financial years
            </div>
            <SingleSelectCheckbox
              id="this_financial_year"
              label="This financial year"
              value="this_financial_year"
              register={register}
              checked={selectedDay === "this_financial_year"}
              handleChange={handleChange}
            />
            <SingleSelectCheckbox
              id="last_financial_year"
              label="Last financial year"
              value="last_financial_year"
              register={register}
              checked={selectedDay === "last_financial_year"}
              handleChange={handleChange}
            />
            <SingleSelectCheckbox
              id="last_5_financial_year"
              label="Last 5 financial year"
              value="last_5_financial_year"
              register={register}
              checked={selectedDay === "last_5_financial_year"}
              handleChange={handleChange}
            />
          </div>
          <div className="col-span-2">
            <div className="text-gray-700 dark:text-gray-200 font-bold">
              Custom Date
            </div>
            <SingleSelectCheckbox
              id="custom"
              label="Custom Date Range"
              value="custom"
              register={register}
              checked={selectedDay === "custom"}
              handleChange={handleChange}
            />
            {selectedDay === "custom" ? (
              <div className="grid grid-cols-2 gap-3 pb-48 mr-8">
                {/* //* from date  */}
                <div>
                  <div className="text-sm text-gray-600 dark:text-white">
                    Enter From Date:
                  </div>
                  <div>
                    {dateFormat === "bs" ? (
                      <Calendar
                        onChange={({ bsDate, adDate }) => {
                          setValue("from_date", adDate);
                        }}
                        defaultDate={previousNepaliDate}
                        language="en"
                        className={`h-9 border-[1px] border-black dark:border-gray-400 focus:ring-2 disabled:bg-gray-100 focus:ring-primary focus:border-none pl-2 text-sm focus:outline-none block w-full bg-white dark:bg-slate-800 focus:bg-white form-input rounded-sm dark:text-gray-200`}
                      />
                    ) : (
                      <InputArea
                        type="date"
                        register={register}
                        name="from_date"
                        className="h-9"
                        defaultValue={defaultPreviousDate}
                      />
                    )}
                  </div>
                </div>
                {/* //* to date  */}
                <div>
                  <div className="text-sm text-gray-600 dark:text-white">
                    Enter To Date:
                  </div>
                  <div>
                    {dateFormat === "bs" ? (
                      <Calendar
                        onChange={({ bsDate, adDate }) => {
                          setValue("to_date", adDate);
                        }}
                        language="en"
                        className={`h-9 border-[1px] border-black dark:border-gray-400 focus:ring-2 disabled:bg-gray-100 focus:ring-primary focus:border-none pl-2 text-sm focus:outline-none block w-full bg-white dark:bg-slate-800 focus:bg-white form-input rounded-sm dark:text-gray-200`}
                      />
                    ) : (
                      <InputArea
                        type="date"
                        register={register}
                        name="to_date"
                        className="h-9"
                        defaultValue={defaultDate}
                      />
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            onClick={onsubmit}
            className={`inline-flex w-full justify-center rounded-md bg-primary hover:bg-opacity-90 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto`}
          >
            OK
          </button>
          <button
            type="button"
            ref={cancelButtonRef}
            className="mt-3 inline-flex w-full focus:outline-none justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            onClick={() => {
              setOpen(false);
              setSelectedDay("Today");
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommonDateRange;
