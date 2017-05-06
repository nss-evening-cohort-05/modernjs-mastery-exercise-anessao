$(document).ready(() => {
	$(".teamSelection").append(
		`<button type="button" class="btn btn-inverse navbar-btn navbar-right" id="x-men">X-Men</button>
	    <button type="button" class="btn btn-inverse navbar-btn navbar-right" id="avengers">The Avengers</button>
	    <button type="button" class="btn btn-inverse navbar-btn navbar-right" id="guardians">Guardians of the Galaxy</button>`
	);
	

	let chosenTeam = "";

	//fired in writeToDOM
	const setValues = (charArray, tArray, gArray) => {
		for (let y = 0; y < charArray.length; y++) {
			for (let z = 0; z < gArray.length; z++){
				if(charArray[y].gender_id === gArray[z].id){
					charArray[y].gender_id = gArray[z].type;
				} //end gender check
			}
			for (let a = 0; a < tArray.length; a++) {
				if(charArray[y].team_id === tArray[a].id) {
					charArray[y].team_id = tArray[a].name;
				} //end team check
			}
		}
		//set new descriptions based on gender
		for (let c = 0; c < charArray.length; c++) {
			if (charArray[c].gender_id === "Female" && charArray[c].description === ""){
				charArray[c].description = "abcde fghij klmno pqrst uvwxy z";
			} else if (charArray[c].gender_id === "Male" && charArray[c].description === ""){
				charArray[c].description = "1234567890";
			}
		}
	};

	//fired in Promise
	const writeToDOM = (allData) => {
		const characterArray = []; //set value of 0 for logic
		const teamArray = []; // set value of 2 for logic
		const genderArray = []; //set value of 1 for logic
		const chosenCharacters = [];

		//SEPERATE ITEMS
		for(let x = 0; x < allData.length; x++) {
			if (allData[x].value === 0){
				characterArray.push(allData[x]);
			} else if (allData[x].value === 1) {
				genderArray.push(allData[x]);
			} else {
				teamArray.push(allData[x]);
			}
		} //end for loop
		
		//SET VALUES FOR DOM LOOPING
		setValues(characterArray, teamArray, genderArray);

		//SET CHOSEN CHARACTERS
		for (let a = 0; a < characterArray.length; a++) {
			for (let b = 0; b < teamArray.length; b++) {
				if (teamArray[b].name === chosenTeam && characterArray[a].team_id === teamArray[b].name){
					chosenCharacters.push(characterArray[a]);
				}
			}
		}//end for loop

		//SETTING DOM STRING
		let domString = "";
		let counter = 0;
		for (let b = 0; b < chosenCharacters.length; b++) {
			if (b % 4 === 0) {
				domString += `<div class="row">`;
			}
			domString += `<div class="col-md-3 col-lg-3 col-sm-6 characterCard"><div class="panel panel-inverse">
  			<div class="panel-heading orange">
    		<h3 class="panel-title">${chosenCharacters[b].name}</h3>
  			</div>
  			<div class="panel-body">
    		<img class="${chosenCharacters[b].gender_id} characterImage" src="${chosenCharacters[b].image}">
    		<p class="description">${chosenCharacters[b].description}</p>
  			</div>
			</div></div>`;
			if (b % 4 === 3){
				domString += `</div>`;
			}
		}
		$("#characters").append(domString);
	};

	//btn click event
	const dataGetter = () => {
		const loadCharacters = () => {
			return new Promise((resolve, reject) => {
				$.ajax("./db/characters.json").done((data1) => {
					resolve(data1.characters);
				}).fail((error1) => {
					reject(error1);
				});
			});
		};
		const loadGenders = () => {
			return new Promise((resolve, reject) => {
				$.ajax("./db/genders.json").done((data2) => {
					resolve(data2.genders);
				}).fail((error2) => {
					reject(error2);
				});
			});

		};
		const loadTeams = () => {
			return new Promise((resolve, reject) => {
				$.ajax("./db/teams.json").done((data3) => {
					resolve(data3.teams);
				}).fail((error3) => {
					reject(error3);
				});
			});
		};

		Promise.all([loadCharacters(), loadGenders(), loadTeams()])
		.then((results) => {
			const allDataArray = [];
			let counter = 0;
			results.forEach((dataObjs) => {
				dataObjs.forEach((individualItem) => {
					individualItem.value = counter;
					allDataArray.push(individualItem);
				});
				counter++;
			});
			writeToDOM(allDataArray);

		}).catch((dataFail) => {
			console.log("failed loading", dataFail);
			$("#characters").html(`<h3 class="fail">There was a problem with loading the characters!</h3>`);
		});
	};


	$(".btn").click((event) => {
	    chosenTeam = $(event.currentTarget).html();
	    $("#characters").html("");
	    dataGetter();
	});
























}); //end document.ready