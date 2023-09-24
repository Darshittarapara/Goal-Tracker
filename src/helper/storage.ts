export const LOGIN_KEY = "login_key";
export const TOKEN_KEY = "token_key";
export const LOGIN_EMAIL = 'LOGIN_EMAIL'
/**This will give the docs paths string */
export const USER = "users";
export const GOALS = "goals";
export const GOALSIDLIST = "goalsIdList"
export const GOALSDOCUMENTID = 'd08hGAeg1STzSVHiI4uO'
export const FAVORITE_GOALS = "favoriteGoals"
export const goalListDropDownOption = {
	edit: "edit",
	delete: "delete",
	updateDailyProgress: "updateDailyProgress",
	viewDailyProgress: "viewDailyProgress"
}

/**
 * This will generate the user token
 * @returns string
 */
export function generateUUID()
{
	var d = new Date().getTime();
	
	if( window.performance && typeof window.performance.now === "function" )
	{
		d += performance.now();
	}
	
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c)
	{
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		// eslint-disable-next-line no-mixed-operators
		return (c==='x' ? r : (r&0x3|0x8)).toString(16);
	});

return uuid?.replaceAll("-", "");
}