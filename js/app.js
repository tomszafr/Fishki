var words = [
             ['slowo1', 'wartosc1'],
             ['slowo2', 'wartosc2'],
             ['slowo3', 'wartosc3'],
             ['slowo4', 'wartosc4']
             ];
var learn = [0, 1, 2, 3];
var known = [];
var randomise = function(no, int) {
	if (int === 1) {
		return Math.floor(Math.random() * (no + 1));
	} else {
		return Math.random();
	}
	
}
var generate = function() {
	var ranOuter = randomise();
	var ran = 0;
	if (ranOuter > 0.25) {
		ran = randomise(learn.length-1, 1);
		$('#output').text(words[learn[ran]][0]);
		console.log('wylosowano: nieznane');
		return learn[ran];
	} else {
		if (known.length > 0) {
			ran = randomise(known.length-1, 1);
			$('#output').text(words[known[ran]][0]);
			console.log('wylosowano: znane');
			return known[ran];
		} else {
			ran = randomise(learn.length-1, 1);
			$('#output').text(words[learn[ran]][0]);
			console.log('wylosowano: znane, ale puste');
			return learn[ran];
		}
	}
}
$(document).ready(function() {
	var ran = generate();
	$('#check').on('click', function() {
		if ($('#input').val() === words[ran][1]) {
			alert('dobrze');
			if ($.inArray(ran, known) == -1) {
				console.log('numer: ' + ran);
				known.push(ran);
				if (known.length === words.length) {
					alert('Wygrales');
				}
			} 
			ran = generate();
		} else {
			alert('zle');
			ran = generate();
		}
	})
});