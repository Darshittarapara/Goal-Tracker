export const LOGIN_KEY = "login_key";
export const TOKEN_KEY = "token_key";

/**This will give the docs paths string */
export const USER = "users"
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

return uuid;
}