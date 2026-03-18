
async function fetchData(espIp: string) {
    //fetch request to esp-ip/data
    try {
        const res = await fetch("http://" + espIp + "/data");
        if (res.ok) {
            const bodyText = await res.text();
            console.log("bodyText: " + bodyText);
            const bodyJson = JSON.parse(bodyText);
            console.log("bodyJson: " + bodyJson);
            return bodyJson
        } else {
            console.error("res was not OK");
            return false;
        }
    } catch (e) {
        console.error(e);
        return false;
    }
}

async function fetchMoveToNext(espIp: string) {
    try {
        const res = await fetch("http://" + espIp + "/N");
        if (!res.ok) console.error("res was not OK");

    } catch (e) {
        console.error(e);
        return false;
    }
}

export { fetchData, fetchMoveToNext }