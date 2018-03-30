import {ToyBox} from "./ToyBox";

let toyBox = new ToyBox({uploadDir:__dirname + '/localUploads'});

console.log(toyBox.engine('local'));