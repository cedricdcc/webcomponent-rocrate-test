//this file will contain all functions that will handle uri hash changes

//function to get the hash from the uri
export function getHash() {
    return window.location.hash;
}

//function to set the hash in the uri
export function setHash(hash) {
    window.location.hash = hash;
}



