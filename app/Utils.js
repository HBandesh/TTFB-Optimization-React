export default class Utils {
    static sleep(milliseconds = 166666) {
        var arr = [];
        for (var i = 0; i < milliseconds; i++) {
            arr.push("<li>'dummy html created'</li>");
        }
        return arr;
      }
}