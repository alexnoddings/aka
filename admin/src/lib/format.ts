export function makeDateRelativeLong(datetime?: string, capitalise?: boolean) {
	if (!datetime) {
		return 'Never';
	}

	const value = new Date(datetime);

	const now = new Date();
	const today = new Date(now.toDateString());
	if (value > today) {
		const options: Intl.DateTimeFormatOptions = {
			hour: 'numeric',
			minute: 'numeric',
			timeZoneName: undefined
		};
		const todayText = capitalise ? 'Today' : 'today';
		return `${todayText} at ${value.toLocaleTimeString(undefined, options)}`;
	}

	const yesterday = new Date(today.toISOString());
	yesterday.setDate(yesterday.getDate() - 1);
	if (value > yesterday) {
		const options: Intl.DateTimeFormatOptions = {
			hour: 'numeric',
			minute: 'numeric',
			timeZoneName: undefined
		};
		const yesterdayText = capitalise ? 'Yesterday' : 'yesterday';
		return `${yesterdayText} at ${value.toLocaleTimeString(undefined, options)}`;
	}

	const year1st = new Date(today.toISOString());
	year1st.setMonth(1);
	year1st.setDate(1);
	if (value > year1st) {
		const options: Intl.DateTimeFormatOptions = {
			year: undefined,
			month: 'long',
			day: 'numeric',
			timeZoneName: undefined
		};
		return value.toLocaleDateString(undefined, options);
	}

	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZoneName: undefined
	};
	return value.toLocaleDateString(undefined, options);
}

// These are a horrendous simplification since days aren't exactly 24 hours, and leap years exist.
// This will also screw up around daylight savings, but it's good enough for our usage.
const oneMinute = 60 * 1000;
const oneHour = oneMinute * 60;
const oneDay = oneHour * 24;
const oneYear = oneDay * 365;

export function makeDateRelativeShort(datetime?: string) {
	if (!datetime) {
		return '-';
	}

	const now = new Date();
	const value = new Date(datetime);
	const diff = now - value;

	const years = Math.floor(diff / oneYear);
	if (years > 0) {
		return years + 'y';
	}

	const days = Math.floor(diff / oneDay);
	if (days > 0) {
		return days + 'd';
	}

	const hours = Math.floor(diff / oneHour);
	if (hours > 0) {
		return hours + 'h';
	}

	const minutes = Math.floor(diff / oneMinute);
	if (minutes > 0) {
		return minutes + 'm';
	}

	return 'now';
}
