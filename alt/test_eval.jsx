try {
    var j = eval("(" + '{"a":1}' + ")");
    $.writeln("Eval OK");
} catch(e) {
    $.writeln("Eval error: " + e.message);
}
