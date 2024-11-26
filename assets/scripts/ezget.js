class EZ {
    element(id) {
        return document.getElementById(id)
    }
    mylink() {
        return `${window.location.host}${window.location.pathname}${window.location.search}`
    }
}
const ez = EZ
export default {ez}