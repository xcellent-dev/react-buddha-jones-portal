SearchPhraseInString = function(sentence, phrase, ignoreCase, breakWords) {
    // Check if all necessary parameters are defined
    if (typeof sentence !== 'undefined' && typeof phrase !== 'undefined') {
        // Prepare case
        if (typeof ignoreCase !== 'undefined' && ignoreCase === true) {
            sentence = typeof sentence.toLowerCase !== 'undefined' ? sentence.toLowerCase()
                : typeof sentence.toString !== 'undefined' ? sentence.toString().toLowerCase() : '';
            phrase = typeof phrase.toLowerCase !== 'undefined' ? phrase.toLowerCase()
                : typeof phrase.toString !== 'undefined' ? phrase.toString().toLowerCase() : '';
        }

        // Check if words should be broken
        if (typeof breakWords !== 'undefined' && breakWords === true) {
            // Split sentence into words
            const sentenceWords = sentence.split(' ');
            const phraseWords = phrase.split(' ');

            // Iterate through all words
            for (let s = 0; s < sentenceWords.length; s++) {
                const sentenceWord = sentenceWords[s];
                for (let p = 0; p < phraseWords.length; p++) {
                    const phraseWord = phraseWords[p];
                    if (sentenceWord.indexOf(phraseWord) !== -1) {
                        return true;
                    }
                }
            }
        } else {
            if (sentence.indexOf(phrase) !== -1) {
                return true;
            }
        }
    }

    // Not found
    return false;
};

exports.searchPhraseInString = SearchPhraseInString;
