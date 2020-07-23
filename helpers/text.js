TruncuateString = function(phrase, limit, ending) {
    // Prepare ending
    if (typeof ending === 'undefined') {
        ending = '...';
    }

    // Check if phrase is longer than limit
    if (phrase.length > limit) {
        return phrase.slice(0, limit) + ending;
    } else {
        return phrase;
    }
};

PadWithCharacter = function(phrase, length, character, onLeft) {
    if (typeof phrase !== 'undefined') {
        if (typeof length !== 'undefined' && typeof character !== 'undefined') {
            // Parameters
            onLeft = typeof onLeft !== 'undefined' ? onLeft : true;

            // Check if phrase is shorter than desired length
            while (phrase.length < length) {
                if (onLeft === true) {
                    phrase = character + phrase;
                } else {
                    phrase = phrase + character;
                }
            }
            return phrase;
        } else {
            return phrase;
        }
    }
};

CapitalizePhraseOrWord = function(word, removeSpaces) {
    if (typeof word !== 'undefined') {
        // Check if empty spaces should be removed
        removeSpaces = typeof removeSpaces !== 'undefined' ? removeSpaces : false;

        if (typeof word === 'string') {
            // Capitalize all words
            let r = word.replace(/[^-'`"\s]+/g, function(word) {
                return word.replace(/^./, function(first) {
                    return first.toUpperCase();
                });
            });

            // Remove spaces
            if (removeSpaces === true) {
                r = r.replace(/ /g, '');
            }

            // Return modified
            return r;
        } else {
            // Return unmodified
            return word;
        }
    } else {
        return null;
    }
};

exports.truncuateString = TruncuateString;
exports.padWithCharacter = PadWithCharacter;
exports.capitalizePhraseOrWord = CapitalizePhraseOrWord;
