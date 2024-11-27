class EZ {
    constructor() {
        console.log("EZ instance!")
    }
    element(id) {
        return document.getElementById(id)
    }
    mylink() {
        return `${window.location.host}${window.location.pathname}${window.location.search}`
    }
}
const ez = new EZ()
export default {ez}