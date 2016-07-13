/*
 * Variables
 */ 

// Category: Nouns
var cat1 = [
            ['Kat1: slowo1', 'wartosc1'],
            ['Kat1: slowo2', 'wartosc2'],
            ['Kat1: slowo3', 'wartosc3'],
            ['Kat1: slowo4', 'wartosc4'],
            ['Kat1: slowo5', 'wartosc5']
            ],
//Category: Verbs
	cat2 = [
            ['Kat2: slowo1', 'wartosc1'],
            ['Kat2: slowo2', 'wartosc2'],
            ['Kat2: slowo3', 'wartosc3'],
            ['Kat2: slowo4', 'wartosc4'],
            ['Kat2: slowo5', 'wartosc5']
            ],
//Category: Adjectives
	cat3 = [
            ['Kat3: slowo1', 'wartosc1'],
            ['Kat3: slowo2', 'wartosc2'],
            ['Kat3: slowo3', 'wartosc3'],
            ['Kat3: slowo4', 'wartosc4'],
            ['Kat3: slowo5', 'wartosc5']
            ],
	ownWords = [], // Array for word list from local file
	words = [],    // Main array of words used in the current game
	learn = [],    // Array for words user is trying to learn
	known = [],	   // Array for words marked as known
	ran = 0,	   // Current random number coresponding with the index of a word in words array, initial 0
	hit = 0,	   // Number of correct answers
	miss = 0;	   // Number of wrong answers

/*
 * Functions
 */

// Populates 'learn' array with word indexes
var wordInit = function() {
		learn = [];
	for (var i = 0; i < words.length; i++) {
		learn.push(i);
	}
}
// Choses a random number between
// @int - if === 1 then chose random integer between 0 and @no
// @no - last number in the random range, inclusive
var randomise = function(no, int) {
	if (int === 1) {
		return Math.floor(Math.random() * (no + 1));
	} else {
		return Math.random();
	}
}

// Displays provided text in the form of animated <span> element
// @value - text input
// @target - target DOM element to which the span is appended
// @color - text color for the output
// @position - initial position of the text relative to 'top'
// @callback - callback function to execute once the animation is over
var animFloat = function(value, target, color, position, callback) {
	var countChanger = $('<span>').text(value).css('color', color).addClass('countChange').css('top', position).animate({opacity: 0, top: '-=40px'}, 2500, function() {
		$(this).remove();
		callback;
	});
	target.append(countChanger)
}

// Updates the hit/miss counters
// @direction: source and target boxes for change, used to display '+1' or '1' indicators above them
//			'k2l' - from known to learn
//			'l2k' - from learn to known
//			empty - just update the counters
var updateCounters = function(direction) {
	var knownCount = $('.known'),
		learnCount = $('.learn');
	if (direction === 'k2l') {
		animFloat('+1', learnCount, 'red', '-70px');
		animFloat('-1', knownCount, 'red', '-70px');
	} else if (direction === 'l2k') {
		animFloat('-1', learnCount, 'green', '-70px');
		animFloat('+1', knownCount, 'green', '-70px');
	}
	$('.known').find('.no').text(known.length);
	$('.learn').find('.no').text(learn.length);
}

// Show statistics after the game
// @clear - if false remove the statistics box from DOM
var displayStats = function(clear) {
	if (clear === false) {
		$('#display').empty();
		return;
	};
	var statistics = $('<div>').html(hit + " " + inflection('dobre', hit) + "</br>" + miss + " " + inflection('złe', miss));
	var header = $('<h3>').text('Statystyki:');
	statistics.prepend(header);
	$('#display').append(statistics);
}

// Main function for picking a word at random
var generate = function() {
	var ranOuter = randomise();
	if (ranOuter > 0.2) {
		console.log('wylosowano: nieznane');
		return _generate(learn);
	} else {
		if (known.length > 0) {
			console.log('wylosowano: znane');
			return _generate(known);
		} else {
			console.log('wylosowano: znane, ale puste');
			return _generate(learn);
		}
	}
}

//Helper function to pick a word at random from a given array and display it on screen
//@array to chose the word from
var _generate = function(array) {
	var ran = randomise(array.length-1, 1);
	$('#output').text(words[array[ran]][0]);
	return array[ran];
}

// Change the word form for after-game statistics according to the preceeding number, hurray for Polish!
// @word: limited to
//		'dobre' - for hits
//		'złe' - for misses
// @number - preceeding number
var inflection = function(word, number) {
	if (word === 'dobre') {
		if (number === 1) {
			return 'dobra odpowiedź';
		} else if ((number === 2 || number % 10 === 2 && number !== 12) || (number === 3 || number % 10 === 3 && number !== 13) || (number === 4 || number % 10 === 4 && number !== 14)) {
			return 'dobre odpowiedzi';
		} else {
			return 'dobrych odpowiedzi';
		}
	} else if (word === 'złe') {
		if (number === 1) {
			return 'zła odpowiedź';
		} else if ((number === 2 || number % 10 === 2 && number !== 12) || (number === 3 || number % 10 === 3 && number !== 13) || (number === 4 || number % 10 === 4 && number !== 14)) {
			return 'złe odpowiedzi';
		} else {
			return 'złych odpowiedzi';
		}
	}
}

// Main game logic
var gameMain = function() {
	if ($('#wInput').val() === words[ran][1]) {
		hit += 1;
		if ($.inArray(ran, known) == -1) {
			console.log('numer: ' + ran);
			known.push(ran);
			learn.splice(learn.indexOf(ran), 1);
			updateCounters('l2k');
			if (known.length === words.length) {
				$('#wInput').prop('disabled', true);
				animFloat('Koniec!', $('#display'), '#f90', '-90px', displayStats());
				$('.checkButton').remove();
				var newGame = $('<button>').text('Nowa gra!').addClass('checkButton');
				wordInit();
				newGame.on('click', function() {
						known = [];
						ran = 0;
						hit = 0;
						miss = 0;
						ran = generate();
					$('#wInput').prop('disabled', false).focus();
					$('.checkButton').remove();
					var check = $('<button>').text('Sprawdź!').addClass('checkButton').attr('type','submit');
					$('#wordForm').find('div').last().append(check);
					displayStats(false);
					$('#wInput').val("");
					$('.start').fadeIn();
				})	
				$('#wordForm').find('div').last().append(newGame)
				return;
			}
		}
		animFloat('Dobrze!', $('#display'), 'green', 0);
		updateCounters();
		ran = generate();
	} else {
		animFloat('Źle!', $('#display'), 'red', 0);
		miss += 1;
		if ($.inArray(ran, learn) == -1) {
			learn.push(ran);
			known.splice(known.indexOf(ran), 1);
			updateCounters('k2l');
		}
		updateCounters();
		ran = generate();
	}
	$('#wInput').val("");
}

// On document ready
$(document).ready(function() {
	// Clear input values
	$('#wInput').val("");
	$('#fileInput').val("");
	
	// Show the the fileInput box only when the appropriate option is selected
	$('.startBox select').on('change', function() {
		if ($(this).find('option:selected').val() === 'own') {
			$('#fileInput').show()
		} else {
			$('#fileInput').hide()
		}
	})
	
	// Upon clicking start load the selected category
	$('#start').on('click', function() {
		switch ($('.startBox select').find('option:selected').val()) {
		case ('cat1'):
			words=cat1;
			break;
		case ('cat2'): 
			words=cat2;
			break;
		case ('cat3'):
			words=cat3;
			break;
		case ('own'):
			words=ownWords;
			break;
		}
		wordInit();
		updateCounters();
		ran = generate();
		$('.start').fadeOut();
		$('#wInput').focus();
	});
	
	// Change event for fileInput for when the user selects a file
	$('#fileInput').on('change', function(e) {
		var file = $("#fileInput").prop('files')[0];;
		var reader = new FileReader();
		reader.onload = function(e) {
			var rows = reader.result.split(";");
			for (var i = 0; i < rows.length-1; i++) {
				ownWords.push(rows[i].split(":"));
			}
            console.log(ownWords);
        }
        reader.readAsText(file);    
	})
	
	// Upon submiting the wordForm prevent default action and load gameMain()
	$('#wordForm').on('submit', function(e) {
		e.preventDefault();
		gameMain();
	})
});