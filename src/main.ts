import './assets/styles/styles.scss';
import {  Hero } from './test'

function getName(name: String) {
    return name;
}

console.log(getName('krunal Dave'));

let hero = new Hero('Jignesh Raval 654123');
console.log(hero.myName());
