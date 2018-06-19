/**
 * Created by stefanos on 2/3/2017.
 */

export function getCookie(name: string) : string {
    let ca: string[] = document.cookie.split(';');
    let caLen: number = ca.length;
    let cookieName = `${name}=`;
    let c: string;
    console.log(`document.cookie is: ${document.cookie.toString()}`);
    console.log(`ca is: ${JSON.stringify(ca)}`);
    for (let i: number = 0; i < caLen; i += 1) {
        c = ca[i].replace(/^\s+/g, '');
        if (c.indexOf(cookieName) == 0) {
            return c.substring(cookieName.length, c.length);
        }
    }

    return null;
}

export function deleteCookie(name) {
    setCookie(name, '', -1);
    console.log(`after delete: document.cookie is: ${document.cookie.toString()}`);
}

/* defaulr path used to be '' */
function setCookie(name: string, value: string, expireDays: number, path: string = '/') {
    let d:Date = new Date();
    d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
    let expires:string = `expires=${d.toUTCString()}`;
    /*let cpath:string = path ? `; path=${path}` : '';*/
    /*document.cookie = `${name}=${value}; ${expires}${cpath}`;*/

    /* new code from Argyro */
    let domain = "";
    if (document.domain.indexOf(".di.uoa.gr")!= -1) { // for development
      domain = ".athenarc.gr";
    } else if(document.domain.indexOf(".openaire.eu") != -1) {
      domain = ".openaire.eu";
    }
    document.cookie = name+'='+value+'; path='+path+'; domain='+domain+';';
}
