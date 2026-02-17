type ParsedCookieData = Record<string, any>;

const parseAndGetCookie = (cookieName: string): ParsedCookieData | null => {
    if(document.cookie.length <= 0){
        return null;
    }
    const cookies = document.cookie.split("; ");

    for (const cookie of cookies) {
        const decoded = decodeURIComponent(cookie);
        const [key, rawVal] = decoded.split("=");
        
        if(key !== cookieName){
            continue;
        }

        if(!rawVal.startsWith("j:")){
            throw new Error("Parsed cookies should be in JSON format");
        }

        try{
            return JSON.parse(rawVal.slice(2))
        } catch(err){
            return null;
        }
    }
    
    return null;
}

export default parseAndGetCookie;