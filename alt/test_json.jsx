try {
    var j = JSON.parse('{"a":1}');
    $.writeln("JSON OK");
} catch(e) {
    $.writeln("JSON error: " + e.message);
}
