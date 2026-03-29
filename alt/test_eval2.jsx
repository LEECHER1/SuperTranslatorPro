function testEval() {
    var str = '{"software":{"name":"LanguageTool","version":"6.8-SNAPSHOT","buildDate":"2026-03-28 18:36:00 +0000","apiVersion":1,"premium":true,"premiumHint":"You might be missing errors only the Premium version can find. Contact us at support<at>languagetoolplus.com.","status":""},"warnings":{"incompleteResults":false},"language":{"name":"German (Germany)","code":"de-DE","detectedLanguage":{"name":"English (US)","code":"en-US","confidence":1.0,"source":"ngram"}},"matches":[{"message":"Möglicher Tippfehler gefunden.","shortMessage":"Rechtschreibfehler","replacements":[{"value":"TV"}],"offset":0,"length":3,"context":{"text":"The quick brown fox jumps over the lazy dog...","offset":0,"length":3},"sentence":"The quick brown fox jumps over the lazy dog","type":{"typeName":"UnknownWord"},"rule":{"id":"GERMAN_SPELLER_RULE","description":"Möglicher Rechtschreibfehler","issueType":"misspelling","category":{"id":"TYPOS","name":"Mögliche Tippfehler"},"isPremium":false,"confidence":0.55},"ignoreForIncompleteSentence":false,"contextForSureMatch":0}]}';
    
    // Check if English text returns matches
    var parsed = eval("(" + str + ")");
    
    // The user wants to check ONLY German texts. 
    // We can use detectedLanguage code.
    $.writeln("Detected language: " + parsed.language.detectedLanguage.code);
}
testEval();
