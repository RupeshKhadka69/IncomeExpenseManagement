import NepaliDate from "nepali-date-converter";
export const getADDate = (value) => {
    const utcDate = new Date(value);
    const year = utcDate.getUTCFullYear();
    const month = String(utcDate.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(utcDate.getUTCDate()).padStart(2, "0");
  
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };
export const getLocalADBSDate = (dateFormat, date) => {
    let formattedDate;
    if (date) {
      formattedDate =
        dateFormat === "bs"
          ? new NepaliDate(new Date(date)).format("YYYY-MM-DD")
          : getADDate(date);
    }
    return formattedDate;
  };