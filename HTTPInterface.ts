
function HTTPInterface() {
	this.localID = undefined;
}

HTTPInterface.prototype.init = async function() {
	console.log('getting local ID');
	await fetch(`http://localhost:5001/api/v0/id`, {
		method: 'POST'
	}).then(async function(response) {
		if (response.ok) {
			localID = await response.json();
			console.log(localID);
		} else {
			console.error('Error in response');
			console.error(response);
		}
	}).catch((err) => {
		console.error('No local api found');
		console.error(err);
	});
}

HTTPInterface.prototype.pin = async function(hash, title) {
	var ret = {
		success: 0,
		message: 'Something went wrong.'
	}
	console.log('pinning');
	let add = await fetch(`http://localhost:5001/api/v0/pin/add?arg=${hash}`, {
		method: 'POST'
	})
	.catch((err) => {
		ret.message = err;
	});
	
	
	if (add.ok) {
		console.log('added locally');
		let copy = fetch(`http://localhost:5001/api/v0/files/cp?arg=/ipfs/${hash}&arg=/${encodeURIComponent(title)}`, {
			method: 'POST'
		});
		copy.then(async (r2) => {
			console.log(r2);

			if (r2.ok) {
				ret.message = 'Copied to your local drive.';
				ret.success = 1;
			} else {
				ret.messeage = 'Copy did not complete. File may already exist in filesystem.';
			}
		});
		// call complete
		copy.catch((err) => { ret.message = 'file already exists'; });

		return ret;
	}
}


HTTPInterface.prototype.getFolder = function (path) {
	path = path || '/';
	return fetch(`http://localhost:5001/api/v0/files/ls?arg=${path}&long=true`, {
		method: 'POST'
	})
}



exports.HTTPInterface = HTTPInterface;