/*
 * @return string "Mobile" or "Desktop"
 */

const detectDeviceType = () =>
	/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		navigator.userAgent
	)
		? 'Mobile'
		: 'Desktop';

export { detectDeviceType };
