import { format } from "date-fns";

export const getMonthAndDay = (value) => {
	const date = new Date(value);
	const formattedDate = format(date, "MMM dd");
	return formattedDate;
};
