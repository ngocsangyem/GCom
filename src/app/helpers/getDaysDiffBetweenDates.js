/*
 * @param {Date} dateInitial
 * @param {Date} dateFinal
 * @return number
 * @example
 * getDaysDiffBetweenDates(new Date('2017-12-13'), new Date('2017-12-22')); => 9
 */

const getDaysDiffBetweenDates = (dateInitial, dateFinal) =>
	(dateFinal - dateInitial) / (1000 * 3600 * 24);
